"use client"

import Link from "next/link"
import { ArrowLeft, ExternalLink, AlertTriangle, CheckCircle } from "lucide-react"
import { curriculaPrograms, CURRICULUM_VERSION } from "@/lib/curricula"

export default function CurriculumReviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Curriculum Review (Pre-Audit)</h1>
            <p className="text-gray-600 mt-1">
              Internal audit index for reviewing content across roles.
            </p>
            <p className="text-xs text-gray-400 mt-2 font-mono">
              Curriculum Version: {CURRICULUM_VERSION}
            </p>
          </div>
        </header>

        <div className="space-y-8">
          {curriculaPrograms.map((program) => {
            const sessionNumbers = program.sessions.map(s => s.sessionNumber)
            const maxSessionNum = Math.max(...sessionNumbers, 0)
            const hasDuplicates = new Set(sessionNumbers).size !== sessionNumbers.length
            const isSequential = sessionNumbers.length === maxSessionNum && !hasDuplicates // Simplified check

            return (
              <details key={program.slug} className="group bg-white rounded-lg border border-gray-200 shadow-sm open:shadow-md transition-all" open>
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none border-b border-transparent group-open:border-gray-100 hover:bg-gray-50/50 rounded-t-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-gray-900">{program.name}</h2>
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-mono text-gray-600">
                        {program.slug}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{program.sessions.length} Sessions</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Integrity Checks */}
                    {!isSequential && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm border border-amber-200">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Numbering Issue</span>
                      </div>
                    )}
                    <div className="transition-transform duration-200 group-open:rotate-180 text-gray-400">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                  </div>
                </summary>

                <div className="p-6 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 font-medium">
                        <th className="pb-3 pl-2 w-16">#</th>
                        <th className="pb-3">Session Title</th>
                        <th className="pb-3 w-24">Structure</th>
                        <th className="pb-3 w-48 text-right pr-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[...program.sessions].sort((a, b) => a.sessionNumber - b.sessionNumber).map((session) => (
                        <tr key={session.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 pl-2 font-mono text-gray-600">{session.sessionNumber}</td>
                          <td className="py-3 font-medium text-gray-900">{session.title}</td>
                          <td className="py-3 text-gray-500">
                            <span title="Prompts" className="inline-flex items-center gap-1 mr-3">
                              <span className="font-semibold text-gray-700">{session.facilitatorPrompts.length}</span> prompts
                            </span>
                            <span title="Objectives" className="inline-flex items-center gap-1">
                              <span className="font-semibold text-gray-700">{session.objectives.length}</span> obj
                            </span>
                          </td>
                          <td className="py-3 text-right pr-2">
                            <div className="flex items-center justify-end gap-2">
                              {/* Participant Link */}
                              <Link
                                href={`/participant/programs/${program.slug}/sessions/${session.sessionNumber}`}
                                target="_blank"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 transition-colors border border-green-200 text-xs font-medium"
                              >
                                Participant
                                <ExternalLink className="h-3 w-3" />
                              </Link>

                              {/* Facilitator Link */}
                              <Link
                                href={`/facilitator/programs/${program.slug}/sessions/${session.sessionNumber}`}
                                target="_blank"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 transition-colors border border-blue-200 text-xs font-medium"
                              >
                                Facilitator
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )
          })}
        </div>
      </div>
    </div>
  )
}
