
import dbtData from "./data/dbt-program.json";
import { Program, Session, ActivityTemplate, ActivityQuestion, HomeworkTemplate, FacilitatorPrompt } from "./types";

const mapQuestions = (fields: any[]): ActivityQuestion[] => {
    return fields.map((f, idx) => ({
        id: f.id,
        text: f.label,
        type: "text", // Defaulting to text since JSON fields are text-like
    }));
};

const mapSessions = (weeks: any[]): Session[] => {
    return weeks.map((week) => {
        // Construct Facilitator Prompts from Standard Flow + Discussion Prompts
        const prompts: FacilitatorPrompt[] = [
            {
                id: `fp-${week.weekNumber}-overview`,
                section: "overview",
                content: week.sessionPurpose,
                suggestedPacing: "5 min"
            },
            {
                id: `fp-${week.weekNumber}-opening`,
                section: "opening",
                content: `Connect with group. Discussion Prompts: ${week.discussionPrompts.join("\n- ")}`,
                suggestedPacing: "10 min"
            },
            {
                id: `fp-${week.weekNumber}-teach`,
                section: "teach",
                content: `Standard Flow: ${dbtData.standardSessionFlow.teach}`,
                suggestedPacing: "20 min"
            },
            {
                id: `fp-${week.weekNumber}-activity`,
                section: "activity",
                content: `In-Class Worksheet: ${week.inClassWorksheet.title}. Purpose: ${week.inClassWorksheet.purpose}`,
                suggestedPacing: "15 min"
            },
            {
                id: `fp-${week.weekNumber}-wrapup`,
                section: "wrapup",
                content: `Homework: ${week.homeworkSheet.title}. ${dbtData.standardSessionFlow.close}`,
                suggestedPacing: "5 min"
            }
        ];

        // Activity Template from inClassWorksheet
        const activityTemplates: ActivityTemplate[] = [{
            id: week.inClassWorksheet.id,
            type: "worksheet",
            title: week.inClassWorksheet.title,
            instructions: week.inClassWorksheet.purpose,
            questions: mapQuestions(week.inClassWorksheet.fields)
        }];

        // Homework Template from homeworkSheet
        const homeworkTemplate: HomeworkTemplate = {
            id: week.homeworkSheet.id,
            title: week.homeworkSheet.title,
            steps: [
                week.homeworkSheet.purpose,
                ...mapQuestions(week.homeworkSheet.fields).map(q => `Complete field: ${q.text}`)
            ],
            dueDescription: "Before next session"
        };

        return {
            id: `dbt-session-${week.weekNumber}`,
            programId: dbtData.programSlug,
            sessionNumber: week.weekNumber,
            title: week.title,
            purpose: week.sessionPurpose,
            objectives: [week.sessionPurpose], // Using purpose as main objective
            facilitatorPrompts: prompts,
            activityTemplates: activityTemplates,
            homeworkTemplate: homeworkTemplate,
            journalTemplateId: week.dailyJournalTemplateId,
            caseworxNoteTemplate: `Session ${week.weekNumber}: ${week.title}\n\nParticipant attended session focusing on ${week.sessionPurpose}. Completed ${week.inClassWorksheet.title}.\n\nFacilitator Notes:\n[INSERT NOTES]`
        };
    });
};

export const dbtProgram: Program = {
    id: dbtData.programSlug,
    slug: dbtData.programSlug,
    name: dbtData.programName,
    description: `${dbtData.intendedSetting}. ${dbtData.programAbbrev} Program.`,
    totalSessions: dbtData.totalWeeks,
    isLocked: false,
    sessions: mapSessions(dbtData.weeks)
};
