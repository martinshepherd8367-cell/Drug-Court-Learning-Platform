import { cookies } from "next/headers";
import { getAuth, getDb } from "@/lib/firebase-admin";

export type AuthedUser = {
  uid: string; // Profile ID
  authUid: string; // Firebase Auth UID
  email?: string | null;
  role: "admin" | "facilitator" | "participant" | "case_manager";
  name: string;
};

export async function getAuthenticatedUser(): Promise<AuthedUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;

  try {
    const decoded = await getAuth().verifySessionCookie(session, true);

    // Fetch user profile - check both by doc ID (admin) and userId field (bound users)
    let userDoc = await getDb().collection("users").doc(decoded.uid).get();
    let userData = userDoc.exists ? userDoc.data() : null;
    let profileId = decoded.uid;

    if (!userData) {
      const boundUsers = await getDb().collection("users").where("userId", "==", decoded.uid).limit(1).get();
      if (!boundUsers.empty) {
        userDoc = boundUsers.docs[0];
        userData = userDoc.data();
        profileId = userDoc.id;
      }
    }

    const role = userData?.role as AuthedUser["role"] | undefined;

    if (!role || userData?.status === "inactive") return null;

    return {
      uid: profileId,
      authUid: decoded.uid,
      email: decoded.email ?? null,
      role,
      name: userData?.name || "Unknown User"
    };
  } catch {
    return null;
  }
}
