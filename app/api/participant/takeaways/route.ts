import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/api-guards";
import { getDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
    try {
        const user = await requireRole(["facilitator", "admin"]);
        const body = await req.json();
        const { participantId, sessionId, classId, content } = body;

        if (!participantId || !sessionId || !classId || !content) {
            return NextResponse.json({ error: "Missing required fields (participantId, sessionId, classId, content)" }, { status: 400 });
        }

        const db = getDb();
        const takeaway = {
            participantId,
            sessionId,
            classId: classId || "individual",
            content,
            createdBy: user.uid,
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection("takeaways").add(takeaway);

        return NextResponse.json({ id: docRef.id, ...takeaway });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const user = await requireRole(["participant", "facilitator", "admin"]);
        const searchParams = req.nextUrl.searchParams;
        const participantId = user.role === "participant" ? user.uid : searchParams.get("participantId");

        if (user.role === "participant" && searchParams.get("participantId") && searchParams.get("participantId") !== user.uid) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const db = getDb();
        let query: any = db.collection("takeaways");

        if (participantId) {
            query = query.where("participantId", "==", participantId);
        }

        const snap = await query.orderBy("createdAt", "desc").get();
        const takeaways = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

        return NextResponse.json(takeaways);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
