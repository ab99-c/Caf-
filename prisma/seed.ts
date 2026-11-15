import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const cafe = await prisma.cafe.upsert({
    where: { id: "cafe_demo" },
    update: {},
    create: { id: "cafe_demo", name: "Café Demo", address: "Casablanca", ice: "001234567000089", taxId: "12345678", rc: "RC-1001", vatRate: 10 },
  });

  const users = [
    { id: "u_client", name: "Client", role: "CUSTOMER", phone: "+212600000001" },
    { id: "u_owner", name: "Mol L9hwa", role: "CAFE_OWNER", phone: "+212600000002" },
    { id: "u_staff", name: "Caissier", role: "CAFE_STAFF", phone: "+212600000003" },
    { id: "u_acc", name: "Comptable", role: "ACCOUNTANT", phone: "+212600000004" },
    { id: "u_tax", name: "Auditeur DGI", role: "TAX_AUDITOR", phone: "+212600000005" },
  ] as const;
  for (const u of users) await prisma.user.upsert({ where: { id: u.id }, update: {}, create: { ...u } });

  for (const userId of ["u_owner", "u_staff", "u_acc"]) {
    await prisma.cafeStaff.upsert({
      where: { userId_cafeId: { userId, cafeId: cafe.id } },
      update: {},
      create: { userId, cafeId: cafe.id },
    });
  }

  const products = [
    { id: "p_espresso", name: "Espresso", priceMad: 11 },
    { id: "p_nss", name: "Nous-nous", priceMad: 15 },
    { id: "p_croissant", name: "Croissant", priceMad: 8 },
  ];
  for (const p of products) await prisma.product.upsert({ where: { id: p.id }, update: {}, create: { ...p, cafeId: cafe.id } });
}

main().finally(() => prisma.$disconnect());
