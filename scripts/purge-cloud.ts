
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

async function purge() {
    const collections = ["users", "programs_catalog", "enrollments", "scheduleEvents"];

    for (const colName of collections) {
        console.log(`Purging ${colName}...`);
        const snapshot = await db.collection(colName).listDocuments();
        if (snapshot.length === 0) {
            console.log(`  - Empty.`);
            continue;
        }

        const batchSize = 100;
        let count = 0;
        let batch = db.batch();

        for (const doc of snapshot) {
            batch.delete(doc);
            count++;
            if (count % batchSize === 0) {
                await batch.commit();
                batch = db.batch();
                process.stdout.write(".");
            }
        }
        await batch.commit();
        console.log(`  - Deleted ${count} docs.`);
    }
}

purge().catch(console.error);
