import { getDb } from "@/lib/firebase-admin"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// POST: create enrollment
export async function POST(req: Request) {
  try {
    const { userId, programId, status, currentSession, startDate } = await req.json()
    if (!userId || !programId) {
       return NextResponse.json({ ok: false, error: "Missing required fields: userId, programId" }, { status: 400 })
    }

    const db = getDb()
    const docRef = await db.collection("enrollments").add({
       userId,
       programId,
       status: status || "active",
       currentSession: currentSession || 1,
       startDate: startDate || new Date().toISOString(),
       progress: 0,
       createdAt: new Date().toISOString()
    })

    return NextResponse.json({ ok: true, id: docRef.id })
  } catch (error: any) {
    console.error("API POST enrollment error:", error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}
