import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/db";
import { HttpError, assertCafeAccess, getSession } from "../../../../../../lib/auth";
import { assertCan } from "../../../../../../lib/rbac";
import { handleError } from "../../../../../../lib/http";

// Invoices are never deleted (gapless numbering); they are marked CANCELLED. Accountant/admin only.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = getSession(req);
    assertCan(session.role, "invoice:cancel");
    const { id } = await params;

    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new HttpError(404, "Invoice not found");
    await assertCafeAccess(session, invoice.cafeId);
    if (invoice.status === "CANCELLED") throw new HttpError(409, "Already cancelled");

    const updated = await prisma.invoice.update({ where: { id }, data: { status: "CANCELLED" } });
    return NextResponse.json({ invoice: updated });
  } catch (error) {
    return handleError(error);
  }
}
