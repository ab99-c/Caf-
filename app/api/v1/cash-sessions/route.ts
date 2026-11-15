import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/db";
import { HttpError, assertCafeAccess, getSession } from "../../../../lib/auth";
import { assertCan } from "../../../../lib/rbac";
import { handleError } from "../../../../lib/http";

const openSchema = z.object({
  cafeId: z.string().min(1),
  openingMad: z.number().int().min(0),
});

// POS: open the cash drawer (one open session per cafe).
export async function POST(req: Request) {
  try {
    const session = getSession(req);
    assertCan(session.role, "cash:manage");
    const input = openSchema.parse(await req.json());
    await assertCafeAccess(session, input.cafeId);

    const existing = await prisma.cashSession.findFirst({ where: { cafeId: input.cafeId, status: "OPEN" } });
    if (existing) throw new HttpError(409, "A cash session is already open for this cafe");

    const cashSession = await prisma.cashSession.create({
      data: { cafeId: input.cafeId, openedById: session.userId, openingMad: input.openingMad },
    });
    return NextResponse.json({ cashSession }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
