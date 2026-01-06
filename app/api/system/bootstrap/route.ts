
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
            messagesSnap,
            completedSessionsSnap,
            takeawaysSnap,
            courtsSnap,
            facilitatorHistorySnap,
            facilitatorRequestsSnap,
            programInstancesSnap
        ] = await Promise.all([
            db.collection("users").get(),
            db.collection("programs_catalog").get(),
            db.collection("enrollments").get(),
            db.collection("scheduleEvents").get(),
            db.collectionGroup("journals").get(),
            db.collectionGroup("homeworkSubmissions").get(),
            db.collectionGroup("attendance").get(),
            db.collection("messages").get(),
            db.collection("completed_sessions").get(),
            db.collection("takeaways").get(),
            db.collection("courts").get(),
            db.collection("facilitator_history").get(),
            db.collection("facilitator_update_requests").get(),
            db.collection("program_instances").get()
        ]);

        let users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let programs = programsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let enrollments = enrollmentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let scheduleEvents = scheduleEventsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let journalEntries = journalsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let homeworkSubmissions = homeworkSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let attendance = attendanceSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let messages = messagesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let completedSessions = completedSessionsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let takeaways = takeawaysSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let courts = courtsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let facilitatorHistory = facilitatorHistorySnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let facilitatorRequests = facilitatorRequestsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        let programInstances = programInstancesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // 2. Apply Scoping Logic
        if (user.role === "admin") {
            // Admin sees everything
        } else if (user.role === "facilitator") {
            // Restriction 5.2: Only classes taught by this facilitator (Events OR Instances)
            // Restriction 5.3: Only participants in those classes

            const myInstances = programInstances.filter((inst: any) => inst.facilitatorId === user.uid || inst.facilitatorId === user.authUid);
            const myScheduleEvents = scheduleEvents.filter((e: any) => e.facilitatorId === user.uid);

            const myProgramIds = new Set([
                ...myScheduleEvents.map((e: any) => e.programId),
                ...myInstances.map((inst: any) => inst.classId)
            ]);

            const myEnrollments = enrollments.filter((e: any) =>
                (e.schedule?.facilitatorId === user.uid) || // Legacy schedule link
                (myProgramIds.has(e.programId) && myInstances.some((inst: any) => inst.participantIds?.includes(e.participantId))) // Instance link
            );

            const myParticipantIds = new Set([
                ...myEnrollments.map((e: any) => e.participantId),
                ...myInstances.flatMap((inst: any) => inst.participantIds || [])
            ]);

            // Filter everything based on these sets
            scheduleEvents = myScheduleEvents;
            enrollments = myEnrollments;

            // Only include relevant participants + staff
            users = users.filter((u: any) => u.role !== "participant" || myParticipantIds.has(u.id))
                .map((u: any) => {
                    if (u.id === user.uid || myParticipantIds.has(u.id)) return u;
                    return { id: u.id, name: u.name, role: u.role };
                });

            programs = programs.filter((p: any) => myProgramIds.has(p.id));

            journalEntries = journalEntries.filter((j: any) => myParticipantIds.has(j.participantId));
            homeworkSubmissions = homeworkSubmissions.filter((h: any) => myParticipantIds.has(h.participantId));
            attendance = attendance.filter((a: any) => myParticipantIds.has(a.participantId));
            messages = messages.filter((m: any) => m.recipientId === user.uid || m.senderId === user.uid);
            completedSessions = completedSessions.filter((cs: any) => cs.facilitatorId === user.uid || myProgramIds.has(cs.programId));
            takeaways = takeaways.filter((t: any) => myParticipantIds.has(t.participantId));

            facilitatorHistory = facilitatorHistory.filter((h: any) => h.facilitatorId === user.uid);
            facilitatorRequests = facilitatorRequests.filter((r: any) => r.facilitatorId === user.uid || r.facilitatorId === user.authUid);

        } else if (user.role === "participant") {
            // Participant only sees themselves and their own enrollments/artifacts
            const myInstances = programInstances.filter((inst: any) => inst.participantIds?.includes(user.uid) || inst.participantIds?.includes(user.authUid));
            enrollments = enrollments.filter((e: any) => e.participantId === user.uid);

            const myProgramIds = new Set([
                ...enrollments.map((e: any) => e.programId),
                ...myInstances.map((inst: any) => inst.classId)
            ]);

            users = users.filter((u: any) => u.id === user.uid || u.role !== "participant")
                .map((u: any) => {
                    if (u.id === user.uid) return u;
                    return { id: u.id, name: u.name, role: u.role };
                });

            programs = programs.filter((p: any) => myProgramIds.has(p.id));
            scheduleEvents = scheduleEvents.filter((e: any) => myProgramIds.has(e.programId));

            journalEntries = journalEntries.filter((j: any) => j.participantId === user.uid);
            homeworkSubmissions = homeworkSubmissions.filter((h: any) => h.participantId === user.uid);
            attendance = attendance.filter((a: any) => a.participantId === user.uid);
            messages = messages.filter((m: any) => m.recipientId === user.uid || m.senderId === user.uid);
            completedSessions = completedSessions.filter((cs: any) => myProgramIds.has(cs.programId));
            takeaways = takeaways.filter((t: any) => t.participantId === user.uid);

            facilitatorRequests = [];
        }

        return NextResponse.json({
            users,
            programs,
            enrollments,
            scheduleEvents,
            journalEntries,
            homeworkSubmissions,
            attendance,
            messages,
            completedSessions,
            takeaways,
            courts,
            facilitatorHistory,
            facilitatorRequests,
            programInstances,
            currentUserProfileId: user.uid
        });

    } catch (error: any) {
        console.error("Bootstrap failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
