
import * as admin from "firebase-admin";
import fs from "fs";
import path from "path";

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

async function inspectExemplar() {
    console.log("Inspecting enrollments...");
    const snap = await db.collection("enrollments").limit(20).get();
    snap.forEach(doc => {
        const data = doc.data();
        console.log(`ID: ${doc.id}`);
        console.log(`  Schedule:`, JSON.stringify(data.schedule));
        if (!data.schedule || !data.schedule.day || !data.schedule.time) {
            console.error("  >>> INVALID SCHEDULE DETECTED <<<");
        }
    });

    console.log("Inspecting scheduleEvents...");
    const sSnap = await db.collection("scheduleEvents").limit(10).get();
    sSnap.forEach(doc => {
        const data = doc.data();
        console.log(`ID: ${doc.id}`);
        console.log(`  Day: ${data.dayOfWeek}, Time: ${data.time}`);
    });
}

inspectExemplar().catch(console.error);
