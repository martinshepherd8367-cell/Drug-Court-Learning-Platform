import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/firebase-admin";

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

        const res = NextResponse.json({ uid: decoded.uid }, { status: 200 });
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
