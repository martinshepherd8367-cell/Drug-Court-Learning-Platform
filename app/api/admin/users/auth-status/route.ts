
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const admin = await getAuthenticatedUser();
        if (!admin || admin.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Missing email" }, { status: 400 });
        }

        const auth = getAuth();
        try {
            const authUser = await auth.getUserByEmail(email);
            return NextResponse.json({
                exists: true,
                uid: authUser.uid,
                lastSignInTime: authUser.metadata.lastSignInTime
            });
        } catch (e: any) {
            if (e.code === 'auth/user-not-found') {
                return NextResponse.json({ exists: false });
            }
            throw e;
        }

    } catch (error: any) {
        console.error("Auth status check failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
