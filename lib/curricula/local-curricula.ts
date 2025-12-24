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

export const catSessions: Session[] = [
    createPlaceholderSession("cat-program", 1, "CAT"),
    createPlaceholderSession("cat-program", 2, "CAT"),
    createPlaceholderSession("cat-program", 3, "CAT"),
    {
        // GOLD SESSION — SECTION INTENT IS FIXED.
        // Do NOT homogenize tone across sections.
        // Opening/Review are procedural; Teach/Activity allow reflection.
        // Language is intentionally unpolished to maintain authenticity.
        id: "cat-program-session-4",
        programId: "cat-program",
        sessionNumber: 4,
        title: "Core Beliefs",
        purpose: "Understand how core beliefs shape our perceptions, behaviors, and interactions.",
        objectives: [
            "Define core beliefs and how they are formed",
            "Understand the 'filter' effect of core beliefs on perception",
            "Identify limiting core beliefs and their impact on behavior",
            "Practice reframing core beliefs in real-time scenarios"
        ],
        facilitatorPrompts: [
            {
                id: "cat-4-overview",
                section: "overview",
                content: "Introduction: 'What This Session Is About'.\n\nExplain: We are going to examine the core beliefs that drive our behavior. This is not about judging what you believe, but identifying it so we can see how it influences your actions.\n\nNote: Keep the tone neutral and supportive. We are mapping the territory, not diagnosing the person.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-4-opening",
                section: "opening",
                content: "Discussion: 'What Is a Core Belief?'\n\nAsk: 'When I say Core Belief, what does that mean to you?'\nPrompts: Beliefs about people (trust/distrust), Fairness (the system), Rules (do they apply?).\n\nNote: Do not correct them yet. Just get their definitions on the board.",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-4-teach-1",
                section: "teach",
                content: "Concept: Beliefs and Behavior.\n\nTeach: Your beliefs dictate your actions. If you believe 'disrespect must be punished,' you will fight. If you believe 'I can't change,' you won't try. The belief comes *before* the behavior.\n\nNote: Focus on accountability. Connect the thinking directly to the action.",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-4-teach-2",
                section: "teach",
                content: "Concept: How Core Beliefs Work (The Filter).\n\nMetaphor: Core beliefs are like sunglasses. If you wear green glasses, everything looks green. You forget you are wearing them and think that's just how the reality is. They filter out facts that don't fit and magnify ones that do.\n\nReflection: what color lenses might you be wearing?\n\nNote: If they argue about what is 'true,' bring it back to the impact of the belief.",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-4-activity-1",
                section: "activity",
                content: "Activity: Identifying Core Beliefs.\n\nGuide participants to the 'Identifying Core Beliefs' worksheet. Ask them to pick the one that they recognize in themselves.\n\nNote: Walk around and help them link a specific recent behavior to one of these beliefs.",
                suggestedPacing: "15 min"
            },
            {
                id: "cat-4-activity-2",
                section: "activity",
                content: "Activity: Core Beliefs in Real-Life Situations.\n\nRead Scenarios 1-4. Ask: 'If a person believes [X], how do they react here?'\n\nNote: Watch for justification. Keep the focus on how the belief causes the reaction.",
                suggestedPacing: "15 min"
            },
            {
                id: "cat-4-discuss",
                section: "activity",
                content: "Group Discussion.\n\nAsk: 'Did you see a pattern? Does one belief show up at home, work, and here?'\n\nNote: Validate the insight. Look for the pattern.",
                suggestedPacing: "15 min"
            },
            {
                id: "cat-4-wrapup",
                section: "wrapup",
                content: "Looking Ahead.\n\nPrompt: This week, try to catch your 'filter' in action. Just notice it. Ask: 'Is this the only way to see this?'\n\nNote: Keep the close structured. Avoid reopening the debate.",
                suggestedPacing: "5 min"
            }
        ],
        activityTemplates: [
            {
                id: "cat-4-worksheet-1",
                type: "worksheet",
                title: "Identifying Core Beliefs",
                instructions: "Review the list of common core beliefs. Check the ones that feel familiar to you.",
                questions: [
                    { id: "q-cat-4-1", text: "Do you often feel: 'I must be perfect to be loved'?", type: "text" },
                    { id: "q-cat-4-2", text: "Do you often feel: 'The world is dangerous and I must protect myself'?", type: "text" },
                    { id: "q-cat-4-3", text: "Do you often feel: 'I am not good enough'?", type: "text" },
                    { id: "q-cat-4-4", text: "Select the STRONGEST one. How does this belief affect your daily decisions?", type: "text" }
                ]
            },
            {
                id: "cat-4-worksheet-2",
                type: "worksheet",
                title: "Scenario Practice",
                instructions: "Read Scenario 1: 'Your boss critiques your work in front of others.'",
                questions: [
                    { id: "q-cat-4-5", text: "Reaction if you believe 'I am incompetent':", type: "text" },
                    { id: "q-cat-4-6", text: "Reaction if you believe 'I can learn from mistakes':", type: "text" }
                ]
            }
        ],
        homeworkTemplate: {
            id: "cat-4-hw",
            title: "Catching the Filter",
            steps: [
                "Notice one situation this week where you felt a strong reaction.",
                "Ask yourself: What belief might be filtering my view?",
                "Write it down (don't judge it, just note it)."
            ],
            dueDescription: "Before Session 5"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Session 4: Core Beliefs\n\nParticipant identified core belief: [INSERT]. Discussed impact on behavior. Engagement in scenario work: [INSERT].\n\nFacilitator Notes:\n[INSERT NOTES]"
    },
    createPlaceholderSession("cat-program", 5, "CAT"),
    createPlaceholderSession("cat-program", 6, "CAT"),
    createPlaceholderSession("cat-program", 7, "CAT"),
    createPlaceholderSession("cat-program", 8, "CAT"),
    createPlaceholderSession("cat-program", 9, "CAT"),
];

export const codaSessions: Session[] = Array.from({ length: 10 }, (_, i) =>
    createPlaceholderSession("coda", i + 1, "CODA")
);

export const relapsePreventionSessions: Session[] = Array.from({ length: 9 }, (_, i) =>
    createPlaceholderSession("relapse-prevention", i + 1, "Relapse Prevention")
);

export const angerManagementSessions: Session[] = Array.from({ length: 12 }, (_, i) =>
    createPlaceholderSession("anger-management", i + 1, "Anger Management")
);
