
import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";

export async function POST(req: Request) {
    try {
        const facilitator = await getAuthenticatedUser();
        if (!facilitator || facilitator.role !== "facilitator") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { changes } = await req.json();
        // Limited fields as per FLOW RULES (Contact info, Credentials/Certifications, Availability)
        // Validation could be added here to ensure only allowed fields are in changes

        const db = getDb();

        const updateRequest = {
            facilitatorId: facilitator.uid,
            facilitatorName: facilitator.name,
            changes,
            status: "pending",
            timestamp: new Date().toISOString()
        };

        const result = await db.collection("facilitator_update_requests").add(updateRequest);

        // Also add to internal messages for notification as per rule 3
        await db.collection("messages").add({
            senderId: facilitator.uid,
            senderRole: "facilitator",
            recipientRole: "admin",
            title: "Profile Update Request",
            content: `Facilitator ${facilitator.name} has submitted a profile update request for: ${Object.keys(updateRequest.changes || {}).join(", ")}.`,
            fromName: facilitator.name,
            createdAt: new Date().toISOString(),
            isUrgent: false,
            type: "system_notification",
            requestId: result.id
        });

        return NextResponse.json({
            id: result.id,
            message: "Update request submitted for Admin review"
        });

    } catch (error: any) {
        console.error("Facilitator profile request failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
