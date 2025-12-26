import "server-only"
import * as admin from "firebase-admin"
import crypto from 'crypto'

interface AdminConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

/**
 * Robustly reconstructs a valid PEM private key from various mangled formats.
 * Focuses on extracting the Base64 body and rebuilding the headers/footers.
 */
function normalizePrivateKey(rawKey: string): string {
  let key = rawKey.trim();

  // 1. Strip surrounding quotes (common in .env files)
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }

  // 2. Handle JSON case
  if (key.startsWith("{")) {
    try {
      const parsed = JSON.parse(key);
      if (parsed.private_key) key = parsed.private_key;
    } catch (e) {}
  }

  // 3. Normalize newlines (convert literal \n to real newlines, and CRLF to LF)
  key = key.replace(/\\n/g, "\n").replace(/\\r/g, "\r"); // unescape literals
  key = key.replace(/\r\n/g, "\n").replace(/\r/g, "\n"); // normalize

  // 4. Extract Body between BEGIN and END markers
  // Supports RSA PRIVATE KEY and PRIVATE KEY
  const match = key.match(/-----BEGIN ?(RSA)? ?PRIVATE KEY-----([\s\S]*)-----END ?(RSA)? ?PRIVATE KEY-----/);
  
  if (match && match[2]) {
    const rawBody = match[2].replace(/\s/g, ""); // Remove ALL whitespace/newlines from body
    // Re-chunk into 64-char lines
    const chunks = rawBody.match(/.{1,64}/g) || [];
    const body = chunks.join("\n");
    return `-----BEGIN PRIVATE KEY-----\n${body}\n-----END PRIVATE KEY-----\n`;
  }

  // 5. Fallback: If no headers found, check if it assumes a raw base64 body (unlikely for Google keys but possible)
  const cleanKey = key.replace(/\s/g, "");
  if (/^[A-Za-z0-9+/=]+$/.test(cleanKey) && cleanKey.length > 100) {
      const chunks = cleanKey.match(/.{1,64}/g) || [];
      const body = chunks.join("\n");
      return `-----BEGIN PRIVATE KEY-----\n${body}\n-----END PRIVATE KEY-----\n`;
  }

  // Return original if regex failed and not obviously raw base64 - crypto check will fail later.
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

function getFirebaseConfig(): AdminConfig | undefined {
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

  if (projectId && clientEmail && privateKey) {
    try {
        const normalizedKey = normalizePrivateKey(privateKey);
        validateKey(normalizedKey);
        return { projectId, clientEmail, privateKey: normalizedKey }
    } catch (e: any) {
        throw e;
    }
  }
  
  return undefined
}

let adminApp: admin.app.App | null = null;

export function initAdmin() {
  if (adminApp) return admin;

  if (!admin.apps.length) {
    try {
        const config = getFirebaseConfig();
        if (config) {
            adminApp = admin.initializeApp({
              credential: admin.credential.cert({
                projectId: config.projectId,
                clientEmail: config.clientEmail,
                privateKey: config.privateKey,
              }),
            });
            console.log("FIREBASE_ADMIN: Initialized successfully with project ID:", config.projectId);
        } else {
             console.warn("FIREBASE_ADMIN: Missing environment variables.");
        }
    } catch (e: any) {
        console.error("FIREBASE_ADMIN: Initialization failed:", e.message);
    }
  } else {
    adminApp = admin.app();
  }
  return admin;
}

let _db: admin.firestore.Firestore | null = null;

export const db = new Proxy({}, {
    get: (_target, prop) => {
        if (!_db) {
            try {
                const app = initAdmin();
                if (app && app.apps.length) {
                    _db = app.firestore();
                }
            } catch (e) {
                console.error("Lazy Init DB Failed", e);
            }
        }
        if (!_db) return undefined;
        // @ts-ignore
        const val = _db[prop];
        return typeof val === 'function' ? val.bind(_db) : val;
    }
}) as admin.firestore.Firestore;

export async function getProgramsCount(): Promise<number> {
  if (!db.collection) return 0;
  try {
    const snapshot = await db.collection("programs").count().get()
    return snapshot.data().count
  } catch (error) {
    console.error("Error fetching programs count:", error)
    return 0
  }
}

export async function getUsersCount(): Promise<number> {
  if (!db.collection) return 0;
  try {
    const snapshot = await db.collection("users").count().get()
    return snapshot.data().count
  } catch (error) {
    console.error("Error fetching users count:", error)
    return 0
  }
}

export async function getEnrollmentsCount(): Promise<number> {
  if (!db.collection) return 0;
  try {
    const snapshot = await db.collection("enrollments").where("status", "==", "active").count().get()
    return snapshot.data().count
  } catch (error) {
    console.error("Error fetching enrollments count:", error)
    return 0
  }
}

export async function getPrograms() {
  if (!db.collection) return [];
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
    if (!db.collection) return [];
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
