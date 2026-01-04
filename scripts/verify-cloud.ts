
import * as admin from "firebase-admin";
import fs from "fs";
import path from "path";

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

async function check() {
    console.log("Checking Cloud Firestore counts...");

    const usersSnap = await db.collection("users").count().get();
    const progSnap = await db.collection("programs_catalog").count().get();
    const enrSnap = await db.collection("enrollments").count().get();
    const schedSnap = await db.collection("scheduleEvents").count().get();

    console.log(`Users: ${usersSnap.data().count}`);
    console.log(`Programs: ${progSnap.data().count}`);
    console.log(`Enrollments: ${enrSnap.data().count}`);
    console.log(`Schedule Events: ${schedSnap.data().count}`);

    // List 5 users to verify
    const uSnap = await db.collection("users").limit(5).get();
    uSnap.forEach(d => console.log(` - User: ${d.id} (${d.data().email})`));
}

check().catch(console.error);
