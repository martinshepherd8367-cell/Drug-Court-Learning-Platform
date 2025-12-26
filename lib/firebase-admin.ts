import "server-only"
import * as admin from "firebase-admin"

interface AdminConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

function normalizePrivateKey(key: string): string {
  // 1. Trim whitespace and quotes
  let validKey = key.trim();
  if (validKey.startsWith('"') && validKey.endsWith('"')) {
    validKey = validKey.slice(1, -1);
  }

  // 2. Handle JSON object case
  if (validKey.startsWith("{")) {
    try {
      const parsed = JSON.parse(validKey);
      if (parsed.private_key) {
        validKey = parsed.private_key;
      }
    } catch (e) {
      console.warn("FIREBASE_ADMIN: Failed to parse private key as JSON");
    }
  }

  // 3. Replace escaped newlines
  // Replaces literal "\n" strings with actual newline characters
  validKey = validKey.replace(/\\n/g, "\n");
  // Also handle Windows style just in case
  validKey = validKey.replace(/\\r\\n/g, "\n");

  // 4. Base64 Decode Check
  // Sometimes keys are base64 encoded to avoid newline issues
  if (!validKey.includes("BEGIN PRIVATE KEY") && !validKey.includes("BEGIN RSA PRIVATE KEY")) {
     try {
       const decoded = Buffer.from(validKey, 'base64').toString('utf-8');
       if (decoded.includes("BEGIN")) {
         validKey = decoded;
       }
     } catch(e) { /* ignore */ }
  }

  // 5. Validation
  // PEM keys must have header/footer
  if (!validKey.includes("BEGIN") || !validKey.includes("END")) {
    console.error("FIREBASE_ADMIN: Private Key missing BEGIN/END markers.");
    // We let it pass to credential.cert which might throw, 
    // but better to catch early or provide clear error.
  }
  
  return validKey;
}

function getFirebaseConfig(): AdminConfig | undefined {
  // A) Try strict environment variables first
  let projectId = process.env.FIREBASE_PROJECT_ID;
  let clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // B) Try Google Cloud Credentials JSON if loaded in specific env var
  if ((!projectId || !clientEmail || !privateKey) && process.env.GOOGLE_CREDENTIALS) {
     try {
       const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);
       projectId = projectId || creds.project_id;
       clientEmail = clientEmail || creds.client_email;
       privateKey = privateKey || creds.private_key;
     } catch(e) { console.error("FIREBASE_ADMIN: Failed to parse GOOGLE_CREDENTIALS", e); }
  }

  if (projectId && clientEmail && privateKey) {
    return {
      projectId,
      clientEmail,
      privateKey: normalizePrivateKey(privateKey),
    }
  }
  
  return undefined
}

export function initAdmin() {
  if (!admin.apps.length) {
    const config = getFirebaseConfig()
    if (config) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: config.projectId,
            clientEmail: config.clientEmail,
            privateKey: config.privateKey,
          }),
        })
        console.log("FIREBASE_ADMIN: Initialized successfully with project ID:", config.projectId);
      } catch(e: any) {
        console.error("FIREBASE_ADMIN: Initialization failed:", e.message);
      }
    } else {
      console.warn("FIREBASE_ADMIN: Missing environment variables for initialization.")
    }
  }
  return admin
}

// Keep db as a lazy getter or handle initialization safety
let _db: admin.firestore.Firestore | null = null;
try {
   const app = initAdmin();
   if (app.apps.length) {
       _db = app.firestore();
   }
} catch (e) {
    console.error("Failed to init admin firestore", e);
}

export const db = _db;

// --- Data Fetching Helpers ---

export async function getProgramsCount(): Promise<number> {
  if (!db) return 0
  try {
    const snapshot = await db.collection("programs").count().get()
    return snapshot.data().count
  } catch (error) {
    console.error("Error fetching programs count:", error)
    return 0
  }
}

export async function getUsersCount(): Promise<number> {
  if (!db) return 0
  try {
    const snapshot = await db.collection("users").count().get()
    return snapshot.data().count
  } catch (error) {
    console.error("Error fetching users count:", error)
    return 0
  }
}

export async function getEnrollmentsCount(): Promise<number> {
  if (!db) return 0
  try {
    const snapshot = await db.collection("enrollments").where("status", "==", "active").count().get()
    return snapshot.data().count
  } catch (error) {
    console.error("Error fetching enrollments count:", error)
    return 0
  }
}

export async function getPrograms() {
  if (!db) return []
  try {
    const snapshot = await db.collection("programs").get()
    return snapshot.docs.map(doc => {
       const data = doc.data();
       return { 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null
       }
    })
  } catch (error) {
    console.error("Error fetching programs:", error)
    return []
  }
}

export async function getUsers() {
    if (!db) return []
    try {
      const snapshot = await db.collection("users").get()
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
           id: doc.id, 
           ...data,
           createdAt: data.createdAt?.toDate?.()?.toISOString() || null
        }
      })
    } catch (error) {
      console.error("Error fetching users:", error)
      return []
    }
  }
