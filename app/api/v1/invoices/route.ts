import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/db";
import { assertCafeAccess, getSession } from "../../../../lib/auth";
import { assertCan } from "../../../../lib/rbac";
import { handleError } from "../../../../lib/http";
import { formatInvoiceNumber } from "../../../../lib/vat";

const querySchema = z.object({
  cafeId: z.string().min(1),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
});

// Accountant / owner / staff / tax auditor: list invoices of a cafe.
export async function GET(req: Request) {
  try {
    const session = getSession(req);
    assertCan(session.role, "invoice:read");
    const { cafeId, year } = querySchema.parse(Object.fromEntries(new URL(req.url).searchParams));
    await assertCafeAccess(session, cafeId);

    const invoices = await prisma.invoice.findMany({
      where: { cafeId, ...(year ? { year } : {}) },
      orderBy: [{ year: "desc" }, { number: "desc" }],
      take: 200,
    });
    const totals = invoices
      .filter((i) => i.status !== "CANCELLED")
      .reduce((t, i) => ({ ht: t.ht + i.subtotalHt, vat: t.vat + i.vatMad, ttc: t.ttc + i.totalTtc }), { ht: 0, vat: 0, ttc: 0 });

    return NextResponse.json({
      invoices: invoices.map((i) => ({ ...i, reference: formatInvoiceNumber(i.year, i.number) })),
      totals,
    });
  } catch (error) {
    return handleError(error);
  }
}
