import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    buildId: "golden-baseline-zip10",
    targetService: "drug-court-learning-platform-458193648844",
    targetRegion: "us-central1",
    buildTime: new Date().toISOString(),
  })
}
