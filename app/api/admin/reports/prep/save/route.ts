
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
        const { courtId, snapshotData, approvedContent } = body;

        if (!courtId || !snapshotData || !approvedContent) {
            return NextResponse.json({ error: "Missing required snapshot data" }, { status: 400 });
        }

        const db = getDb();

        const newSnapshot = {
            courtId,
            snapshotGeneratedAt: new Date().toISOString(),
            generatedBy: admin.uid,
            snapshotData,
            approvedContent,
        };

        const docRef = await db.collection("court_prep_snapshots").add(newSnapshot);

        return NextResponse.json({
            id: docRef.id,
            message: "Court Prep Snapshot saved successfully",
            snapshot: { id: docRef.id, ...newSnapshot }
        });

    } catch (error: any) {
        console.error("Save court prep failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
