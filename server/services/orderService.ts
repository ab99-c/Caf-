import { prisma } from "../../lib/db";
import type { CreateOrderInput } from "../validators/order";

export async function createOrder(userId: string, input: CreateOrderInput) {
  const products = await prisma.product.findMany({ where: { id: { in: input.items.map((item) => item.productId) }, cafeId: input.cafeId, available: true } });
  const priceById = new Map(products.map((product) => [product.id, product.priceMad]));
  if (products.length !== input.items.length) throw new Error("One or more products are unavailable");

  const totalMad = input.items.reduce((sum, item) => sum + (priceById.get(item.productId) || 0) * item.quantity, 0);

  return prisma.order.create({
    data: {
      userId,
      cafeId: input.cafeId,
      totalMad,
      deliveryAddress: input.deliveryAddress,
      notes: input.notes,
      items: { create: input.items.map((item) => ({ productId: item.productId, quantity: item.quantity, unitMad: priceById.get(item.productId)! })) },
    },
    include: { items: true },
  });
}
