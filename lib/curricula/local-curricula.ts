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
                content: "This session focuses on identifying core beliefs and understanding how they influence behavior. Core beliefs are deeply held assumptions about self, others, and the world that operate automatically. These beliefs often serve as the foundation for criminal and addictive thinking, including entitlement, victim stance, and justification.\n\nThe purpose of this session is not to debate whether beliefs are true or false. The purpose is to examine how beliefs shape behavior and decisions, often without awareness.\n\nFacilitator Notes:\nKeep the tone practical and behavior-focused. Avoid therapy language. Emphasize impact over accuracy. Participants may not understand this concept yet; that is expected.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-4-opening",
                section: "opening",
                content: "Begin with brief check-ins and allow participants to get settled. Have participants open their CAT books or navigate to Session 4 in the app.\n\nIntroduce the session clearly:\n\n“Today we are working on Chapter 4, which is about core beliefs.”\n\nOpen the discussion with exploratory questions:\n\n“What do you think a core belief is?”\n“Where do core beliefs come from?”\n\nAllow responses without correction. Expect answers such as rules, values, or slogans. Acknowledge participation and ensure each participant has an opportunity to speak.\n\nFacilitator Notes:\nDo not correct or redefine yet. The goal here is engagement and baseline understanding, not accuracy.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-4-review",
                section: "review",
                content: "Briefly connect this session to earlier CAT concepts by reinforcing that thinking drives behavior. Clarify that core beliefs operate underneath justifications, entitlement, and victim stance.\n\nExplain the distinction:\n\nRules and opinions are not core beliefs.\nCore beliefs are assumptions that feel automatic and obvious.\n\nTransition into teaching by noting that many people act on beliefs they have never examined.\n\nFacilitator Notes:\nThis is where accountability language fits. Keep the focus on behavior and decision-making, not emotions.",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-4-teach",
                section: "teach",
                content: "Core beliefs are deep ideas about how the world works, how other people are, and what kind of person someone believes they are. These beliefs act like a filter and shape how situations are interpreted and how decisions are made.\n\nProvide common examples:\n\n“Everyone is out for themselves.”\n“You can’t trust anyone.”\n“There are more bad people than good people.”\n“I always get the short end of the stick.”\n\nInvite reflection:\n\n“Which of these sounds familiar?”\n“Which ones have shown up in your life?”\n\nGo around the room and allow participants to identify a belief that resonates. Some beliefs may be challenged using questions. Others should simply be noted.\n\nExplore behavior links:\n\n“If someone believes everyone is out for themselves, how might that affect how they act?”\n“How could that belief justify dishonesty or selfish decisions?”\n“How does a victim belief make certain choices feel reasonable?”\n\nUse real-world examples to gently challenge extreme beliefs. Focus on observable behavior rather than emotional explanations.\n\nFacilitator Notes:\nParticipants may attempt to defend beliefs as facts. Redirect by asking how the belief affects behavior. Avoid debating truth. Avoid emotional labels such as fear or anxiety.",
                suggestedPacing: "20 min"
            },
            {
                id: "cat-4-activity",
                section: "activity",
                content: "Introduce the activity as individual reflection.\n\nParticipants complete the in-app worksheet with the following prompts:\nIdentify three core beliefs you hold.\nDescribe a situation where each belief influenced your behavior.\nExplain how the belief helped justify that action at the time.\n\nAllow quiet time for completion. Sharing is optional.\n\nFacilitator Notes:\nThis activity often triggers defensiveness. Use questions rather than confrontation. Reinforce that the task is awareness, not judgment.",
                suggestedPacing: "15 min"
            },
            {
                id: "cat-4-responses",
                section: "responses",
                content: "Invite volunteers to share observations or patterns they noticed. Reinforce accountability language and real-life application.\n\nKey points to reinforce verbally:\nCore beliefs are learned, not facts.\nUnexamined beliefs often justify harmful behavior.\nAwareness is the first step toward change.\n\nFacilitator Notes:\nDo not pressure disclosure. Reinforce effort and insight rather than “right answers.”",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-4-notes",
                section: "notes",
                content: "Participants may derail by arguing that beliefs are true. Redirect to impact.\nAvoid shaming or moralizing.\nKeep discussion grounded in behavior and outcomes.\nThis session sets groundwork for later distorted thinking material.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-4-caseworx",
                section: "caseworx",
                content: "Document participation, engagement, and insight related to core beliefs. Note whether the participant identified beliefs and connected them to behavior. Reference “core beliefs” explicitly. Avoid emotional or diagnostic language.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-4-wrapup",
                section: "wrapup",
                content: "Summarize the session:\nCore beliefs influence thinking, behavior, and decisions. Awareness allows for different choices.\n\nEncourage participants to notice beliefs that appear between sessions, especially those that justify dishonesty, entitlement, or avoidance.\n\nClose the group calmly and transition forward.\n\nFacilitator Notes:\nEnd with clarity and structure. Avoid open-ended debate at close.",
                suggestedPacing: "5 min"
            }
        ],
        activityTemplates: [
            {
                id: "cat-4-worksheet-1",
                type: "worksheet",
                title: "Identifying Core Beliefs and Behavior",
                instructions: "Identify three core beliefs you hold. Describe a situation where each belief influenced your behavior. Explain how the belief helped justify that action at the time.",
                questions: [
                    { id: "q-cat-4-1", text: "Core Belief #1:", type: "text" },
                    { id: "q-cat-4-2", text: "Core Belief #2:", type: "text" },
                    { id: "q-cat-4-3", text: "Core Belief #3:", type: "text" },
                    { id: "q-cat-4-4", text: "How did one of these beliefs influence a recent behavior?", type: "text" },
                    { id: "q-cat-4-5", text: "(Optional) How did this belief help you justify the action?", type: "text" }
                ]
            },
            {
                id: "cat-4-worksheet-2",
                type: "worksheet",
                title: "Core Beliefs in Real-Life Situations",
                instructions: "Read the following scenarios and answer the questions.",
                questions: [
                    { id: "q-cat-4-scen-1", text: "Scenario 1: Your boss critiques your work in front of others.", type: "text" },
                    { id: "q-cat-4-scen-2", text: "Scenario 2: A cashier gives you too much change.", type: "text" },
                    { id: "q-cat-4-scen-3", text: "Scenario 3: Someone cuts you off in traffic.", type: "text" },
                    { id: "q-cat-4-scen-4", text: "Scenario 4: You are denied a request you felt you deserved.", type: "text" },
                    { id: "q-cat-4-reflection", text: "Which scenario felt most familiar, and why?", type: "text" }
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
