export const UserRole = {
  CUSTOMER: "CUSTOMER",
  SELLER: "SELLER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/**
 * First-pass permission keys only. No runtime authorization yet.
 */
export type PermissionKey =
  | "service:view"
  | "service:manage"
  | "project:view"
  | "project:manage"
  | "quote:view"
  | "quote:create"
  | "quote:send"
  | "quote:accept"
  | "designProof:view"
  | "designProof:send"
  | "designProof:confirm"
  | "ownedItem:view"
  | "ownedItem:receive"
  | "ownedItem:inspect"
  | "order:view"
  | "order:pay"
  | "shipment:view"
  | "shipment:manage"
  | "admin:access";
