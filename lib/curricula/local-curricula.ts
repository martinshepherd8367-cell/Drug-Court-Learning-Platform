import { Session } from "../types";

const createPlaceholderSession = (
    programId: string,
    sessionNum: number,
    programTitle: string
): Session => ({
    id: `${programId}-session-${sessionNum}`,
    programId,
    sessionNumber: sessionNum,
    title: `${programTitle} Session ${sessionNum}`,
    purpose: `Participant learning for ${programTitle} session ${sessionNum}.`,
    objectives: ["Understand key concepts", "Participate in group discussion", "Complete assigned worksheet"],
    facilitatorPrompts: [
        {
            id: `${programId}-${sessionNum}-overview`,
            section: "overview",
            content: `Overview of ${programTitle} Session ${sessionNum}`,
            suggestedPacing: "5 min"
        },
        {
            id: `${programId}-${sessionNum}-activity`,
            section: "activity",
            content: `Facilitate the core activity for session ${sessionNum}.`,
            suggestedPacing: "30 min"
        },
        {
            id: `${programId}-${sessionNum}-wrapup`,
            section: "wrapup",
            content: "Review key takeaways and assign homework.",
            suggestedPacing: "10 min"
        }
    ],
    activityTemplates: [
        {
            id: `${programId}-${sessionNum}-worksheet`,
            type: "worksheet",
            title: `${programTitle} Worksheet ${sessionNum}`,
            instructions: "Complete the following questions based on today's discussion.",
            questions: [
                { id: `q-${programId}-${sessionNum}-1`, text: "What was the most important thing you learned today?", type: "text" },
                { id: `q-${programId}-${sessionNum}-2`, text: "How can you apply this to your recovery?", type: "text" }
            ]
        }
    ],
    homeworkTemplate: {
        id: `${programId}-${sessionNum}-hw`,
        title: `${programTitle} Homework ${sessionNum}`,
        steps: ["Review session notes", "Practice the skill discussed today"],
        dueDescription: "Before the next session"
    },
    journalTemplateId: "journal-reflection",
    caseworxNoteTemplate: `${programTitle} Session ${sessionNum}\n\nParticipant attendance and engagement noted.\n\nFacilitator Notes:\n[INSERT NOTES]`
});

export const catSessions: Session[] = Array.from({ length: 9 }, (_, i) =>
    createPlaceholderSession("cat-program", i + 1, "CAT")
);

export const codaSessions: Session[] = Array.from({ length: 10 }, (_, i) =>
    createPlaceholderSession("coda", i + 1, "CODA")
);

export const relapsePreventionSessions: Session[] = Array.from({ length: 9 }, (_, i) =>
    createPlaceholderSession("relapse-prevention", i + 1, "Relapse Prevention")
);

export const angerManagementSessions: Session[] = Array.from({ length: 12 }, (_, i) =>
    createPlaceholderSession("anger-management", i + 1, "Anger Management")
);
