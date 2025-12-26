import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import crypto from "crypto";
import path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// --- Duplicated Helper Logic ---
function normalizePrivateKey(rawKey: string): string {
  if (!rawKey) return "";
  let key = rawKey.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  if (key.startsWith("{")) {
    try {
      const parsed = JSON.parse(key);
      if (parsed.private_key) key = parsed.private_key;
    } catch (e) {}
  }
  key = key.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
  key = key.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const match = key.match(/-----BEGIN ?(RSA)? ?PRIVATE KEY-----([\s\S]*)-----END ?(RSA)? ?PRIVATE KEY-----/);
  
  if (match && match[2]) {
    const rawBody = match[2].replace(/\s/g, "");
    const chunks = rawBody.match(/.{1,64}/g) || [];
    const body = chunks.join("\n");
    return `-----BEGIN PRIVATE KEY-----\n${body}\n-----END PRIVATE KEY-----\n`;
  }

  const cleanKey = key.replace(/\s/g, "");
  if (/^[A-Za-z0-9+/=]+$/.test(cleanKey) && cleanKey.length > 100) {
      const chunks = cleanKey.match(/.{1,64}/g) || [];
      const body = chunks.join("\n");
      return `-----BEGIN PRIVATE KEY-----\n${body}\n-----END PRIVATE KEY-----\n`;
  }
  return key; 
}

function getDb() {
  const apps = getApps();
  if (apps.length === 0) {
    let projectId = process.env.FIREBASE_PROJECT_ID;
    let clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if ((!projectId || !clientEmail || !privateKey) && process.env.GOOGLE_CREDENTIALS) {
       try {
         const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);
         projectId = projectId || creds.project_id;
         clientEmail = clientEmail || creds.client_email;
         privateKey = privateKey || creds.private_key;
       } catch(e) { console.error("Failed to parse GOOGLE_CREDENTIALS", e); }
    }
    
    if (!privateKey) throw new Error("Missing Private Key");
    
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: normalizePrivateKey(privateKey),
      }),
    });
  }
  return getFirestore();
}

async function seed() {
  console.log("Starting Seed...");
  const db = getDb();
  
  // 1. Ensure Programs (read only, or create if missing)
  const programsSnap = await db.collection("programs_catalog").get();
  let programDocs = programsSnap.docs;
  if (programDocs.length === 0) {
     console.log("No programs found, creating defaults...");
     const p1 = await db.collection("programs_catalog").add({
        title: "Substance Use Disorder Phase 1",
        slug: "sud-phase-1",
        totalSessions: 12,
        active: true,
        createdAt: new Date()
     });
     const p2 = await db.collection("programs_catalog").add({
        title: "Relapse Prevention",
        slug: "relapse-prevention",
        totalSessions: 8,
        active: true,
        createdAt: new Date()
     });
     programDocs = [p1 as any, p2 as any]; // reload not needed for id
     console.log("Created 2 programs.");
  } else {
     console.log(`Found ${programDocs.length} programs.`);
  }
  
  // 2. Ensure Users (read only, or create if missing)
  const usersSnap = await db.collection("users").get();
  let userDocs = usersSnap.docs;
  let participants = userDocs.filter(d => d.data().role === 'participant');
  let facilitators = userDocs.filter(d => d.data().role === 'facilitator');
  
  if (participants.length === 0) {
     console.log("No participants found, creating defaults...");
     const u1 = await db.collection("users").add({ name: "John Doe", email: "john@example.com", role: "participant", createdAt: new Date() });
     const u2 = await db.collection("users").add({ name: "Jane Smith", email: "jane@example.com", role: "participant", createdAt: new Date() });
     const u3 = await db.collection("users").add({ name: "Bob Wilson", email: "bob@example.com", role: "participant", createdAt: new Date() });
     participants = [u1 as any, u2 as any, u3 as any];
  }
  
  if (facilitators.length === 0) {
     console.log("No facilitators found, creating default...");
     const f1 = await db.collection("users").add({ name: "Dr. Sarah Connor", email: "sarah@clinic.com", role: "facilitator", createdAt: new Date() });
     facilitators = [f1 as any];
  }
  
  console.log(`Working with ${participants.length} participants and ${facilitators.length} facilitators.`);
  
  // 3. Create Enrollments
  const batch = db.batch();
  let enrollmentCount = 0;
  
  const existingEnrollments = await db.collection("enrollments").count().get();
  if (existingEnrollments.data().count < 3) {
      console.log("Seeding Enrollments...");
      for (const p of participants) {
          // Enroll in random program
          const program = programDocs[Math.floor(Math.random() * programDocs.length)];
          const ref = db.collection("enrollments").doc();
          batch.set(ref, {
             userId: p.id,
             programId: program.id,
             status: "active",
             startDate: new Date().toISOString(),
             currentSession: 1,
             progress: 0
          });
          enrollmentCount++;
      }
  } else {
      console.log("Enrollments already exist, skipping creation.");
  }

  // 4. Create Schedule Events
  const existingEvents = await db.collection("scheduleEvents").count().get();
  if (existingEvents.data().count < 3) {
      console.log("Seeding Schedule Events...");
      const days = ["Monday", "Wednesday", "Friday"];
      const times = ["10:00 AM", "2:00 PM", "6:00 PM"];
      
      for (let i = 0; i < 3; i++) {
          const program = programDocs[i % programDocs.length];
          const fac = facilitators[0]; // fallback to first
          const ref = db.collection("scheduleEvents").doc();
          batch.set(ref, {
             programId: program.id,
             facilitatorId: fac ? fac.id : "unknown",
             dayOfWeek: days[i % days.length],
             time: times[i % times.length],
             location: "Room " + (100 + i),
             active: true
          });
          enrollmentCount++; // counting total ops in batch really
      }
  } else {
      console.log("Schedule Events already exist, skipping creation.");
  }
  
  await batch.commit();
  console.log("Seed Complete.");
}

seed().catch(console.error);
