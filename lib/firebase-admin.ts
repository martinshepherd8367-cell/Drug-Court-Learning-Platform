import "server-only"
import * as admin from "firebase-admin"
import crypto from 'crypto'

interface AdminConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

/**
 * Robust private key normalization for Vercel/Node environments.
 * Handles escaped newlines, quotes, JSON wrapping, and missing header/footers.
 */
function normalizePrivateKey(key: string): string {
  // 1. Trim whitespace and quotes
  let validKey = key.trim();
  if (validKey.startsWith('"') && validKey.endsWith('"')) {
    validKey = validKey.slice(1, -1);
  } else if (validKey.startsWith("'") && validKey.endsWith("'")) {
    validKey = validKey.slice(1, -1);
  }

  // 2. Handle JSON object case (common if full creds pasted)
  if (validKey.startsWith("{")) {
    try {
      const parsed = JSON.parse(validKey);
      if (parsed.private_key) {
        validKey = parsed.private_key;
      }
    } catch (e) {
      // Not JSON, continue treating as string
    }
  }

  // 3. Robust Newline Replacement
  // Replaces double-escaped newlines (e.g. from Vercel env UI as string literal)
  // then regular newlines.
  validKey = validKey.replace(/\\r/g, "\r");
  validKey = validKey.replace(/\\n/g, "\n");
  validKey = validKey.replace(/\r\n/g, "\n");
  validKey = validKey.replace(/\n/g, "\n");

  // 4. Base64 Decode Check
  if (!validKey.includes("BEGIN PRIVATE KEY") && !validKey.includes("BEGIN RSA PRIVATE KEY")) {
     try {
       const decoded = Buffer.from(validKey, 'base64').toString('utf-8');
       if (decoded.includes("BEGIN")) {
         validKey = decoded;
       }
     } catch(e) { /* ignore */ }
  }

  // 5. Ensure Headers exist and are properly separated
  // Sometimes aggressive trims remove the newline after BEGIN or before END
  if (validKey.includes("BEGIN PRIVATE KEY") && !validKey.includes("BEGIN PRIVATE KEY\n")) {
      validKey = validKey.replace("-----BEGIN PRIVATE KEY-----", "-----BEGIN PRIVATE KEY-----\n");
  }
  if (validKey.includes("END PRIVATE KEY") && !validKey.includes("\n-----END PRIVATE KEY")) {
      validKey = validKey.replace("-----END PRIVATE KEY-----", "\n-----END PRIVATE KEY-----");
  }

  return validKey;
}

function validateKeyWithCrypto(key: string) {
    try {
        crypto.createPrivateKey({ key, format: 'pem' });
        // If no error, it's valid
    } catch (e: any) {
        throw new Error(`FIREBASE_PRIVATE_KEY could not be parsed by Node crypto: ${e.message}`);
    }
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
    const normalizedKey = normalizePrivateKey(privateKey);
    // VALIDATE BEFORE RETURNING
    // This allows us to catch configuration errors at boot time (or first access)
    try {
        validateKeyWithCrypto(normalizedKey);
    } catch (e: any) {
        console.error("CRITICAL: Firebase Private Key Validation Failed.", e.message);
    }
    
    return {
      projectId,
      clientEmail,
      privateKey: normalizedKey,
    }
  }
  
  return undefined
}

// Singleton reference
let adminApp: admin.app.App | null = null;

export function initAdmin() {
  if (adminApp) return admin;

  if (!admin.apps.length) {
    const config = getFirebaseConfig()
    if (config) {
      try {
        // Double check crypto validity again to be safe before passing to firebase
        validateKeyWithCrypto(config.privateKey);

        adminApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: config.projectId,
            clientEmail: config.clientEmail,
            privateKey: config.privateKey,
          }),
        })
        console.log("FIREBASE_ADMIN: Initialized successfully with project ID:", config.projectId);
      } catch(e: any) {
        console.error("FIREBASE_ADMIN: Initialization failed:", e.message);
        // We do NOT throw here to avoid crashing the whole process on import if this is top-level.
        // But functions depending on db will fail.
      }
    } else {
      console.warn("FIREBASE_ADMIN: Missing environment variables for initialization.")
    }
  } else {
    adminApp = admin.app();
  }
  return admin
}

// Keep db as a lazy getter
let _db: admin.firestore.Firestore | null = null;

export const db = new Proxy({}, {
    get: (_target, prop) => {
        // Initialize on first access
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


// --- Data Fetching Helpers ---

export async function getProgramsCount(): Promise<number> {
  // Accessing db properties triggers the proxy
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
