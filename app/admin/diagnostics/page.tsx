import "server-only"
import { db } from "@/lib/firebase-admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

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

  const results = await Promise.all(
    collectionNames.map(async (name) => {
      if (!db) return { name, count: null, error: "DB not initialized" }
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
          <p className="text-sm text-gray-500">Project ID: {projectId}</p>
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
