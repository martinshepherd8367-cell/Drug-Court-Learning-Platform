
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
        const participantDoc = await db.collection("users").doc(participantId).get();
        if (!participantDoc.exists) {
            return NextResponse.json({ error: "Participant not found" }, { status: 404 });
        }

        const participantData = participantDoc.data();
        if (participantData?.status !== "active") {
            return NextResponse.json({ error: "Cannot enroll a paused or inactive participant" }, { status: 400 });
        }

        // 1. Eligibility Check (Revised Treatment Configuration)
        if (participantData?.reactivationPath === "revised" && participantData?.revisedTreatmentConfig) {
            const eligibility = participantData.revisedTreatmentConfig[programId];
            if (eligibility !== "repeat") {
                return NextResponse.json({ error: "Participant is not eligible for this program based on revised treatment plan" }, { status: 400 });
            }
        }

        // 2. Class Capacity Check & Duplicate Check
        if (!schedule) {
            return NextResponse.json({ error: "Schedule is required for new enrollment" }, { status: 400 });
        }

        const classQuery = await db.collection("enrollments")
            .where("programId", "==", programId)
            .where("status", "==", "active")
            .get();

        // Filter by schedule match and check duplicates for this specific class
        const classEnrollments = classQuery.docs.filter(doc => {
            const data = doc.data();
            return data.schedule?.day === schedule.day &&
                data.schedule?.time === schedule.time &&
                data.schedule?.room === schedule.room;
        });

        const count = classEnrollments.length;
        if (count >= 14) {
            return NextResponse.json({ error: "Class has reached its hard capacity (14)" }, { status: 403 });
        }

        if (classEnrollments.some(doc => doc.data().participantId === participantId)) {
            return NextResponse.json({ error: "Participant already enrolled in this class" }, { status: 409 });
        }

        // 3. Program Duplicate Check (Can't be in another class of the same program if active)
        const otherClasses = classQuery.docs.filter(doc => doc.data().participantId === participantId);
        if (otherClasses.length > 0) {
            return NextResponse.json({ error: "Participant already enrolled in this program in another class" }, { status: 409 });
        }

        // 4. Schedule Conflict Check (Can't be in any other program at the same time/room)
        const scheduleConflictQuery = await db.collection("enrollments")
            .where("participantId", "==", participantId)
            .where("status", "==", "active")
            .get();

        const hasConflict = scheduleConflictQuery.docs.some(doc => {
            const data = doc.data();
            return data.schedule?.day === schedule.day &&
                data.schedule?.time === schedule.time &&
                data.schedule?.room === schedule.room;
        });

        if (hasConflict) {
            return NextResponse.json({ error: "Participant already has an active enrollment at this scheduled time/room" }, { status: 409 });
        }

        const warning = count >= 12 ? "Class is approaching soft capacity (12+)" : null;

        // 4. Create Enrollment with Metadata Associations
        const newEnrollment = {
            participantId,
            programId,
            currentSessionNumber: currentSessionNumber || 1,
            status: status || "active",
            startedAt: startedAt || new Date().toISOString(),
            schedule: schedule,
            courtId: participantData.courtId || null,
            county: participantData.county || null,
            facilitatorId: schedule.facilitatorId || null,
            enrolledBy: user.uid,
            enrolledAt: new Date().toISOString()
        };

        const docRef = await db.collection("enrollments").add(newEnrollment);

        return NextResponse.json({ id: docRef.id, ...newEnrollment, warning });
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
