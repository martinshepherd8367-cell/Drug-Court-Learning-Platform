
import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";

export async function POST(req: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { participantId, programId, currentSessionNumber, status, startedAt, schedule } = body;

        if (!participantId || !programId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const db = getDb();

        // Prevent duplicates
        const existing = await db.collection("enrollments")
            .where("participantId", "==", participantId)
            .where("programId", "==", programId)
            .limit(1)
            .get();

        if (!existing.empty) {
            return NextResponse.json({ error: "Participant already enrolled in this program" }, { status: 409 });
        }
        const newEnrollment = {
            participantId,
            programId,
            currentSessionNumber: currentSessionNumber || 1,
            status: status || "active",
            startedAt: startedAt || new Date().toISOString(),
            schedule: schedule || null
        };

        const docRef = await db.collection("enrollments").add(newEnrollment);

        return NextResponse.json({ id: docRef.id, ...newEnrollment });
    } catch (error: any) {
        console.error("Failed to create enrollment:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: "Missing enrollment ID" }, { status: 400 });
        }

        const db = getDb();
        await db.collection("enrollments").doc(id).update(updates);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Failed to update enrollment:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing enrollment ID" }, { status: 400 });
        }

        const db = getDb();
        await db.collection("enrollments").doc(id).delete();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Failed to delete enrollment:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
