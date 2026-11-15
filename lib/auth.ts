import type { Role } from "./rbac";
import { prisma } from "./db";

export type Session = { userId: string; role: Role };

const ROLES: Role[] = ["CUSTOMER", "CAFE_OWNER", "CAFE_STAFF", "ACCOUNTANT", "TAX_AUDITOR", "ADMIN"];

/**
 * PLACEHOLDER authentication.
 * Real auth (sessions/JWT) is not implemented yet. For local development only, the caller is
 * identified by `x-user-id` + `x-user-role` headers. In production this ALWAYS fails (401),
 * so these headers can never be used to impersonate a user.
 */
export function getSession(req: Request): Session {
  if (process.env.NODE_ENV === "production") throw new HttpError(401, "Authentication not configured");
  const userId = req.headers.get("x-user-id");
  const role = req.headers.get("x-user-role") as Role | null;
  if (!userId || !role || !ROLES.includes(role)) throw new HttpError(401, "Unauthenticated");
  return { userId, role };
}

/** ADMIN and TAX_AUDITOR see every cafe; everyone else only cafes they are staff of. */
export async function assertCafeAccess(session: Session, cafeId: string): Promise<void> {
  if (session.role === "ADMIN" || session.role === "TAX_AUDITOR") return;
  const link = await prisma.cafeStaff.findUnique({ where: { userId_cafeId: { userId: session.userId, cafeId } } });
  if (!link) throw new HttpError(403, "No access to this cafe");
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
