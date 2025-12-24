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
    {
        id: "cat-program-session-1",
        programId: "cat-program",
        sessionNumber: 1,
        title: "Introduction to Criminal and Addictive Thinking",
        purpose: "Explore how thinking patterns influence behavior in addiction and criminal behavior. Build a shared language regarding 'criminal and addictive thinking'.",
        objectives: [
            "Build a shared language for criminal and addictive thinking",
            "Identify thoughts that precede risky decisions",
            "Understand how thinking patterns influence behavior",
            "Introduction to accountability and behavior change"
        ],
        facilitatorPrompts: [
            {
                id: "cat-1-overview",
                section: "overview",
                content: "This session introduces the purpose and structure of the CAT curriculum and establishes group expectations. Participants explore how thinking patterns influence behavior in addiction and criminal behavior. The focus is on accountability: distorted thinking can make harmful choices feel acceptable, reduce responsibility, and keep the cycle going.\n\nThe goal of Session 1 is to build a shared language for “criminal and addictive thinking” and to begin identifying the kinds of thoughts that show up before risky decisions.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-1-opening",
                section: "opening",
                content: "Begin with a brief greeting and check-in. Allow participants to settle and open the app to Session 1.\n\nIntroduce the session:\n\n“Today we’re starting CAT. This program is about how thinking drives choices and how choices create outcomes.”\n\nOpen the room with discussion prompts:\n\n“What do you think ‘criminal and addictive thinking’ means?”\n“Can a person know something is a bad idea and still talk themselves into it? How?”\n“What are some common statements people tell themselves right before a bad decision?”\n\nAllow each participant an opportunity to respond. Do not correct early answers. Collect them and use them as examples later.",
                participantContent: "Most people have “self-talk” that explains why a choice makes sense. In addiction and criminal behavior, that self-talk often protects the behavior. It can sound like confidence, logic, or “common sense,” but it usually ends in consequences.\n\nAs we start CAT, think about this:\n\nWhat are the most common things you tell yourself right before a bad decision?",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-1-review",
                section: "review",
                content: "Since this is the first CAT session, use this time to review expectations and set the frame for the group.\n\nReview the working agreements:\n\n• Show up and participate.\n• Respect the group.\n• Stay focused on accountability and change.\n• Use examples from real life when possible.\n\nClarify the purpose of CAT:\n\nThis is a skill-based class. The goal is not to judge people, but to identify thinking that leads to consequences and to practice a different way of responding.",
                participantContent: "This program is about skill-building and accountability. It is not about judging you as a person. It is about identifying thinking that leads to problems and learning how to respond differently.\n\nIn group, effort matters more than perfect answers.",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-1-teach",
                section: "teach",
                content: "Define criminal and addictive thinking in plain language:\n\nCriminal and addictive thinking is a pattern of distorted thoughts that justifies or excuses harmful behavior. It often shows up as quick “reasons” that make a bad choice feel necessary, normal, or deserved.\n\nExplain why it matters:\n\nIf the thought stays unchallenged, the behavior usually follows. When the thought is noticed and questioned, a person has a chance to choose differently.\n\nIntroduce common categories without going deep:\n\n• Denial: “It’s not a problem.”\n• Minimizing: “It’s not that bad.”\n• Justifying: “I had a reason.”\n• Blaming: “It’s their fault.”\n• Entitlement: “I deserve it.”\n• Avoidance: “I’ll deal with it later.”\n\nConnect to accountability:\n\nAccountability does not mean self-hate. It means owning choices and recognizing patterns so they can be changed.\n\nTeach a simple sequence:\n\nSituation → Thought/Story → Choice → Outcome\n\nReinforce that the group will build tools for interrupting the sequence throughout CAT.",
                participantContent: "Criminal and addictive thinking is a pattern of distorted thoughts that justifies or excuses harmful behavior. It often shows up fast and sounds reasonable in the moment.\n\nExamples include:\n\n“It’s not that big of a deal.”\n“I deserve this.”\n“They did it to me first.”\n“I’ll deal with it later.”\n“This time will be different.”\n\nThe purpose of noticing these thoughts is simple: if you can spot them, you can slow down and choose differently.",
                suggestedPacing: "20 min"
            },
            {
                id: "cat-1-activity",
                section: "activity",
                content: "Have participants complete the in-session worksheet (below). The focus is on identifying real-life “self-talk” that justified risky choices.\n\nInstructions:\n\nAsk participants to write down three statements they have used to justify a harmful choice (use, lie, avoid, break rules, lash out, or any behavior that created consequences). Then have them connect each statement to the short-term payoff and the long-term cost.\n\nAllow quiet time for completion. Sharing is encouraged but optional.",
                participantContent: `Think about a recent choice that created consequences. It does not have to be a big event.

Write down:
• What happened
• What you told yourself
• What that thought allowed you to do

You will use this to complete today’s worksheet.

---------------------------------------------------------
WORKSHEET (IN-SESSION)
Title: Criminal and Addictive Thinking: My Self-Talk Before Consequences
Instructions: Choose one or more real-life examples. Keep it simple. The goal is to identify the thought that justified the behavior and the outcome that followed.
Prompts:
1) Write three statements you have used to justify a harmful choice.

Statement #1: ____________________________  
What did this statement allow you to do? ____________________________  
Short-term payoff: ____________________________  
Long-term cost: ____________________________

Statement #2: ____________________________  
What did this statement allow you to do? ____________________________  
Short-term payoff: ____________________________  
Long-term cost: ____________________________

Statement #3: ____________________________  
What did this statement allow you to do? ____________________________  
Short-term payoff: ____________________________  
Long-term cost: ____________________________

2) Choose one statement above and rewrite it using accountability language (owning the choice).

Accountability version: ____________________________

---------------------------------------------------------
SCENARIO ACTIVITY (AFTER BREAK)
Title: Spot the Thinking: Real-Life Scenarios

Scenario 1  
After a stressful day, a person says, “I earned this. I deserve it,” and decides to use.  
Questions:  
• What distorted thinking is present?  
• What is the short-term payoff and long-term cost?  
• What is an accountability thought that could interrupt this?

Scenario 2  
A person misses a required appointment. They decide not to call and say, “They’re just trying to control me anyway,” and they avoid contact.  
Questions:  
• What distorted thinking is present?  
• What outcome is likely if the pattern continues?  
• What is one responsible action step?

Scenario 3  
A person takes something from a large store and says, “They can afford it,” and “They make plenty of money.”  
Questions:  
• What justification is being used?  
• What does this choice reinforce about the person’s identity?  
• What would accountability look like here?

Scenario 4  
A person relapses and says, “It’s my friend’s fault for bringing it around,” and refuses to look at their own choices.  
Questions:  
• What distorted thinking is present?  
• What choice points did the person still have?  
• What is a more responsible way to describe what happened?`,
                suggestedPacing: "15 min"
            },
            {
                id: "cat-1-responses",
                section: "responses",
                content: "Invite volunteers to share one statement they wrote and what it allowed them to do.\n\nUse facilitation questions:\n\n“What did that thought make easier?”\n“What did it help you ignore?”\n“What was the payoff in the moment?”\n“What was the cost later?”\n\nNormalize the process:\n\nMany participants will recognize the same categories (justifying, minimizing, blaming). Reinforce that awareness is the first skill in the program.",
                participantContent: "In discussion, you may be asked:\n\nWhat was the thought that “made it okay”?\nWhat did it help you ignore?\nWhat happened afterward?\n\nFocus on identifying the thinking, not defending the behavior.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-1-notes",
                section: "notes",
                content: "Common derailment: participants defend the thought as “true.” Redirect to impact.\n\nUse questions that bring it back to behavior:\n\n“Whether it’s true or not, what did that thought lead you to do?”\n“What outcomes does that belief create for you?”\n\nKeep the tone firm and respectful. The goal is a shared language and honest reflection, not argument.",
                participantContent: "Honesty helps this program work. You do not have to share details you are not comfortable sharing.\n\nThe goal is awareness and change.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-1-caseworx",
                section: "caseworx",
                content: "Document attendance, engagement, and whether the participant was able to identify examples of criminal/addictive thinking.\n\nLook for:\n\n• Participation in discussion\n• Completion of worksheet\n• Ability to connect thinking → behavior → consequences\n• Willingness to practice accountability language",
                participantContent: "Your participation and completion of activities may be documented. Personal details are optional. Engagement and effort matter.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-1-wrapup",
                section: "wrapup",
                content: "Summarize:\n\nCriminal and addictive thinking is the “self-talk” that excuses or justifies harmful behavior. If it stays automatic, it stays powerful. If it is noticed, it can be changed.\n\nBetween sessions, ask participants to notice one thought that shows up before a risky choice and write it down to bring back to group.",
                participantContent: "Between now and next session, notice one thought that shows up before a risky choice. Write it down if you can. Bringing one real example to group will help you build the skill.",
                suggestedPacing: "5 min"
            }
        ],
        activityTemplates: [
            {
                id: "cat-1-worksheet-1",
                type: "worksheet",
                title: "Criminal and Addictive Thinking: My Self-Talk Before Consequences",
                instructions: "Choose one or more real-life examples. Keep it simple. The goal is to identify the thought that justified the behavior and the outcome that followed. Write three statements you have used to justify a harmful choice.",
                questions: [
                    { id: "q-cat-1-s1", text: "Statement #1:", type: "text" },
                    { id: "q-cat-1-s1-allow", text: "What did this statement allow you to do?", type: "text" },
                    { id: "q-cat-1-s1-payoff", text: "Short-term payoff:", type: "text" },
                    { id: "q-cat-1-s1-cost", text: "Long-term cost:", type: "text" },

                    { id: "q-cat-1-s2", text: "Statement #2:", type: "text" },
                    { id: "q-cat-1-s2-allow", text: "What did this statement allow you to do?", type: "text" },
                    { id: "q-cat-1-s2-payoff", text: "Short-term payoff:", type: "text" },
                    { id: "q-cat-1-s2-cost", text: "Long-term cost:", type: "text" },

                    { id: "q-cat-1-s3", text: "Statement #3:", type: "text" },
                    { id: "q-cat-1-s3-allow", text: "What did this statement allow you to do?", type: "text" },
                    { id: "q-cat-1-s3-payoff", text: "Short-term payoff:", type: "text" },
                    { id: "q-cat-1-s3-cost", text: "Long-term cost:", type: "text" },

                    { id: "q-cat-1-accountability", text: "Choose one statement above and rewrite it using accountability language (owning the choice). Accountability version:", type: "text" }
                ]
            },
            {
                id: "cat-1-scenarios",
                type: "worksheet",
                title: "Spot the Thinking: Real-Life Scenarios",
                instructions: "Read the following scenarios and answer the questions.",
                questions: [
                    { id: "q-cat-1-scen-1", text: "Scenario 1\nAfter a stressful day, a person says, “I earned this. I deserve it,” and decides to use.\n\nQuestions:\n• What distorted thinking is present?\n• What is the short-term payoff and long-term cost?\n• What is an accountability thought that could interrupt this?", type: "text" },
                    { id: "q-cat-1-scen-2", text: "Scenario 2\nA person misses a required appointment. They decide not to call and say, “They’re just trying to control me anyway,” and they avoid contact.\n\nQuestions:\n• What distorted thinking is present?\n• What outcome is likely if the pattern continues?\n• What is one responsible action step?", type: "text" },
                    { id: "q-cat-1-scen-3", text: "Scenario 3\nA person takes something from a large store and says, “They can afford it,” and “They make plenty of money.”\n\nQuestions:\n• What justification is being used?\n• What does this choice reinforce about the person’s identity?\n• What would accountability look like here?", type: "text" },
                    { id: "q-cat-1-scen-4", text: "Scenario 4\nA person relapses and says, “It’s my friend’s fault for bringing it around,” and refuses to look at their own choices.\n\nQuestions:\n• What distorted thinking is present?\n• What choice points did the person still have?\n• What is a more responsible way to describe what happened?", type: "text" }
                ]
            }
        ],
        homeworkTemplate: {
            id: "cat-1-hw",
            title: "Observation",
            steps: [
                "Notice one thought that shows up before a risky choice.",
                "Write it down.",
                "Bring it to the next session."
            ],
            dueDescription: "Before Session 2"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Session Note: Criminal and Addictive Thinking (CAT) – Chapter 1 of 9\nTopic: Introduction to Criminal and Addictive Thinking\nReference: CAT Chapter 1\nDate/Time: ____________________________\n\nSummary:\n• Reviewed the purpose and structure of the CAT curriculum and group expectations.\n• Discussed how thinking patterns influence behavior and decision-making in addiction and criminal behavior.\n• Identified common distorted thinking that supports harmful choices (e.g., denial, minimizing, justification, blaming, entitlement, avoidance).\n• Reinforced that awareness of thinking is the first step toward accountability and behavior change.\n\nParticipant Progress / Skill Use:\nParticipant identified the following example(s) of criminal/addictive thinking: ____________________________.\nParticipant connected thinking to behavior and consequences and practiced an accountability statement: ____________________________.\n\nGroup Dynamics:\nParticipants were engaged and participated in discussion and exercises. The facilitator reinforced accountability, practical skill use, and applying concepts to real-life situations.\n\nCourt Question and Answer:\nQuestion: What is criminal and addictive thinking, and how does it affect behavior?\nAnswer: Criminal and addictive thinking is a pattern of distorted thoughts that justifies or excuses harmful behavior. It affects behavior by making bad choices feel acceptable and preventing accountability.\n\nExplanation for the Team Member:\nAnswers are appropriate if the participant describes distorted thinking (justifying, blaming, minimizing) and connects it to poor choices and consequences."
    },
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
                participantContent: "This session focuses on identifying core beliefs and understanding how they influence behavior. Core beliefs are deeply held assumptions about self, others, and the world that operate automatically. \n\nThe purpose of this session is not to debate whether beliefs are true or false. The purpose is to examine how your beliefs shape your behavior and decisions, often without awareness.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-4-opening",
                section: "opening",
                content: "Begin with brief check-ins and allow participants to get settled. Have participants open their CAT books or navigate to Session 4 in the app.\n\nIntroduce the session clearly:\n\n“Today we are working on Chapter 4, which is about core beliefs.”\n\nOpen the discussion with exploratory questions:\n\n“What do you think a core belief is?”\n“Where do core beliefs come from?”\n\nAllow responses without correction. Expect answers such as rules, values, or slogans. Acknowledge participation and ensure each participant has an opportunity to speak.\n\nFacilitator Notes:\nDo not correct or redefine yet. The goal here is engagement and baseline understanding, not accuracy.",
                participantContent: "What Is a Core Belief?\n\nConsider these questions:\n• What do you think a core belief is?\n• Where do core beliefs come from?",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-4-review",
                section: "review",
                content: "Briefly connect this session to earlier CAT concepts by reinforcing that thinking drives behavior. Clarify that core beliefs operate underneath justifications, entitlement, and victim stance.\n\nExplain the distinction:\n\nRules and opinions are not core beliefs.\nCore beliefs are assumptions that feel automatic and obvious.\n\nTransition into teaching by noting that many people act on beliefs they have never examined.\n\nFacilitator Notes:\nThis is where accountability language fits. Keep the focus on behavior and decision-making, not emotions.",
                participantContent: "Connecting Beliefs to Behavior\n\nCore beliefs operate underneath justifications, entitlement, and victim stance.\n\nKey Distinction:\n• Rules and opinions are not core beliefs.\n• Core beliefs are assumptions that feel automatic and obvious.\n\nMany people act on beliefs they have never examined.",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-4-teach",
                section: "teach",
                content: "Core beliefs are deep ideas about how the world works, how other people are, and what kind of person someone believes they are. These beliefs act like a filter and shape how situations are interpreted and how decisions are made.\n\nProvide common examples:\n\n“Everyone is out for themselves.”\n“You can’t trust anyone.”\n“There are more bad people than good people.”\n“I always get the short end of the stick.”\n\nInvite reflection:\n\n“Which of these sounds familiar?”\n“Which ones have shown up in your life?”\n\nGo around the room and allow participants to identify a belief that resonates. Some beliefs may be challenged using questions. Others should simply be noted.\n\nExplore behavior links:\n\n“If someone believes everyone is out for themselves, how might that affect how they act?”\n“How could that belief justify dishonesty or selfish decisions?”\n“How does a victim belief make certain choices feel reasonable?”\n\nUse real-world examples to gently challenge extreme beliefs. Focus on observable behavior rather than emotional explanations.\n\nFacilitator Notes:\nParticipants may attempt to defend beliefs as facts. Redirect by asking how the belief affects behavior. Avoid debating truth. Avoid emotional labels such as fear or anxiety.",
                participantContent: "Understanding Core Beliefs\n\nCore beliefs are deep ideas about how the world works, how other people are, and what kind of person you believe you are. These beliefs act like a filter and shape how situations are interpreted and how decisions are made.\n\nCommon Examples:\n• “Everyone is out for themselves.”\n• “You can’t trust anyone.”\n• “There are more bad people than good people.”\n• “I always get the short end of the stick.”\n\nReflection:\nIf you believe “everyone is out for themselves,” how might that affect how you act?\nHow could that belief justify dishonesty or selfish decisions?",
                suggestedPacing: "20 min"
            },
            {
                id: "cat-4-activity",
                section: "activity",
                content: "Introduce the activity as individual reflection.\n\nParticipants complete the in-app worksheet with the following prompts:\nIdentify three core beliefs you hold.\nDescribe a situation where each belief influenced your behavior.\nExplain how the belief helped justify that action at the time.\n\nAllow quiet time for completion. Sharing is optional.\n\nFacilitator Notes:\nThis activity often triggers defensiveness. Use questions rather than confrontation. Reinforce that the task is awareness, not judgment.",
                participantContent: "Activity: Identifying Core Beliefs\n\nComplete the worksheet below to identify core beliefs you hold and how they influence your behavior.",
                suggestedPacing: "15 min"
            },
            {
                id: "cat-4-responses",
                section: "responses",
                content: "Invite volunteers to share observations or patterns they noticed. Reinforce accountability language and real-life application.\n\nKey points to reinforce verbally:\nCore beliefs are learned, not facts.\nUnexamined beliefs often justify harmful behavior.\nAwareness is the first step toward change.\n\nFacilitator Notes:\nDo not pressure disclosure. Reinforce effort and insight rather than “right answers.”",
                participantContent: "Processing Insight\n\n• Core beliefs are learned, not facts.\n• Unexamined beliefs often justify harmful behavior.\n• Awareness is the first step toward change.",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-4-notes",
                section: "notes",
                content: "Participants may derail by arguing that beliefs are true. Redirect to impact.\nAvoid shaming or moralizing.\nKeep discussion grounded in behavior and outcomes.\nThis session sets groundwork for later distorted thinking material.",
                participantContent: "Notes\n\nKeep discussion grounded in behavior and outcomes.",
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
                participantContent: "Looking Ahead\n\nCore beliefs influence thinking, behavior, and decisions. Awareness allows for different choices.\n\nThis week, try to notice beliefs that appear in your daily life, especially those that justify dishonesty, entitlement, or avoidance.",
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
        caseworxNoteTemplate: "CAT Session 4: Core Beliefs\n\nAttendance: [Present/Late/Absent]  Check-in time: [HH:MM]\n\nParticipation/Engagement:\nParticipant participated in session content focused on core beliefs and behavior links.\n\nCore Beliefs + Behavior Link:\nParticipant identified core beliefs and connected them to behavior/decision-making. Examples discussed: [INSERT].\n\nWorksheet/Scenario Work:\nParticipant completed or engaged in worksheet and scenario-based activity: [INSERT].\n\nParticipant Takeaways (from app):\n[PASTE TAKEAWAYS HERE]\n\nFacilitator Notes:\n[PASTE FACILITATOR NOTES HERE]\n\n(Use accountability language. Avoid emotional or diagnostic language. Reference 'core beliefs' explicitly.)"
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
