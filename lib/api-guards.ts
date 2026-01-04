import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth-server";

export type Role = "admin" | "facilitator" | "participant";

type AuthUser = {
  uid: string;
  role: Role;
};

export async function requireRole(
  allowed: Role | Role[],
  _req?: NextRequest
): Promise<AuthUser> {
  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];

  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  if (!allowedRoles.includes(user.role as Role)) {
    throw new Error("FORBIDDEN");
  }
  return { uid: user.uid, role: user.role as Role };
}

export async function protectPage(allowed: Role | Role[]) {
  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  if (!allowedRoles.includes(user.role as Role)) {
    if (user.role === "admin") redirect("/admin");
    if (user.role === "facilitator") redirect("/facilitator");
    redirect("/participant");
  }
}
