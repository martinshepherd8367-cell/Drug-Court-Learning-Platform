
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const admin = await getAuthenticatedUser();
        if (!admin || admin.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { name, email, role, status } = body;

        if (!name || !email || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const db = getDb();

        // Check if user already exists
        const existing = await db.collection("users").where("email", "==", email).get();
        if (!existing.empty) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
        }

        // Create the user profile in Firestore
        // Note: We don't have a UID yet from Firebase Auth, so we let Firestore generate one
        // or we could use email but it's better to use a random ID.
        const newUserRef = db.collection("users").doc();
        const userData = {
            name,
            email,
            role,
            status: status || "active",
            isProfileOnly: true,
            createdAt: new Date().toISOString(),
        };

        await newUserRef.set(userData);

        return NextResponse.json({ id: newUserRef.id, ...userData });
    } catch (error: any) {
        console.error("Create user failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const admin = await getAuthenticatedUser();
        if (!admin || admin.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { id, name, email, role, status } = body;

        if (!id) {
            return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
        }

        const db = getDb();
        const userRef = db.collection("users").doc(id);
        const doc = await userRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (role) updateData.role = role;
        if (status) updateData.status = status;
        updateData.updatedAt = new Date().toISOString();

        await userRef.update(updateData);

        return NextResponse.json({ id, ...updateData });
    } catch (error: any) {
        console.error("Update user failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
