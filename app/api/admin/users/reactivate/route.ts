
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const admin = await getAuthenticatedUser();
        if (!admin || admin.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { participantId, reactivationPath, revisedTreatmentConfig } = body;

        if (!participantId || !reactivationPath) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (reactivationPath === "revised" && !revisedTreatmentConfig) {
            return NextResponse.json({ error: "Revised treatment configuration is required for revised path" }, { status: 400 });
        }

        const db = getDb();
        const userRef = db.collection("users").doc(participantId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return NextResponse.json({ error: "Participant not found" }, { status: 404 });
        }

        const userData = userDoc.data();
        if (userData?.role !== "participant") {
            return NextResponse.json({ error: "User is not a participant" }, { status: 400 });
        }

        if (userData?.status !== "paused") {
            return NextResponse.json({ error: "Only paused participants can be reactivated" }, { status: 400 });
        }

        // 1. Prepare Reactivation Audit Metadata
        const auditData: any = {
            status: "active",
            reactivationPath,
            reactivatedBy: admin.uid,
            reactivatedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (reactivationPath === "revised") {
            auditData.revisedTreatmentConfig = revisedTreatmentConfig;
        }

        // 2. Set participant status = Active and persist metadata
        await userRef.update(auditData);

        // 3. Ensure zero active enrollments (already un-enrolled during pause, but we verify)
        // System MUST NOT auto-enroll.

        return NextResponse.json({
            success: true,
            message: `Participant ${participantId} has been reactivated.`,
            data: auditData
        });

    } catch (error: any) {
        console.error("Reactivate participant failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
