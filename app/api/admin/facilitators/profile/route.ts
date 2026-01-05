
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
        const { facilitatorId, agency, credentials, certifications, authorizedPrograms, phone, email, name } = body;

        if (!facilitatorId) {
            return NextResponse.json({ error: "Facilitator ID is required" }, { status: 400 });
        }

        const db = getDb();
        const userRef = db.collection("users").doc(facilitatorId);
        const userDoc = await userRef.get();

        if (!userDoc.exists || userDoc.data()?.role !== "facilitator") {
            return NextResponse.json({ error: "Facilitator not found" }, { status: 404 });
        }

        const oldData = userDoc.data() || {};
        const newData: any = {
            agency: agency !== undefined ? agency : (oldData.agency || ""),
            credentials: credentials !== undefined ? credentials : (oldData.credentials || ""),
            certifications: certifications !== undefined ? certifications : (oldData.certifications || []),
            authorizedPrograms: authorizedPrograms !== undefined ? authorizedPrograms : (oldData.authorizedPrograms || []),
            name: name !== undefined ? name : (oldData.name || ""),
            email: email !== undefined ? email : (oldData.email || ""),
            phone: phone !== undefined ? phone : (oldData.phone || ""),
            updatedAt: new Date().toISOString()
        };

        // Identify changes for history
        const historyBatch = db.batch();
        const changedFields = ["agency", "credentials", "certifications", "authorizedPrograms", "phone", "email", "name"];

        changedFields.forEach(field => {
            const oldVal = JSON.stringify(oldData[field]);
            const newVal = JSON.stringify(newData[field]);

            if (oldVal !== newVal) {
                const historyRef = db.collection("facilitator_history").doc();
                historyBatch.set(historyRef, {
                    facilitatorId,
                    fieldName: field,
                    oldValue: oldData[field] || null,
                    newValue: newData[field],
                    changedBy: admin.uid,
                    changedAt: new Date().toISOString(),
                    type: "admin_direct_update"
                });
            }
        });

        historyBatch.update(userRef, newData);
        await historyBatch.commit();

        return NextResponse.json({ message: "Facilitator profile updated successfully", data: newData });

    } catch (error: any) {
        console.error("Update facilitator profile failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
