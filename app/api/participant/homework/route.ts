import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/api-guards";
import { HomeworkRepo } from "@/lib/firestore/repos/homework";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const user = await requireRole(["participant", "facilitator", "admin"]);
        const searchParams = req.nextUrl.searchParams;
        const participantId = searchParams.get("participantId") || user.uid;

        // If not admin/facilitator, must be requester's own ID
        if (user.role === "participant" && participantId !== user.uid) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const homework = await HomeworkRepo.listForParticipant(participantId);
        return NextResponse.json(homework);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await requireRole("participant");
        const body = await req.json();
        const { programId, sessionId, sessionNumber, content } = body;

        if (!content || !sessionId) {
            return NextResponse.json({ error: "Content and sessionId are required" }, { status: 400 });
        }

        const id = await HomeworkRepo.createSubmission({
            participantId: user.uid,
            programId: programId || "general",
            sessionId,
            sessionNumber: sessionNumber || 0,
            content,
            status: "pending",
            submittedAt: new Date().toISOString()
        });

        return NextResponse.json({ success: true, id });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
