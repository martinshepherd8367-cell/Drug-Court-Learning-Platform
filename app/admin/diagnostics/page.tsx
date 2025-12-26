import "server-only"
import { getDb, getFirebaseAdminStatus } from "@/lib/firebase-admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

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
  
  // Safe status check
  const status = getFirebaseAdminStatus();
  
  let db = null;
  let dbInitError = null;
  try {
     db = getDb();
  } catch(e: any) {
     dbInitError = e.message;
  }

  const results = await Promise.all(
    collectionNames.map(async (name) => {
      if (!db) return { name, count: null, error: dbInitError || "DB init failed" }
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
             <p>Runtime: Node.js (Forced)</p>
             
             <div className="mt-2 p-2 bg-slate-100 rounded">
                <p className="font-semibold">Firebase Admin Status:</p>
                <div className="grid grid-cols-2 gap-x-4">
                  <span>Has Project ID:</span>
                  <span className={status.hasProjectId ? "text-green-600" : "text-red-500"}>
                    {status.hasProjectId ? "Yes" : "No"}
                  </span>

                  <span>Has Client Email:</span>
                  <span className={status.hasClientEmail ? "text-green-600" : "text-red-500"}>
                    {status.hasClientEmail ? "Yes" : "No"}
                  </span>

                  <span>Crypto Parse OK:</span>
                  <span className={status.cryptoParseOk ? "text-green-600" : "text-red-500"}>
                    {status.cryptoParseOk ? "Yes" : "No"}
                  </span>
                  
                  <span>Active Apps:</span>
                  <span>{status.appsCount}</span>
                </div>
                {status.configError && (
                   <p className="text-red-500 text-xs mt-1">Config Error: {status.configError}</p>
                )}
                {dbInitError && (
                   <div className="bg-red-50 border border-red-200 text-red-600 p-2 mt-2 rounded font-mono text-xs">
                     DB INIT ERROR: {dbInitError}
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
