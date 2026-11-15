import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../../../lib/db";
import { HttpError, assertCafeAccess, getSession } from "../../../../../../lib/auth";
import { assertCan } from "../../../../../../lib/rbac";
import { handleError } from "../../../../../../lib/http";

const closeSchema = z.object({ closingMad: z.number().int().min(0) });

// POS: close the drawer ("Z de caisse"). expected = opening + cash payments received during the session.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = getSession(req);
    assertCan(session.role, "cash:manage");
    const { id } = await params;
    const { closingMad } = closeSchema.parse(await req.json());

    const cashSession = await prisma.cashSession.findUnique({ where: { id } });
    if (!cashSession) throw new HttpError(404, "Cash session not found");
    await assertCafeAccess(session, cashSession.cafeId);
    if (cashSession.status === "CLOSED") throw new HttpError(409, "Already closed");

    const closedAt = new Date();
    const cash = await prisma.payment.aggregate({
      _sum: { amountMad: true },
      where: {
        method: "CASH",
        status: "PAID",
        createdAt: { gte: cashSession.openedAt, lte: closedAt },
        order: { cafeId: cashSession.cafeId },
      },
    });
    const expectedMad = cashSession.openingMad + (cash._sum.amountMad ?? 0);

    const updated = await prisma.cashSession.update({
      where: { id },
      data: { status: "CLOSED", closingMad, expectedMad, closedAt },
    });
    return NextResponse.json({ cashSession: updated, differenceMad: closingMad - expectedMad });
  } catch (error) {
    return handleError(error);
  }
}
