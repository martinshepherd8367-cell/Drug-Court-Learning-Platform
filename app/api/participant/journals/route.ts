
import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/api-guards";
import { JournalsRepo } from "@/lib/firestore/repos/journals";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const user = await requireRole("participant");
        const searchParams = req.nextUrl.searchParams;
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        const journals = await JournalsRepo.listJournalsForParticipant(user.uid, limit);
        return NextResponse.json(journals);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await requireRole("participant");
        const body = await req.json();
        const { programId, sessionNumber, content, title, mood, tags } = body;

        // Validation
        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const id = await JournalsRepo.createEntry({
            participantId: user.uid,
            programId: programId || "general",
            sessionNumber: sessionNumber || 1,
            content,
            mood: mood || null,
            tags: tags || [],
            submittedAt: new Date().toISOString()
        });

        return NextResponse.json({ success: true, id });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
