/* Integration check for VAT invoicing. Run: npx tsx scripts/test-invoicing.ts (needs migrated + seeded DB). */
import assert from "node:assert/strict";
import { prisma } from "../lib/db";
import { createOrder } from "../server/services/orderService";
import { breakdownFromTtc } from "../lib/vat";
import { can } from "../lib/rbac";

async function main() {
  // pure VAT math: 11 TTC @10% -> HT 10, TVA 1 ; 15 -> HT 14 (13.64), TVA 1
  assert.deepEqual(breakdownFromTtc(11, 10), { subtotalHt: 10, vatRate: 10, vatMad: 1, totalTtc: 11 });
  assert.equal(breakdownFromTtc(0, 10).vatMad, 0);

  // RBAC
  assert.equal(can("TAX_AUDITOR", "invoice:cancel"), false);
  assert.equal(can("ACCOUNTANT", "invoice:cancel"), true);
  assert.equal(can("CUSTOMER", "cash:manage"), false);

  const before = await prisma.invoice.count({ where: { cafeId: "cafe_demo" } });

  // duplicate productId lines must work (old bug)
  const o1 = await createOrder("u_client", "CUSTOMER", {
    cafeId: "cafe_demo",
    items: [{ productId: "p_espresso", quantity: 2 }, { productId: "p_espresso", quantity: 1 }, { productId: "p_croissant", quantity: 1 }],
  });
  assert.equal(o1.totalMad, 11 * 3 + 8);
  assert.equal(o1.invoice!.totalTtc, 41);
  assert.equal(o1.invoice!.subtotalHt + o1.invoice!.vatMad, 41);
  assert.equal(o1.invoice!.cafeIce, "001234567000089");

  const o2 = await createOrder("u_client", "CUSTOMER", { cafeId: "cafe_demo", items: [{ productId: "p_nss", quantity: 1 }] });
  assert.equal(o2.invoice!.number, o1.invoice!.number + 1, "gapless numbering");

  // concurrent orders: numbers unique and consecutive
  const batch = await Promise.all(
    Array.from({ length: 5 }, () => createOrder("u_client", "CUSTOMER", { cafeId: "cafe_demo", items: [{ productId: "p_nss", quantity: 1 }] })),
  );
  const nums = batch.map((o) => o.invoice!.number).sort((a, b) => a - b);
  assert.equal(new Set(nums).size, 5, "no duplicate numbers");
  assert.equal(nums[4] - nums[0], 4, "no gaps");

  // forbidden role
  await assert.rejects(() => createOrder("u_tax", "TAX_AUDITOR", { cafeId: "cafe_demo", items: [{ productId: "p_nss", quantity: 1 }] }), /FORBIDDEN/);
  // unavailable product
  await assert.rejects(() => createOrder("u_client", "CUSTOMER", { cafeId: "cafe_demo", items: [{ productId: "nope", quantity: 1 }] }), /unavailable/);

  const after = await prisma.invoice.count({ where: { cafeId: "cafe_demo" } });
  assert.equal(after - before, 7);
  console.log("ALL INVOICING CHECKS PASSED");
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());
