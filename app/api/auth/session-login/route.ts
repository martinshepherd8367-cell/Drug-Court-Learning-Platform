import { NextRequest, NextResponse } from "next/server";
import { getAuth, getDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const { idToken } = await req.json();
        if (!idToken || typeof idToken !== "string") {
            return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
        }

        // Verify the ID token, then mint a session cookie
        const decoded = await getAuth().verifyIdToken(idToken);

        const expiresIn = 5 * 24 * 60 * 60 * 1000; // 5 days
        const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });

        // Fetch user role for redirect logic
        const userDoc = await getDb().collection("users").doc(decoded.uid).get();
        const userData = userDoc.data();

        if (userData?.status === "inactive") {
            return NextResponse.json({ error: "Your account is inactive. Please contact your clinical director." }, { status: 403 });
        }

        const role = userData?.role || "participant";

        const res = NextResponse.json({ uid: decoded.uid, role }, { status: 200 });
        res.cookies.set("session", sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: expiresIn / 1000,
        });
        return res;
    } catch (e: any) {
        return NextResponse.json(
            { error: "Unauthorized", detail: e?.message || String(e) },
            { status: 401 }
        );
    }
}
