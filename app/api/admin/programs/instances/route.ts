
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser();
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { classId, className, facilitatorId, facilitatorName, scheduleDay, scheduleTime, scheduleMeridiem } = body;

        if (!classId || !facilitatorId || !scheduleTime) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const db = getDb();
        const newInstance = {
            classId,
            className,
            facilitatorId,
            facilitatorName,
            scheduleDay,
            scheduleTime,
            scheduleMeridiem,
            status: "ACTIVE",
            sessionsCompleted: 0,
            participantCount: 0,
            participantIds: [],
            createdAt: new Date().toISOString(),
            createdBy: user.uid
        };

        const docRef = await db.collection("program_instances").add(newInstance);

        return NextResponse.json({
            success: true,
            id: docRef.id,
            data: newInstance
        });

    } catch (error: any) {
        console.error("Create program instance failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
