import type { Session, ParticipantSubmission } from "@/types/curriculum"

export function buildCaseWorxNote(
  session: Session,
  facilitatorNote: string,
  submissions: ParticipantSubmission[],
): string {
  const lines: string[] = []

  // Header
  lines.push(`=== SESSION NOTE ===`)
  lines.push(`Program: Prime Solutions`)
  lines.push(`Session ${session.number} of 16: ${session.title}`)
  lines.push(`Date: ${new Date().toLocaleDateString()}`)
  lines.push(``)

  // Objectives
  lines.push(`OBJECTIVES:`)
  const objectivesSection = session.sections.find((s) => s.type === "objectives")
  if (objectivesSection) {
    objectivesSection.blocks.forEach((block) => {
      if (Array.isArray(block.content)) {
        block.content.forEach((item) => lines.push(`- ${item}`))
      }
    })
  }
  lines.push(``)

  // Facilitator Note
  lines.push(`FACILITATOR NOTES:`)
  lines.push(facilitatorNote || "[No notes entered]")
  lines.push(``)

  // Homework Assigned
  lines.push(`HOMEWORK ASSIGNED:`)
  lines.push(session.homework)
  lines.push(``)

  // Participant Takeaways
  if (submissions.length > 0) {
    lines.push(`PARTICIPANT RESPONSES (${submissions.length}):`)
    submissions.forEach((sub, idx) => {
      lines.push(`${idx + 1}. ${sub.participantName}: "${sub.response}"`)
    })
  }
  lines.push(``)
  lines.push(`=== END NOTE ===`)

  return lines.join("\n")
}
