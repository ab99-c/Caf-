import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/db";
import { breakdownFromTtc } from "../../lib/vat";
import { assertCan, type Role } from "../../lib/rbac";
import type { CreateOrderInput } from "../validators/order";

const MAX_INVOICE_RETRIES = 5;

export async function createOrder(userId: string, role: Role, input: CreateOrderInput) {
  assertCan(role, "order:create");

  const productIds = [...new Set(input.items.map((item) => item.productId))];
  const [cafe, products] = await Promise.all([
    prisma.cafe.findUnique({ where: { id: input.cafeId } }),
    prisma.product.findMany({ where: { id: { in: productIds }, cafeId: input.cafeId, available: true } }),
  ]);
  if (!cafe || !cafe.isOpen) throw new Error("Cafe is unavailable");
  if (products.length !== productIds.length) throw new Error("One or more products are unavailable");

  const priceById = new Map(products.map((p) => [p.id, p.priceMad]));
  const totalMad = input.items.reduce((sum, item) => sum + priceById.get(item.productId)! * item.quantity, 0);
  const vat = breakdownFromTtc(totalMad, cafe.vatRate);
  const year = new Date().getFullYear();

  // Invoice numbers must be gapless per (cafe, year): allocate inside the same transaction as the order.
  // The @@unique([cafeId, year, number]) constraint protects against races; we retry on conflict.
  for (let attempt = 0; attempt < MAX_INVOICE_RETRIES; attempt++) {
    try {
      return await prisma.$transaction(async (tx) => {
        const last = await tx.invoice.aggregate({ where: { cafeId: cafe.id, year }, _max: { number: true } });
        const number = (last._max.number ?? 0) + 1;

        return tx.order.create({
          data: {
            userId,
            cafeId: cafe.id,
            totalMad,
            deliveryAddress: input.deliveryAddress,
            notes: input.notes,
            items: {
              create: input.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitMad: priceById.get(item.productId)!,
              })),
            },
            invoice: {
              create: {
                number,
                year,
                cafeId: cafe.id,
                cafeIce: cafe.ice,
                subtotalHt: vat.subtotalHt,
                vatRate: vat.vatRate,
                vatMad: vat.vatMad,
                totalTtc: vat.totalTtc,
              },
            },
          },
          include: { items: true, invoice: true },
        });
      });
    } catch (error) {
      const conflict = error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
      if (!conflict || attempt === MAX_INVOICE_RETRIES - 1) throw error;
    }
  }
  throw new Error("Could not allocate invoice number");
}
