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
                content: "Introduction: 'What This Session Is About'.\n\nExplain: Today is a meaningful chance to look 'under the hood' at what drives us. This isn't about blaming ourselves for what we believe, but understanding *why* we believe it and how it steers the ship.\n\nNote: Keep the tone reflective and supportive. Avoid clinical jargon. This is about curiosity, not diagnosis.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-4-opening",
                section: "opening",
                content: "Discussion: 'What Is a Core Belief?'\n\nAsk: 'When we talk about core beliefs, what comes to mind?'\nPrompts: Beliefs about people (are they good/bad?), Fairness (does the world owe me?), Rules (do they apply to me?).\n\nNote: Engage without correction. Get their raw definitions and map the territory.",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-4-teach-1",
                section: "teach",
                content: "Concept: Beliefs and Behavior.\n\nTeach: Beliefs act as the visible script for our actions. How we interpret 'fairness' or 'respect' changes how we react. If I believe 'I can't change,' I stop trying.\n\nNote: Frame this through accountability. Focus on how the belief *leads* to the behavior.",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-4-teach-2",
                section: "teach",
                content: "Concept: How Core Beliefs Work (The Filter).\n\nMetaphor: Core beliefs are like sunglasses. If you wear green glasses, everything looks green. You forget you're wearing them; you just think the world *is* green. They filter out facts that don't fit and magnify ones that do.\n\nReflection: What color are your glasses today?\n\nNote: Redirect debates about 'truth' back to the *impact* of the belief.",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-4-activity-1",
                section: "activity",
                content: "Activity: Identifying Core Beliefs.\n\nGuide participants to the 'Identifying Core Beliefs' worksheet (Part 1). Ask them to look at the list through the 'Filter' concept. Which one jumps out?\n\nNote: Circulate and observe. Help them connect a specific recent behavior to one of these beliefs.",
                suggestedPacing: "15 min"
            },
            {
                id: "cat-4-activity-2",
                section: "activity",
                content: "Activity: Core Beliefs in Real-Life Situations.\n\nReview Scenarios 1-4. Ask: 'If someone held this belief, how would they likely react here?'\n\nNote: Listen for justifications ('Well he *should* be mad'). Redirect focus to the underlying belief driving that feeling.",
                suggestedPacing: "15 min"
            },
            {
                id: "cat-4-discuss",
                section: "activity",
                content: "Group Discussion.\n\nAsk: 'What patterns did you notice? Did you find a belief that shows up in multiple areas (home, work, legal)?'\n\nNote: Reinforce patterns over 'right' answers. Validate the insight.",
                suggestedPacing: "15 min"
            },
            {
                id: "cat-4-wrapup",
                section: "wrapup",
                content: "Looking Ahead.\n\nPrompt: This week, try to catch your 'filter' in action. Just once. Ask yourself: 'Is this the only way to see this thought?' No need to change it yet—just notice it.\n\nNote: Keep the close structured. Avoid reopening the debate.",
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
