import { prisma } from "../../lib/db";

export async function listCafes() {
  return prisma.cafe.findMany({
    where: { isOpen: true },
    orderBy: { rating: "desc" },
    select: { id: true, name: true, description: true, address: true, imageUrl: true, rating: true, isOpen: true },
  });
}
