"use client"

import { useState } from "react"
import type { Program, Session, FacilitatorPrompt } from "@/lib/types"
import { AlertTriangle, ChevronDown, ChevronUp, FileText, CheckCircle, XCircle } from "lucide-react"
import { CURRICULUM_VERSION } from "@/lib/curricula"

// Curriculum sections that expect content
const CURRICULUM_SECTIONS = [
    { id: "overview", label: "Overview", type: "intro" },
    { id: "opening", label: "Opening", type: "intro" },
    { id: "review", label: "Review", type: "review" },
    { id: "teach", label: "Teach", type: "core" },
    { id: "activity", label: "Activity", type: "interactive" },
    { id: "wrapup", label: "Wrap-up", type: "closing" },
]

interface AuditPanelProps {
    program: Program
    session: Session
}

export function AuditPanel({ program, session }: AuditPanelProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Derived Metrics
    const sectionsData = CURRICULUM_SECTIONS.map((sectionDef) => {
        const facilitatorBlocks = session.facilitatorPrompts.filter((p) => p.section === sectionDef.id)

        // Logic for "Participant Blocks":
        // Currently, our data model only links activityTemplates, homework, etc. loosely.
        // We map them to specific sections for audit purposes:
        // - "activity": activityTemplates count
        // - "wrapup": homeworkTemplate (1 if exists) + journalTemplateId (1 if exists)
        // - Others: 0
        let participantCount = 0
        if (sectionDef.id === "activity") {
            participantCount = session.activityTemplates.length
        } else if (sectionDef.id === "wrapup") {
            if (session.homeworkTemplate) participantCount++
            if (session.journalTemplateId) participantCount++
        }

        const hasEmptyContent = facilitatorBlocks.some((b) => !b.content || b.content.trim() === "")

        return {
            ...sectionDef,
            facilitatorCount: facilitatorBlocks.length,
            participantCount,
            hasEmptyContent,
        }
    })

    // Warnings
    const warnings: string[] = []

    // 1. Empty Sections (no content blocks)
    // We only warn if BOTH counts are 0, assuming some sections might be specialized?
    // User request: "Any section with 0 facilitatorContent blocks" -> Explicit warning needed.
    // User request: "Any section with 0 participantContent blocks" -> Explicit warning needed.

    sectionsData.forEach((s) => {
        if (s.facilitatorCount === 0) {
            warnings.push(`Section '${s.label}': 0 facilitator blocks`)
        }
        if (s.participantCount === 0) {
            warnings.push(`Section '${s.label}': 0 participant blocks`)
        }
        if (s.hasEmptyContent) {
            warnings.push(`Section '${s.label}': Contains empty content blocks`)
        }
    })

    if (sectionsData.length === 0) {
        warnings.push("Session has 0 sections defined")
    }

    // Visuals
    return (
        <div className="mb-6 border-2 border-dashed border- amber-300 bg-amber-50 rounded-lg overflow-hidden">
            <div
                className="flex items-center justify-between p-3 cursor-pointer bg-amber-100 hover:bg-amber-200 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <span className="font-bold text-amber-900">Audit Panel (Pre-Audit)</span>
                    {warnings.length > 0 && (
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold border border-red-200">
                            {warnings.length} Warnings
                        </span>
                    )}
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 text-amber-700" /> : <ChevronDown className="h-4 w-4 text-amber-700" />}
            </div>

            {isOpen && (
                <div className="p-4 space-y-4">
                    {/* Header Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500 font-mono text-xs uppercase">Program</p>
                            <p className="font-medium">{program.name} <span className="text-gray-400">({program.slug})</span></p>
                        </div>
                        <div>
                            <p className="text-gray-500 font-mono text-xs uppercase">Session</p>
                            <p className="font-medium">#{session.sessionNumber}: {session.title}</p>
                        </div>
                        <div className="col-span-2 border-t border-gray-100 pt-2 text-right">
                            <p className="text-xs text-gray-400 font-mono">Version: {CURRICULUM_VERSION}</p>
                        </div>
                    </div>

                    {/* Objectives */}
                    <div>
                        <p className="text-gray-500 font-mono text-xs uppercase mb-1">Objectives</p>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-0.5 ml-1">
                            {session.objectives.map((obj, i) => (
                                <li key={i}>{obj}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Sections List */}
                    <div>
                        <p className="text-gray-500 font-mono text-xs uppercase mb-2">Sections Audit</p>
                        <div className="space-y-1">
                            {sectionsData.map((s, idx) => (
                                <div key={s.id} className="flex items-center justify-between text-sm p-2 bg-white rounded border border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-gray-400 w-4">{idx + 1}.</span>
                                        <span className="font-medium text-gray-800">{s.label}</span>
                                        <span className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border">
                                            {s.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs">
                                        <span className={s.facilitatorCount === 0 ? "text-red-600 font-bold" : "text-gray-600"}>
                                            Facilitator: {s.facilitatorCount}
                                        </span>
                                        <span className="text-gray-300">|</span>
                                        <span className={s.participantCount === 0 ? "text-red-600 font-bold" : "text-gray-600"}>
                                            Participant: {s.participantCount}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Warnings List */}
                    {warnings.length > 0 && (
                        <div className="bg-red-50 p-3 rounded border border-red-100 mt-2">
                            <p className="text-red-800 font-bold text-xs uppercase mb-1 flex items-center gap-1">
                                <XCircle className="h-3 w-3" /> Integrity Warnings
                            </p>
                            <ul className="list-none space-y-1">
                                {warnings.map((w, i) => (
                                    <li key={i} className="text-red-700 text-xs pl-4 relative before:content-['•'] before:absolute before:left-1">
                                        {w}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
