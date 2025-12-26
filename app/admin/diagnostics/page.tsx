import "server-only"
import { db } from "@/lib/firebase-admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import crypto from 'crypto'

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function diagnoseKey(rawKey: string) {
  try {
    if (!rawKey) return { status: "MISSING", details: {} };

    let key = rawKey.trim();
    if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
      key = key.slice(1, -1);
    }
    if (key.startsWith("{")) {
       try { const p = JSON.parse(key); if (p.private_key) key = p.private_key; } catch(e){}
    }
    
    key = key.replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    const beginMatch = key.match(/-----BEGIN ?(RSA)? ?PRIVATE KEY-----/);
    const endMatch = key.match(/-----END ?(RSA)? ?PRIVATE KEY-----/);
    const hasBegin = !!beginMatch;
    const hasEnd = !!endMatch;

    let bodyCharCount = 0;
    let reconstructed = "";
    
    if (hasBegin && hasEnd) {
       const match = key.match(/-----BEGIN ?(RSA)? ?PRIVATE KEY-----([\s\S]*)-----END ?(RSA)? ?PRIVATE KEY-----/);
       if (match && match[2]) {
          const rawBody = match[2].replace(/\s/g, "");
          bodyCharCount = rawBody.length;
          const chunks = rawBody.match(/.{1,64}/g) || [];
          reconstructed = `-----BEGIN PRIVATE KEY-----\n${chunks.join("\n")}\n-----END PRIVATE KEY-----\n`;
       }
    } else {
       const cleanKey = key.replace(/\s/g, "");
       if (/^[A-Za-z0-9+/=]+$/.test(cleanKey) && cleanKey.length > 100) {
          bodyCharCount = cleanKey.length;
          const chunks = cleanKey.match(/.{1,64}/g) || [];
          reconstructed = `-----BEGIN PRIVATE KEY-----\n${chunks.join("\n")}\n-----END PRIVATE KEY-----\n`;
       }
    }

    let cryptoParseOk = false;
    let cryptoError = null;
    if (reconstructed) {
       try {
          crypto.createPrivateKey({ key: reconstructed, format: 'pem' });
          cryptoParseOk = true;
       } catch (e: any) {
          cryptoError = e.message;
       }
    } else {
       cryptoError = "Could not reconstruct PEM (missing headers or invalid format)";
    }

    return {
       status: "PRESENT",
       details: {
          hasBegin,
          hasEnd,
          bodyCharCount,
          cryptoParseOk,
          cryptoError
       }
    };

  } catch (e: any) {
    return { status: "ERROR", details: { error: e.message } };
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
    
  const keyInfo = diagnoseKey(process.env.FIREBASE_PRIVATE_KEY || "");

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
             <p>Runtime: Node.js (Forced)</p>
             
             <div className="mt-2 p-2 bg-slate-100 rounded">
                <p className="font-semibold">Private Key Diagnosis:</p>
                <p>Status: {keyInfo.status}</p>
                {keyInfo.status === "PRESENT" && (
                   <div className="ml-2 grid grid-cols-2 gap-x-4 gap-y-1">
                      <span>Has BEGIN header:</span>
                      <span>{keyInfo.details.hasBegin ? "Yes" : "No"}</span>
                      
                      <span>Has END footer:</span>
                      <span>{keyInfo.details.hasEnd ? "Yes" : "No"}</span>
                      
                      <span>Body Char Count:</span>
                      <span>{keyInfo.details.bodyCharCount}</span>
                      
                      <span>Crypto Parse OK:</span>
                      <span className={keyInfo.details.cryptoParseOk ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                        {keyInfo.details.cryptoParseOk ? "YES" : "NO"}
                      </span>
                      
                      {!keyInfo.details.cryptoParseOk && (
                        <div className="col-span-2 text-red-500 text-xs mt-1">
                           Error: {keyInfo.details.cryptoError}
                        </div>
                      )}
                   </div>
                )}
             </div>
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
