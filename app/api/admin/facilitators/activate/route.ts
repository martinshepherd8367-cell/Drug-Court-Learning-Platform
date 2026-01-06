
import { NextRequest, NextResponse } from "next/server";
import { getDb, getAuth } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const admin = await getAuthenticatedUser();
        if (!admin || admin.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { facilitatorId, gmailOrUid } = body;

        if (!facilitatorId || !gmailOrUid) {
            return NextResponse.json({ error: "Missing facilitatorId or gmailOrUid" }, { status: 400 });
        }

        const db = getDb();
        const auth = getAuth();

        // 1. Fetch the facilitator profile
        const facilitatorRef = db.collection("users").doc(facilitatorId);
        const facilitatorDoc = await facilitatorRef.get();

        if (!facilitatorDoc.exists) {
            return NextResponse.json({ error: "Facilitator profile not found" }, { status: 404 });
        }

        const facilitatorData = facilitatorDoc.data();
        if (facilitatorData?.role !== "facilitator") {
            return NextResponse.json({ error: "Target user is not a facilitator" }, { status: 400 });
        }

        // 2. Resolve and verify the Gmail account
        let authUser;
        try {
            if (gmailOrUid.includes("@")) {
                authUser = await auth.getUserByEmail(gmailOrUid);
            } else {
                authUser = await auth.getUser(gmailOrUid);
            }
        } catch (e: any) {
            return NextResponse.json({
                error: `Identity verification failed: ${e.message}. Ensure the Gmail account has authenticated at least once.`
            }, { status: 400 });
        }

        if (!authUser) {
            return NextResponse.json({ error: "No authenticated user found for this identity." }, { status: 400 });
        }

        // 3. Update the facilitator profile with binding
        // Objective 1: Store as facilitator.userId (auth.uid) and facilitator.email (verified)
        const updateData = {
            userId: authUser.uid,
            email: authUser.email,
            isProfileOnly: false,
            status: "active",
            updatedAt: new Date().toISOString(),
            activatedAt: new Date().toISOString(),
            activatedBy: admin.uid
        };

        await facilitatorRef.update(updateData);

        // 4. Identity Reconciliation (Optional but good for clean state)
        // Check if there's already a doc with docId == auth.uid
        const existingAuthDoc = await db.collection("users").doc(authUser.uid).get();
        if (existingAuthDoc.exists && existingAuthDoc.id !== facilitatorId) {
            // If the user already has a stub doc created by sign-in, we might want to mark it or merge.
            // But per "PATCH ONLY", we'll just ensure the profile doc is updated.
            console.log(`Reconciliation note: Auth user ${authUser.uid} has a separate user document. Binder updated profile ${facilitatorId}.`);
        }

        return NextResponse.json({
            success: true,
            message: "Facilitator identity bound successfully",
            data: updateData
        });

    } catch (error: any) {
        console.error("Activate facilitator failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
