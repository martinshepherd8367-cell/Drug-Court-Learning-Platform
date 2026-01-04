
import * as admin from "firebase-admin";
import fs from "fs";
import path from "path";
import seedData from "../data_import/court_ops_seed.json";

// Initialize Firebase Admin with Service Account
const serviceAccountPath = path.join(process.cwd(), "service-account.json");
if (!fs.existsSync(serviceAccountPath)) {
    console.error("Error: service-account.json not found.");
    process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

async function seed() {
    console.log("Starting Cloud Seed...");

    const batch = db.batch();
    let count = 0;

    // Users
    console.log(`Seeding ${seedData.users.length} users...`);
    for (const user of seedData.users) {
        // Firestore
        const ref = db.collection("users").doc(user.id);
        batch.set(ref, user, { merge: true });

        // Auth
        try {
            await auth.createUser({
                uid: user.id,
                email: user.email,
                displayName: user.name,
                password: "password123",
                emailVerified: true,
            });
            console.log(`+ Created auth user: ${user.email}`);
        } catch (error: any) {
            if (error.code !== 'auth/uid-already-exists') {
                console.warn(`! Failed auth for ${user.email}: ${error.code}`);
            }
        }
        count++;
    }

    // Programs
    if (seedData.programs_catalog) {
        console.log(`Seeding ${seedData.programs_catalog.length} programs...`);
        for (const prog of seedData.programs_catalog) {
            const ref = db.collection("programs_catalog").doc(prog.id);
            batch.set(ref, prog, { merge: true });
            count++;
        }
    }

    // Schedule Events
    if (seedData.scheduleEvents) {
        console.log(`Seeding ${seedData.scheduleEvents.length} schedule events...`);
        for (const event of seedData.scheduleEvents) {
            const ref = db.collection("scheduleEvents").doc(event.id);
            batch.set(ref, event, { merge: true });
            count++;
        }
    }

    // Enrollments
    if (seedData.enrollments) {
        console.log(`Seeding ${seedData.enrollments.length} enrollments...`);
        for (const enr of seedData.enrollments) {
            const ref = db.collection("enrollments").doc(enr.id);
            batch.set(ref, enr, { merge: true });
            count++;
        }
    }

    console.log(`Committing batch with ${count} operations...`);
    await batch.commit();
    console.log("Seed complete!");
}

seed().catch(console.error);
