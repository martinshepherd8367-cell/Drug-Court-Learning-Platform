"use client"

import { useParams, notFound, useRouter } from "next/navigation"
import { curriculaPrograms } from "@/lib/curricula"
import { AuditPanel } from "@/components/audit-panel"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminAuditSessionView() {
    const params = useParams()
    const router = useRouter()
    const programSlug = params.programSlug as string
    const sessionNumber = Number(params.sessionNumber)

    const program = curriculaPrograms.find((p) => p.slug === programSlug)
    const session = program?.sessions.find((s) => s.sessionNumber === sessionNumber)

    if (!program || !session) {
        notFound()
    }

    // Helper to get prompts by section
    const getSectionPrompts = (sectionId: string) => {
        return session.facilitatorPrompts.filter((p) => p.section === sectionId)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Navigation */}
                <Button variant="ghost" className="mb-4" onClick={() => router.push("/admin/curriculum-review")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Curriculum Review
                </Button>

                {/* Audit Panel (The core requirement) */}
                <AuditPanel program={program} session={session} />

                {/* Content Preview (Simplified read-only view) */}
                <div className="space-y-8">
                    <div className="border-b border-gray-200 pb-4">
                        <h1 className="text-3xl font-bold text-gray-900">{session.title}</h1>
                        <p className="text-lg text-gray-600 mt-2">{session.purpose}</p>
                    </div>

                    {/* Objectives */}
                    <section>
                        <h2 className="text-xl font-semibold mb-3">Objectives</h2>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {session.objectives.map((obj, i) => (
                                <li key={i}>{obj}</li>
                            ))}
                        </ul>
                    </section>

                    {/* Sections Content Dump */}
                    <div className="space-y-6">
                        {["overview", "opening", "review", "teach", "activity", "responses", "notes", "caseworx", "wrapup"].map(sectionId => {
                            const prompts = getSectionPrompts(sectionId)
                            if (prompts.length === 0) return null

                            return (
                                <section key={sectionId} className="border rounded-lg bg-white p-4 shadow-sm">
                                    <h3 className="text-lg font-bold capitalize mb-4 border-b pb-2">{sectionId} Content</h3>
                                    <div className="space-y-4">
                                        {prompts.map((prompt) => (
                                            <Card key={prompt.id} className="bg-gray-50">
                                                <CardContent className="pt-6">
                                                    <p className="text-gray-800 whitespace-pre-wrap">{prompt.content}</p>
                                                    {prompt.suggestedPacing && (
                                                        <p className="text-xs text-gray-500 mt-2 font-mono">Pacing: {prompt.suggestedPacing}</p>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </section>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
