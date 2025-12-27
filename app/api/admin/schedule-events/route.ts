import { getDb } from "@/lib/firebase-admin"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// POST: create schedule event
export async function POST(req: Request) {
  try {
    const { programId, facilitatorId, dayOfWeek, time, location, active } = await req.json()
    if (!programId || !facilitatorId) {
       return NextResponse.json({ ok: false, error: "Missing required fields: programId, facilitatorId" }, { status: 400 })
    }

    const db = getDb()
    const docRef = await db.collection("scheduleEvents").add({
       programId,
       facilitatorId,
       dayOfWeek: dayOfWeek || "Monday",
       time: time || "10:00 AM",
       location: location || "TBD",
       active: active !== undefined ? active : true,
       createdAt: new Date().toISOString()
    })

    return NextResponse.json({ ok: true, id: docRef.id })
  } catch (error: any) {
    console.error("API POST schedule-event error:", error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}
