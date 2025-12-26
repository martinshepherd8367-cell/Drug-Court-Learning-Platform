import "server-only"
import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore, Firestore } from "firebase-admin/firestore"
import crypto from 'crypto'

interface AdminConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

function normalizePrivateKey(rawKey: string): string {
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

function validateKey(key: string) {
    try {
        crypto.createPrivateKey({ key, format: 'pem' });
        return true;
    } catch (e: any) {
        throw new Error(`cryptoParseOk=false: ${e.message}`);
    }
}

function getFirebaseConfig(): AdminConfig {
  let projectId = process.env.FIREBASE_PROJECT_ID;
  let clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if ((!projectId || !clientEmail || !privateKey) && process.env.GOOGLE_CREDENTIALS) {
     try {
       const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);
       projectId = projectId || creds.project_id;
       clientEmail = clientEmail || creds.client_email;
       privateKey = privateKey || creds.private_key;
     } catch(e) { console.error("FIREBASE_ADMIN: Failed to parse GOOGLE_CREDENTIALS", e); }
  }

  if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY");
  }

  const normalizedKey = normalizePrivateKey(privateKey);
  validateKey(normalizedKey);
  
  return { projectId, clientEmail, privateKey: normalizedKey }
}

export function getDb(): Firestore {
  const apps = getApps();
  if (apps.length === 0) {
    try {
      const config = getFirebaseConfig();
      initializeApp({
        credential: cert({
            projectId: config.projectId,
            clientEmail: config.clientEmail,
            privateKey: config.privateKey,
        }),
      });
    } catch (e: any) {
      console.error("FIREBASE_ADMIN: Initialization failed:", e.message);
      throw e;
    }
  }
  return getFirestore();
}

export function getFirebaseAdminStatus() {
    let configError = null;
    let hasProjectId = false;
    let hasClientEmail = false;
    let cryptoParseOk = false;
    
    try {
        let projectId = process.env.FIREBASE_PROJECT_ID;
        let clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;
        
        if ((!projectId || !clientEmail || !privateKey) && process.env.GOOGLE_CREDENTIALS) {
             const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);
             projectId = projectId || creds.project_id;
             clientEmail = clientEmail || creds.client_email;
             privateKey = privateKey || creds.private_key;
        }
        
        hasProjectId = !!projectId;
        hasClientEmail = !!clientEmail;
        
        if (privateKey) {
            const norm = normalizePrivateKey(privateKey);
            validateKey(norm);
            cryptoParseOk = true;
        }
    } catch(e: any) {
        configError = e.message;
    }

    return {
        appsCount: getApps().length,
        hasProjectId,
        hasClientEmail,
        cryptoParseOk,
        configError
    }
}

// --- Data Fetching Helpers ---

export async function getProgramsCount(): Promise<number> {
  try {
    const db = getDb();
    const snapshot = await db.collection("programs_catalog").count().get()
    return snapshot.data().count
  } catch (error) {
    console.error("Error fetching programs count:", error)
    return 0
  }
}

export async function getUsersCount(): Promise<number> {
  try {
    const db = getDb();
    const snapshot = await db.collection("users").count().get()
    return snapshot.data().count
  } catch (error) {
    console.error("Error fetching users count:", error)
    return 0
  }
}

export async function getEnrollmentsCount(): Promise<number> {
  try {
    const db = getDb();
    const snapshot = await db.collection("enrollments").where("status", "==", "active").count().get()
    return snapshot.data().count
  } catch (error) {
    console.error("Error fetching enrollments count:", error)
    return 0
  }
}

export async function getScheduleEventsCount(): Promise<number> {
  try {
    const db = getDb();
    const snapshot = await db.collection("scheduleEvents").count().get()
    return snapshot.data().count
  } catch (error) {
    console.error("Error fetching schedule events count:", error)
    return 0
  }
}

export async function getPrograms() {
  try {
    const db = getDb();
    const snapshot = await db.collection("programs_catalog").get()
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
    try {
      const db = getDb();
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

export async function getScheduleEvents() {
    try {
      const db = getDb();
      const snapshot = await db.collection("scheduleEvents").get();
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
           id: doc.id, 
           ...data
        }
      })
    } catch (error) {
      console.error("Error fetching schedule events:", error)
      return []
    }
}
