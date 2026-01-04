
import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
        }

        const db = getDb();

        // 1. Fetch baseline data needed for all roles (or for filtering)
        const [
            usersSnap,
            programsSnap,
            enrollmentsSnap,
            scheduleEventsSnap,
            journalsSnap,
            homeworkSnap,
            attendanceSnap,
            messagesSnap
        ] = await Promise.all([
            db.collection("users").get(),
            db.collection("programs_catalog").get(),
            db.collection("enrollments").get(),
            db.collection("scheduleEvents").get(),
            db.collectionGroup("journals").get(),
            db.collectionGroup("homeworkSubmissions").get(),
            db.collectionGroup("attendance").get(),
            db.collection("messages").get()
        ]);

        let users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let programs = programsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let enrollments = enrollmentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let scheduleEvents = scheduleEventsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let journalEntries = journalsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let homeworkSubmissions = homeworkSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let attendance = attendanceSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let messages = messagesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // 2. Apply Scoping Logic
        if (user.role === "admin") {
            // Admin sees everything
        } else if (user.role === "facilitator") {
            // Restriction 5.2: Only classes taught by this facilitator
            // Restriction 5.3: Only participants in those classes

            const myScheduleEvents = scheduleEvents.filter((e: any) => e.facilitatorId === user.uid);
            const myEnrollments = enrollments.filter((e: any) => e.schedule?.facilitatorId === user.uid);

            const myParticipantIds = new Set(myEnrollments.map((e: any) => e.participantId));
            const myProgramIds = new Set([
                ...myScheduleEvents.map((e: any) => e.programId),
                ...myEnrollments.map((e: any) => e.programId)
            ]);

            // Filter everything based on these sets
            scheduleEvents = myScheduleEvents;
            enrollments = myEnrollments;

            // Only include relevant participants + staff
            users = users.filter((u: any) => u.role !== "participant" || myParticipantIds.has(u.id));

            // Only include programs they teach
            programs = programs.filter((p: any) => myProgramIds.has(p.id));

            // Scoped artifacts
            journalEntries = journalEntries.filter((j: any) => myParticipantIds.has(j.participantId));
            homeworkSubmissions = homeworkSubmissions.filter((h: any) => myParticipantIds.has(h.participantId));
            attendance = attendance.filter((a: any) => myParticipantIds.has(a.participantId));
            // Facilitator sees messages TO them OR FROM them
            messages = messages.filter((m: any) => m.recipientId === user.uid || m.senderId === user.uid);

        } else if (user.role === "participant") {
            // Participant only sees themselves and their own enrollments/artifacts
            enrollments = enrollments.filter((e: any) => e.participantId === user.uid);
            const myProgramIds = new Set(enrollments.map((e: any) => e.programId));

            users = users.filter((u: any) => u.id === user.uid || u.role !== "participant");
            programs = programs.filter((p: any) => myProgramIds.has(p.id));
            scheduleEvents = scheduleEvents.filter((e: any) => myProgramIds.has(e.programId));

            journalEntries = journalEntries.filter((j: any) => j.participantId === user.uid);
            homeworkSubmissions = homeworkSubmissions.filter((h: any) => h.participantId === user.uid);
            attendance = attendance.filter((a: any) => a.participantId === user.uid);
            // Participant sees messages TO them OR FROM them
            messages = messages.filter((m: any) => m.recipientId === user.uid || m.senderId === user.uid);
        }

        return NextResponse.json({
            users,
            programs,
            enrollments,
            scheduleEvents,
            journalEntries,
            homeworkSubmissions,
            attendance,
            messages
        });

    } catch (error: any) {
        console.error("Bootstrap failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
