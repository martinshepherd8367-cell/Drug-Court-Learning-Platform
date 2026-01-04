import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/api-guards";
import { getDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
    try {
        const user = await requireRole(["facilitator", "admin"]);
        const body = await req.json();
        const { classId, programId, sessionNumber, facilitatorId, attendance, takeaways } = body;

        if (!classId || !programId || (sessionNumber === undefined) || !attendance || typeof attendance !== 'object') {
            return NextResponse.json({ error: "Missing required fields or invalid attendance format" }, { status: 400 });
        }

        const db = getDb();
        const sessionId = `${programId}-${sessionNumber}`;

        const completedSessionId = await db.runTransaction(async (transaction) => {
            // 1. Check if already completed (Idempotency)
            const completedSessionsRef = db.collection("completed_sessions");
            const existingQuery = completedSessionsRef
                .where("classId", "==", classId)
                .where("programId", "==", programId)
                .where("sessionNumber", "==", sessionNumber)
                .limit(1);

            const existingSnap = await transaction.get(existingQuery);
            if (!existingSnap.empty) {
                return existingSnap.docs[0].id;
            }

            // 2. Prepare session completion record
            const attendeeIds: string[] = [];
            const absenteeIds: string[] = [];
            const excusedIds: string[] = [];

            for (const [pId, status] of Object.entries(attendance)) {
                if (status === "present") attendeeIds.push(pId);
                else if (status === "absent") absenteeIds.push(pId);
                else if (status === "excused") excusedIds.push(pId);
            }

            const completedSessionData = {
                classId,
                programId,
                sessionNumber,
                facilitatorId: facilitatorId || user.uid,
                completedAt: new Date().toISOString(),
                attendeeIds,
                absenteeIds,
                excusedIds
            };

            const completedRef = completedSessionsRef.doc();
            transaction.set(completedRef, completedSessionData);

            // 3. Record attendance for each participant
            for (const [pId, status] of Object.entries(attendance)) {
                // Use a deterministic ID for attendance to prevent duplicates on retries
                const attendanceRef = db.collection("users").doc(pId).collection("attendance").doc(`${sessionId}-${classId}`);
                transaction.set(attendanceRef, {
                    participantId: pId,
                    sessionId: sessionId,
                    classId: classId,
                    date: new Date().toISOString().split('T')[0],
                    status: status,
                    attended: status === "present",
                    timestamp: new Date().toISOString(),
                    verified: true
                });
            }

            // 4. Record takeaways if provided
            if (takeaways && Array.isArray(takeaways)) {
                for (const t of takeaways) {
                    const takeawayRef = db.collection("takeaways").doc();
                    transaction.set(takeawayRef, {
                        participantId: t.participantId,
                        sessionId: sessionId,
                        classId: classId,
                        content: t.content,
                        createdBy: user.uid,
                        createdAt: new Date().toISOString()
                    });
                }
            }

            return completedRef.id;
        });

        return NextResponse.json({ success: true, id: completedSessionId });
    } catch (e: any) {
        console.error("Error completing session:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
