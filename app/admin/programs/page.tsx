import "server-only"
import { getPrograms } from "@/lib/firebase-admin"
import ProgramsClient from "./programs-client"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function ProgramsPage() {
  const programs = await getPrograms()
  return <ProgramsClient initialPrograms={programs} />
}
