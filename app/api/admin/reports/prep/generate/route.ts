
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
        const { courtId } = body;

        if (!courtId) {
            return NextResponse.json({ error: "Court ID is required" }, { status: 400 });
        }

        const db = getDb();

        // 1. Verify Court
        const courtDoc = await db.collection("courts").doc(courtId).get();
        if (!courtDoc.exists) {
            return NextResponse.json({ error: "Court not found" }, { status: 404 });
        }

        // 2. Find last snapshot date
        const lastSnapshotSnap = await db.collection("court_prep_snapshots")
            .where("courtId", "==", courtId)
            .orderBy("snapshotGeneratedAt", "desc")
            .limit(1)
            .get();

        let sinceDate = "1970-01-01T00:00:00Z";
        if (!lastSnapshotSnap.empty) {
            sinceDate = lastSnapshotSnap.docs[0].data().snapshotGeneratedAt;
        }

        // 3. Fetch Participants for this Court
        const participantsSnap = await db.collection("users")
            .where("role", "==", "participant")
            .where("courtId", "==", courtId)
            .get();

        const participants = participantsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const participantIds = participants.map(p => p.id);

        if (participantIds.length === 0) {
            return NextResponse.json({
                courtId,
                snapshotData: { participants: [], activity: { completions: [], attendance: [], takeaways: [] } },
                approvedContent: {}
            });
        }

        // 4. Fetch Activity since last snapshot
        // Note: For large datasets, this should be optimized. For now, we fetch and filter.

        // Completions
        const completionsSnap = await db.collection("completed_sessions")
            .where("completedAt", ">", sinceDate)
            .get();
        // Filter by participants in this court? Wait, completed_sessions doesn't have participantId.
        // It has sessionId and classId. Wait, completed_sessions are per-CLASS, not per-participant.
        // Participant progression is in enrollments. 
        // "Session completions" for a participant usually means when they attended a session and it was closed.

        // Let's rethink "Participant activity":
        // Completion: They were present and the session is closed.

        // Attendance
        const attendanceSnap = await db.collectionGroup("attendance")
            .where("participantId", "in", participantIds)
            // .where("completedAt", ">", sinceDate) // Some might be null if absent
            .get();

        let rawAttendance = attendanceSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));

        // Filter attendance by date (using completedAt or correctedAt)
        rawAttendance = rawAttendance.filter(a => {
            const date = a.correctedAt || a.completedAt || "";
            return date > sinceDate;
        });

        // Resolve Attendance Truth
        const attendanceMap = new Map<string, any>();
        [...rawAttendance].sort((a, b) => {
            const dateA = a.correctedAt || a.completedAt || "";
            const dateB = b.correctedAt || b.completedAt || "";
            return dateA.localeCompare(dateB);
        }).forEach(a => {
            const key = `${a.participantId}-${a.sessionId}`;
            attendanceMap.set(key, a);
        });
        const resolvedAttendance = Array.from(attendanceMap.values());

        // Takeaways
        const takeawaysSnap = await db.collection("takeaways")
            .where("participantId", "in", participantIds)
            .where("createdAt", ">", sinceDate)
            .get();
        const takeaways = takeawaysSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));

        // 5. Generate AI Suggestions (Placeholders as per instruction)
        const approvedContent: any = {};
        participants.forEach(p => {
            const pAttendance = resolvedAttendance.filter(a => a.participantId === p.id);
            const pTakeaways = takeaways.filter(t => t.participantId === p.id);
            const pAbsences = pAttendance.filter(a => a.status === "absent");

            // Heuristic-based suggestions
            let activitySummary = "";
            if (pAttendance.length > 0) {
                const presentCount = pAttendance.filter(a => a.status === "present").length;
                activitySummary = `Attended ${presentCount}/${pAttendance.length} sessions. `;
            }
            if (pTakeaways.length > 0) {
                activitySummary += `Shared thoughts on ${pTakeaways.length} topics.`;
            }

            approvedContent[p.id] = {
                suggestedTakeaway: pTakeaways.length > 0 ? pTakeaways[0].content : "No new takeaways recorded in this period.",
                suggestedJudgeQuestion: pAbsences.length > 0 ? "Can you explain the circumstances behind your recent absence?" : "What was the most impactful thing you learned this week?",
                adminNote: ""
            };
        });

        const snapshotData = {
            participants: participants.map(p => ({ id: p.id, name: (p as any).name, email: (p as any).email })),
            activity: {
                completions: [], // We'll derive from resolved attendance for simplicitly or fetch separately
                attendance: resolvedAttendance,
                takeaways: takeaways
            }
        };

        return NextResponse.json({
            courtId,
            snapshotGeneratedAt: new Date().toISOString(),
            generatedBy: admin.uid,
            snapshotData,
            approvedContent
        });

    } catch (error: any) {
        console.error("Generate court prep failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
