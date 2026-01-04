import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";

export async function POST(req: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
        }

        const body = await req.json();
        const { recipientId, recipientRole, title, content, isUrgent } = body;

        if (!recipientId || !recipientRole || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Role enforcement
        if (user.role === "participant") {
            if (recipientRole !== "admin" && recipientRole !== "facilitator") {
                return NextResponse.json({ error: "Participants can only message staff" }, { status: 403 });
            }
        }

        const db = getDb();

        const newMessage = {
            senderId: user.uid,
            senderRole: user.role,
            recipientId,
            recipientRole,
            title: title || "New Message",
            content,
            fromName: user.name || "System",
            readAt: null,
            createdAt: new Date().toISOString(),
            isUrgent: !!isUrgent
        };

        const docRef = await db.collection("messages").add(newMessage);

        return NextResponse.json({ id: docRef.id, ...newMessage });

    } catch (error: any) {
        console.error("Failed to send message:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
        }

        const body = await req.json();
        const { messageId, readAt } = body;

        if (!messageId) {
            return NextResponse.json({ error: "Missing messageId" }, { status: 400 });
        }

        const db = getDb();
        const messageDoc = await db.collection("messages").doc(messageId).get();

        if (!messageDoc.exists) {
            return NextResponse.json({ error: "Message not found" }, { status: 404 });
        }

        const messageData = messageDoc.data();
        if (messageData?.recipientId !== user.uid) {
            return NextResponse.json({ error: "Forbidden: You are not the recipient" }, { status: 403 });
        }

        await db.collection("messages").doc(messageId).update({
            readAt: readAt || new Date().toISOString()
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Failed to update message:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
