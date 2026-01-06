
import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { CANONICAL_CLASSES } from "@/lib/constants";

export async function PATCH(req: Request) {
    try {
        const user = await getAuthenticatedUser();
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { eventId, programId, facilitatorId, time, location } = body;

        if (!eventId) {
            return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
        }

        const db = getDb();
        const eventRef = db.collection("scheduleEvents").doc(eventId);
        const eventDoc = await eventRef.get();

        if (!eventDoc.exists) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const eventData = eventDoc.data();
        if (!eventData) {
            return NextResponse.json({ error: "Event data missing" }, { status: 404 });
        }

        // 1. Enforce Future Only
        // eventData.date is YYYY-MM-DD
        // eventData.time is "H:MM AM/PM"

        const now = new Date();
        const eventDateStr = eventData.date; // e.g. "2025-01-01"

        // Parse "10:00 AM" to 24h format
        const parseTime = (timeStr: string) => {
            const [time, meridian] = timeStr.split(" ");
            let [hours, minutes] = time.split(":").map(Number);
            if (meridian === "PM" && hours < 12) hours += 12;
            if (meridian === "AM" && hours === 12) hours = 0;
            return { hours, minutes };
        };

        const eventTime = parseTime(eventData.time);
        const eventDateTime = new Date(`${eventDateStr}T${String(eventTime.hours).padStart(2, '0')}:${String(eventTime.minutes).padStart(2, '0')}:00`);

        // If event is in the past or currently running (we treat "currently" as same hour)
        // Per requirement: "Past events MUST be read-only. In-progress events MUST be read-only."
        // We assume a session lasts 2 hours for "in-progress" check if not explicit.
        if (eventDateTime.getTime() < now.getTime()) {
            return NextResponse.json({ error: "Cannot modify past or in-progress events" }, { status: 403 });
        }

        // 3. Validate Facilitator Authorization
        if (facilitatorId) {
            const facDoc = await db.collection("users").doc(facilitatorId).get();
            if (!facDoc.exists) {
                return NextResponse.json({ error: "Facilitator not found" }, { status: 400 });
            }
            const facData = facDoc.data();
            if (facData?.role !== "facilitator") {
                return NextResponse.json({ error: "Assigned user is not a facilitator" }, { status: 400 });
            }

            // Authorization check
            // Enforce canonical classes.
            const targetProgramId = programId || eventData.programId;
            const isAuthorized = facData.authorizedPrograms?.includes(targetProgramId);
            const isCanonical = (CANONICAL_CLASSES as unknown as string[]).includes(targetProgramId);

            if (!isCanonical) {
                return NextResponse.json({ error: "Program is not a canonical class. Authorization denied." }, { status: 403 });
            }

            if (!isAuthorized) {
                return NextResponse.json({ error: "Facilitator is not authorized for this canonical class" }, { status: 403 });
            }
        }

        // 4. Update the event
        const updates: any = {};
        if (programId) {
            const progDoc = await db.collection("programs_catalog").doc(programId).get();
            if (!progDoc.exists) {
                return NextResponse.json({ error: "Program not found" }, { status: 400 });
            }
            updates.programId = programId;
            updates.programName = progDoc.data()?.name;
        }

        if (facilitatorId) {
            const facDoc = await db.collection("users").doc(facilitatorId).get();
            updates.facilitatorId = facilitatorId;
            updates.facilitatorName = facDoc.data()?.name;
        }

        if (time) updates.time = time;
        if (location) updates.location = location;

        updates.editedBy = user.uid;
        updates.editedAt = new Date().toISOString();

        await eventRef.update(updates);

        return NextResponse.json({ message: "Schedule updated", id: eventId, updates });
    } catch (error: any) {
        console.error("Failed to update schedule:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
