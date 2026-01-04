import { cookies } from "next/headers";
import { getAuth, getDb } from "@/lib/firebase-admin";

export type AuthedUser = {
  uid: string;
  email?: string | null;
  role: "admin" | "facilitator" | "participant";
  name: string;
};

export async function getAuthenticatedUser(): Promise<AuthedUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;

  try {
    const decoded = await getAuth().verifySessionCookie(session, true);

    const userDoc = await getDb().collection("users").doc(decoded.uid).get();
    const role = userDoc.exists ? (userDoc.data()?.role as AuthedUser["role"] | undefined) : undefined;

    if (!role) return null;

    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      role,
      name: userDoc.data()?.name || "Unknown User"
    };
  } catch {
    return null;
  }
}
