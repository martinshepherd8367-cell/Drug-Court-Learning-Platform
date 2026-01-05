
import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";

export async function POST(req: Request) {
    try {
        const admin = await getAuthenticatedUser();
        if (!admin || admin.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { requestId, action, adminNote } = body; // action: "approve" or "reject"

        if (!requestId || !action) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const db = getDb();
        const requestRef = db.collection("facilitator_update_requests").doc(requestId);
        const reqDoc = await requestRef.get();

        if (!reqDoc.exists) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        const requestData = reqDoc.data()!;
        if (requestData.status !== "pending") {
            return NextResponse.json({ error: "Request already processed" }, { status: 400 });
        }

        const batch = db.batch();

        if (action === "approve") {
            const userRef = db.collection("users").doc(requestData.facilitatorId);
            const userDoc = await userRef.get();
            const oldData = userDoc.data() || {};

            // Apply changes
            const updates = requestData.changes;
            batch.update(userRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });

            // Record history
            Object.keys(updates).forEach(field => {
                const historyRef = db.collection("facilitator_history").doc();
                batch.set(historyRef, {
                    facilitatorId: requestData.facilitatorId,
                    fieldName: field,
                    oldValue: oldData[field] || null,
                    newValue: updates[field],
                    changedBy: admin.uid,
                    changedAt: new Date().toISOString(),
                    type: "facilitator_request_approval",
                    requestId
                });
            });

            batch.update(requestRef, {
                status: "approved",
                reviewedAt: new Date().toISOString(),
                reviewedBy: admin.uid,
                adminNote
            });
        } else {
            batch.update(requestRef, {
                status: "rejected",
                reviewedAt: new Date().toISOString(),
                reviewedBy: admin.uid,
                adminNote
            });
        }

        await batch.commit();

        return NextResponse.json({ message: `Request ${action}d successfully` });

    } catch (error: any) {
        console.error("Facilitator request review failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
