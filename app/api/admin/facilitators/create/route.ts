
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";

export async function POST(req: NextRequest) {
    try {
        const admin = await getAuthenticatedUser();
        if (!admin || admin.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { name, email } = body;

        if (!name || !email) {
            return NextResponse.json({ error: "Missing name or email" }, { status: 400 });
        }

        const db = getDb();

        // Ensure email is unique across the users collection
        const existing = await db.collection("users").where("email", "==", email).get();
        if (!existing.empty) {
            return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 });
        }

        const facilitatorId = db.collection("users").doc().id;
        const newFacilitator = {
            id: facilitatorId,
            role: "facilitator",
            name,
            email,
            status: "UNBOUND",
            isProfileOnly: true,
            createdBy: admin.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // If I use status: "UNBOUND", I need to make sure the UI handles it.
        // Usually status is 'active', 'inactive', 'paused'.
        // The prompt says: "Set status = UNBOUND".

        await db.collection("users").doc(facilitatorId).set(newFacilitator);

        return NextResponse.json({
            success: true,
            message: "Facilitator profile created",
            data: newFacilitator
        });

    } catch (error: any) {
        console.error("Create facilitator failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
