export type Role = "CUSTOMER" | "CAFE_OWNER" | "CAFE_STAFF" | "ACCOUNTANT" | "TAX_AUDITOR" | "ADMIN";

export type Permission =
  | "order:create"
  | "order:manage"
  | "invoice:read"
  | "invoice:cancel"
  | "cash:manage"
  | "report:read";

const PERMISSIONS: Record<Role, Permission[]> = {
  CUSTOMER: ["order:create"],
  CAFE_STAFF: ["order:manage", "cash:manage", "invoice:read"],
  CAFE_OWNER: ["order:manage", "cash:manage", "invoice:read", "report:read"],
  ACCOUNTANT: ["invoice:read", "invoice:cancel", "report:read"],
  TAX_AUDITOR: ["invoice:read", "report:read"], // read-only
  ADMIN: ["order:create", "order:manage", "invoice:read", "invoice:cancel", "cash:manage", "report:read"],
};

export function can(role: Role, permission: Permission): boolean {
  return PERMISSIONS[role]?.includes(permission) ?? false;
}

export function assertCan(role: Role, permission: Permission): void {
  if (!can(role, permission)) throw new Error("FORBIDDEN");
}
