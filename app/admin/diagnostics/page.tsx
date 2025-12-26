import "server-only"
import { db } from "@/lib/firebase-admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import crypto from 'crypto'

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function getFormattedKeyStatus() {
  try {
      let key = process.env.FIREBASE_PRIVATE_KEY || "";
      // Minimal naive check first
      if (!key) return "MISSING";
      
      // We essentially repeat the normalization logic here to test validitiy for diagnostics
      // without exposing key
      let validKey = key.trim();
      if (validKey.startsWith('"') && validKey.endsWith('"')) validKey = validKey.slice(1, -1);
      else if (validKey.startsWith("'") && validKey.endsWith("'")) validKey = validKey.slice(1, -1);
      
      if (validKey.startsWith("{")) {
        try { const p = JSON.parse(validKey); if(p.private_key) validKey = p.private_key; } catch(e){}
      }
      
      validKey = validKey.replace(/\\r/g, "\r").replace(/\\n/g, "\n").replace(/\r\n/g, "\n").replace(/\n/g, "\n");
      
      if (!validKey.includes("BEGIN PRIVATE KEY") && !validKey.includes("BEGIN RSA PRIVATE KEY")) {
         try {
           const decoded = Buffer.from(validKey, 'base64').toString('utf-8');
           if (decoded.includes("BEGIN")) validKey = decoded;
         } catch(e) {}
      }
      
      if (validKey.includes("BEGIN PRIVATE KEY") && !validKey.includes("BEGIN PRIVATE KEY\n")) {
          validKey = validKey.replace("-----BEGIN PRIVATE KEY-----", "-----BEGIN PRIVATE KEY-----\n");
      }
      if (validKey.includes("END PRIVATE KEY") && !validKey.includes("\n-----END PRIVATE KEY")) {
          validKey = validKey.replace("-----END PRIVATE KEY-----", "\n-----END PRIVATE KEY-----");
      }

      crypto.createPrivateKey({ key: validKey, format: 'pem' });
      return "VALID (Crypto check passed)";
  } catch(e: any) {
      return "INVALID: " + e.message;
  }
}

export default async function DiagnosticsPage() {
  const collectionNames = [
    "users",
    "programs",
    "programs_catalog",
    "programsCatalog",
    "enrollments",
    "scheduleEvents",
    "schedule_events",
    "schedules"
  ]
  
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || "unknown"
  const clientEmail = (process.env.FIREBASE_CLIENT_EMAIL || "").split("@")[1] 
    ? "..." + (process.env.FIREBASE_CLIENT_EMAIL || "").split("@")[1] 
    : "missing";
    
  const keyStatus = getFormattedKeyStatus();

  const results = await Promise.all(
    collectionNames.map(async (name) => {
      // @ts-ignore
      if (!db.collection) return { name, count: null, error: "DB not initialized" }
      try {
        const snapshot = await db.collection(name).count().get()
        return { name, count: snapshot.data().count, error: null }
      } catch (e: any) {
        return { name, count: null, error: e.message }
      }
    })
  )

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Firestore Diagnostics</CardTitle>
          <div className="text-sm text-gray-500 space-y-1">
             <p>Project ID: {projectId}</p>
             <p>Client Email Domain: {clientEmail}</p>
             <p>Key Status: {keyStatus}</p>
             <p>Runtime: Node.js (Forced)</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((res) => (
              <div key={res.name} className="flex items-center justify-between p-2 border rounded">
                 <span className="font-mono">{res.name}</span>
                 {res.error ? (
                   <span className="text-red-500 text-sm">{res.error}</span>
                 ) : (
                   <span className="font-bold text-green-600">{res.count} docs</span>
                 )}
              </div>
            ))}
            
            <div className="mt-8 p-4 bg-gray-100 rounded text-xs font-mono">
               <p>Environment Check:</p>
               <p>NODE_ENV: {process.env.NODE_ENV}</p>
               <p>Has Creds: {!!process.env.FIREBASE_PRIVATE_KEY || !!process.env.GOOGLE_CREDENTIALS ? "Yes" : "No"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
