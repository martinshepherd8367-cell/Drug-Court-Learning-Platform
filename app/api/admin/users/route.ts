
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
        const { name, email, role, status, courtId, county } = body;

        if (!name || !email || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const db = getDb();

        // Check if user already exists
        const existing = await db.collection("users").where("email", "==", email).get();
        if (!existing.empty) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
        }

        let caseManagerId = null;

        if (role === "participant" && courtId) {
            const courtDoc = await db.collection("courts").doc(courtId).get();
            if (courtDoc.exists) {
                const courtData = courtDoc.data();
                const cmIds: string[] = courtData?.caseManagerIds || [];

                // Rule 5a: If exactly one case manager, assign them
                if (cmIds.length === 1) {
                    caseManagerId = cmIds[0];
                }
                // Rule 5b: Accountability Court + Banks -> Load balancing
                else if (courtData?.name === "Accountability Court" && county === "Banks") {
                    const cms = await db.collection("users")
                        .where("role", "==", "case_manager")
                        .where("id", "in", cmIds)
                        .get();

                    let bestCmId = cmIds[0];
                    let minCount = Infinity;

                    for (const cmDoc of cms.docs) {
                        const participantCount = (await db.collection("users")
                            .where("role", "==", "participant")
                            .where("caseManagerId", "==", cmDoc.id)
                            .get()).size;

                        if (participantCount < minCount) {
                            minCount = participantCount;
                            bestCmId = cmDoc.id;
                        }
                    }
                    caseManagerId = bestCmId;
                }
            }
        }

        const newUserRef = db.collection("users").doc();
        const userData: any = {
            name,
            email,
            role,
            status: role === "participant" ? "active" : (status || "active"),
            isProfileOnly: true,
            createdAt: new Date().toISOString(),
        };

        if (role === "participant") {
            if (!courtId || !county || !caseManagerId) {
                return NextResponse.json({ error: "Court, County, and Case Manager are required for participants" }, { status: 400 });
            }
            userData.courtId = courtId;
            userData.county = county;
            userData.caseManagerId = caseManagerId;
        }

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
