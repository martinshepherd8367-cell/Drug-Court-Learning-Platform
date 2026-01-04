import { NextResponse } from "next/server";
import { getDb, getAuth } from "@/lib/firebase-admin";
import { requireRole } from "@/lib/api-guards";
import seedData from "@/data_import/court_ops_seed.json";

export async function POST() {
    try {
        // Ensure user is admin before seeding
        await requireRole("admin");

        // Extra safety: Only allow in development or via specific env flag
        if (process.env.NODE_ENV === 'production' && process.env.ENABLE_SEED_IN_PROD !== 'true') {
            return NextResponse.json({ error: "Seeding not allowed in production without flag" }, { status: 403 });
        }

        const db = getDb();
        const batch = db.batch();

        let count = 0;

        // Users
        const auth = getAuth();
        for (const user of seedData.users) {
            // Firestore doc
            const ref = db.collection("users").doc(user.id);
            batch.set(ref, user, { merge: true });

            // Firebase Auth user (Option B: Robust Seed)
            try {
                await auth.createUser({
                    uid: user.id,
                    email: user.email,
                    displayName: user.name,
                    password: "password123", // Default seed password
                    emailVerified: true,
                });
            } catch (error: any) {
                // Ignore if user already exists, otherwise log
                if (error.code !== 'auth/uid-already-exists' && error.code !== 'auth/email-already-exists') {
                    console.warn(`Warning: Could not create auth user for ${user.email}:`, error.message);
                }
            }

            count++;
        }

        // Programs
        for (const prog of seedData.programs_catalog) {
            const ref = db.collection("programs_catalog").doc(prog.id);
            batch.set(ref, prog, { merge: true });
            count++;
        }

        // Schedule Events
        for (const event of seedData.scheduleEvents) {
            const ref = db.collection("scheduleEvents").doc(event.id);
            batch.set(ref, event, { merge: true });
            count++;
        }

        // Enrollments
        for (const enr of seedData.enrollments) {
            const ref = db.collection("enrollments").doc(enr.id);
            batch.set(ref, enr, { merge: true });
            count++;
        }

        await batch.commit();

        return NextResponse.json({
            success: true,
            message: `Seed data applied successfully. Writes: ${count}`,
            targetDate: "2025-12-30"
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
