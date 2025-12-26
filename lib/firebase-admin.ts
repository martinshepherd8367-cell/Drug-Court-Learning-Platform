import "server-only"
import * as admin from "firebase-admin"

interface AdminConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

function getFirebaseConfig(): AdminConfig | undefined {
  // Try to parse from single Google Credentials JSON content if available (common in Vercel)
  if (process.env.GOOGLE_CREDENTIALS) {
     try {
       const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);
       return {
         projectId: creds.project_id,
         clientEmail: creds.client_email,
         privateKey: creds.private_key,
       };
     } catch(e) { console.error("Failed to parse GOOGLE_CREDENTIALS", e); }
  }

  // Fallback to individual vars
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }
  }
  return undefined
}

export function initAdmin() {
  if (!admin.apps.length) {
    const config = getFirebaseConfig()
    if (config) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.projectId,
          clientEmail: config.clientEmail,
          privateKey: config.privateKey,
        }),
      })
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
       // Serializing dates if necessary for Client Components
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
