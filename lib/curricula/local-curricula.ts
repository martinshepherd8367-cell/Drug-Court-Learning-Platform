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
    {
        id: "cat-program-session-6",
        programId: "cat-program",
        sessionNumber: 6,
        title: "Common Thinking Distortions",
        purpose: "Identify and label specific thinking errors (distortions) that lead to negative feelings and behaviors.",
        objectives: [
            "Define 'Thinking Distortion'",
            "Identify 4 common distortions: All-or-Nothing, Blaming, Jumping to Conclusions, Emotional Reasoning",
            "Practice matching thoughts to distortion labels",
            "Apply labels to personal Thinking Reports"
        ],
        facilitatorPrompts: [
            {
                id: "cat-6-overview",
                section: "overview",
                content: "A Thinking Distortion is a specific pattern of error in our thoughts. It's like a smudge on the camera lens—it makes everything look distorted.\n\nToday we learn the names of these distortions.\n\nNaming a distortion takes away its power. Instead of saying \"I am a failure,\" we can say \"I am using All-or-Nothing thinking.\"",
                participantContent: "A Thinking Distortion is a specific pattern of error in our thoughts.\n\nNaming a distortion takes away its power.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-6-opening",
                section: "opening",
                content: "Check-in. Review Thinking Report Mental Practice from Session 5.\n\nAsk:\n“Did anyone catch a 'glitch' thought this week? What was it?”",
                participantContent: "Did anyone catch a 'glitch' thought this week?",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-6-review",
                section: "review",
                content: "Review the Thinking Report structure (S-T-F-B-C). Remind them that the 'Thought' is where the distortion lives.",
                participantContent: "The 'Thought' is where the distortion lives.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-6-teach",
                section: "teach",
                content: "Teach 4 Common Distortions:\n\n1. All-or-Nothing Thinking: Seeing things in black and white categories. If it's not perfect, it's a total failure.\n2. Blaming: Holding other people responsible for our pain/choices. \"He made me do it.\"\n3. Jumping to Conclusions: Mind-reading (thinking we know what others think) or Fortune-telling (predicting things will go bad).\n4. Emotional Reasoning: Assuming that because we FEEL a certain way, it must be true. \"I feel stupid, so I am stupid.\"\n\nGive examples for each.",
                participantContent: "Common Distortions:\n\n1. All-or-Nothing Thinking (Black & White)\n2. Blaming (It's their fault)\n3. Jumping to Conclusions (Mind reading / Fortune telling)\n4. Emotional Reasoning (I feel it, so it's true)",
                suggestedPacing: "20 min"
            },
            {
                id: "cat-6-activity",
                section: "activity",
                content: "Guide participants to the worksheet: 'Name that Distortion'.\n\nInstructions:\nRead the statement (Thought). Pick the distortion that fits best.\n\nExample:\n\"I relapsed once, so I might as well give up.\" -> All-or-Nothing Thinking.",
                participantContent: "Activity: Name that Distortion\n\nMatch the thought to the error.",
                suggestedPacing: "20 min"
            },
            {
                id: "cat-6-responses",
                section: "responses",
                content: "Review answers. Ask participants to share which distortion is their 'favorite' (the one they use most often).\n\nDiscussion:\n“Why is Blaming so easy to do?”\n“How does All-or-Nothing thinking set us up for relapse?”",
                participantContent: "Discussion:\nWhich distortion is your 'favorite'?",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-6-notes",
                section: "notes",
                content: "Facilitator Note:\nHumor helps here. These distortions are universal. \"My Common Distortions\" is about self-recognition, not shame.",
                participantContent: "We all have favorite distortions.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-6-caseworx",
                section: "caseworx",
                content: "Document session notes. Did the participant successfully identify distortions?",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-6-wrapup",
                section: "wrapup",
                content: "Close the session.\n\n“This week, try to catch your favorite distortion in action. Say to yourself: 'There I go practicing Blaming again.' naming it breaks the spell.”",
                participantContent: "Homework:\nCatch your favorite distortion in action.",
                suggestedPacing: "5 min"
            }
        ],
        activityTemplates: [
            {
                id: "cat-6-worksheet-1",
                type: "worksheet",
                title: "Name that Distortion",
                instructions: "Match the thought to the distortion: All-or-Nothing, Blaming, Jumping to Conclusions, Emotional Reasoning.",
                questions: [
                    { id: "q-cat-6-1", text: "1. \"If I don't get this job, my life is over.\"", type: "text" },
                    { id: "q-cat-6-2", text: "2. \"My PO looked at me funny, she is going to violate me.\"", type: "text" },
                    { id: "q-cat-6-3", text: "3. \"I yelled because you pushed my buttons.\"", type: "text" },
                    { id: "q-cat-6-4", text: "4. \"I feel guilty, so I must be a bad person.\"", type: "text" },
                    { id: "q-cat-6-5", text: "5. \"I already messed up my clean time, I might as well get high.\"", type: "text" }
                ]
            },
            {
                id: "cat-6-worksheet-2",
                type: "worksheet",
                title: "My Common Distortions",
                instructions: "Which distortions do you use most?",
                questions: [
                    { id: "q-cat-6-common", text: "Identify your top 2 distortions:", type: "text" },
                    { id: "q-cat-6-example", text: "Give a recent example of when you used one:", type: "text" }
                ]
            }
        ],
        homeworkTemplate: {
            id: "cat-6-hw",
            title: "Labeling Practice",
            steps: [
                "Notice a stressful thought.",
                "Label the distortion (e.g., 'That is just All-or-Nothing').",
                "See if the feeling changes."
            ],
            dueDescription: "Before Session 7"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "CAT Session 6: Common Thinking Distortions\n\nConcept: Labeling cognitive distortions.\n\nParticipant Progress:\nParticipant identified common distortions: [Yes/No].\nDominant distortion identified: [Insert Distortion].\n\nFacilitator Notes:\n[Insert Notes]"
    },
    {
        id: "cat-program-session-7",
        programId: "cat-program",
        sessionNumber: 7,
        title: "Criminal and Addictive Thinking Patterns",
        purpose: "Explore deeper character patterns (mollification, entitlement, power orientation) that drive lifestyle choices.",
        objectives: [
            "Define 'Thinking Pattern' vs 'Distortion'",
            "Identify signs of Entitlement, Victim Stance, and Mollification",
            "Understand how 'Power Orientation' destroys relationships",
            "Identify personal risk patterns"
        ],
        facilitatorPrompts: [
            {
                id: "cat-7-overview",
                section: "overview",
                content: "In Session 6 we looked at distortions (errors in processing). Today we look at PATTERNS (errors in character/lifestyle).\n\nThese are the 'Big Ones' that defined our addiction or criminal lifestyle. They are harder to see because they feel like 'part of who we are'.",
                participantContent: "Distortions are errors in processing.\nPatterns are errors in lifestyle.\n\nThese are the 'Big Ones'.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-7-opening",
                section: "opening",
                content: "Check-in. Review distortion labeling homework.\n\nAsk:\n“What is the difference between making a mistake and having a lifestyle pattern?”",
                participantContent: "What is the difference between making a mistake and having a lifestyle pattern?",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-7-review",
                section: "review",
                content: "Review Accountability vs. Blaming. These patterns are all sophisticated ways to avoid accountability.",
                participantContent: "These patterns are sophisticated ways to avoid accountability.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-7-teach",
                section: "teach",
                content: "Teach 4 Major CAT Patterns:\n\n1. Mollification: Talkinng your way out of things. Making excuses that sound good. \"I was just holding it for a friend.\"\n2. Entitlement: Believing you are special/owed something. \"I don't have to follow the rules.\"\n3. Victim Stance: Poor me. The world is against me. Used to justify retaliation or using.\n4. Power Orientation: Needing to control every situation. Seeing life as 'Weak vs. Strong' instead of right vs wrong.\n\nAsk for examples of each.",
                participantContent: "Major CAT Patterns:\n\n1. Mollification (Simeon-Says, Justifying)\n2. Entitlement (I deserve it / Rules don't apply)\n3. Victim Stance (Poor me)\n4. Power Orientation (Scanning for control / Weak vs Strong)",
                suggestedPacing: "20 min"
            },
            {
                id: "cat-7-activity",
                section: "activity",
                content: "Guide participants to the worksheet: 'My Pattern Checklist'.\n\nInstructions:\nBe honest. Rate how much you related to each pattern in your active addiction/criminal lifestyle (0-10).\n\nThen, pick ONE that is still a risk today.",
                participantContent: "Activity: My Pattern Checklist\n\nRate how much you relate to each pattern.",
                suggestedPacing: "20 min"
            },
            {
                id: "cat-7-responses",
                section: "responses",
                content: "Sharing time. This requires vulnerability.\n\nDiscussion:\n“How did Power Orientation affect your family?”\n“How did Entitlement keep you using?”\n\nReinforce that identifying the pattern is the start of changing it.",
                participantContent: "Discussion:\nHow did these patterns serve you in the past? What did they cost you?",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-7-notes",
                section: "notes",
                content: "Facilitator Note:\nPower Orientation is often the hardest to admit. It looks like bullying or manipulation. Frame it as a survival skill that is no longer working.",
                participantContent: "These were survival skills. Now they are barriers.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-7-caseworx",
                section: "caseworx",
                content: "Document session notes. Determine if participant shows insight into their specific patterns.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-7-wrapup",
                section: "wrapup",
                content: "Close the session.\n\n“These patterns don't disappear overnight. But now you know their names. When you feel Entitlement creep in, you can say 'No, I am not special, I am responsible'.”",
                participantContent: "Homework:\nWatch for your primary pattern this week.",
                suggestedPacing: "5 min"
            }
        ],
        activityTemplates: [
            {
                id: "cat-7-worksheet-1",
                type: "worksheet",
                title: "My Pattern Checklist",
                instructions: "Rate yourself on a scale of 0 (Never) to 10 (Always) for how these defined your past.",
                questions: [
                    { id: "q-cat-7-1", text: "Mollification (Making excuses, smooth talking):", type: "text" },
                    { id: "q-cat-7-2", text: "Entitlement (Feeling owed, rules don't apply):", type: "text" },
                    { id: "q-cat-7-3", text: "Victim Stance (Blaming others, feeling picked on):", type: "text" },
                    { id: "q-cat-7-4", text: "Power Orientation (Needing to be in control, fearing weakness):", type: "text" },
                    { id: "q-cat-7-risk", text: "Which pattern is the biggest risk for you today?", type: "text" }
                ]
            },
            {
                id: "cat-7-scenarios",
                type: "worksheet",
                title: "Pattern Spotting",
                instructions: "Name the pattern in the scenario.",
                questions: [
                    { id: "q-cat-7-scen-1", text: "1. \"I shouldn't have to wait in line like everyone else.\"", type: "text" },
                    { id: "q-cat-7-scen-2", text: "2. \"If I don't dominate this conversation, they will think I'm weak.\"", type: "text" },
                    { id: "q-cat-7-scen-3", text: "3. \"I only sold drugs because society gave me no choice.\"", type: "text" }
                ]
            }
        ],
        homeworkTemplate: {
            id: "cat-7-hw",
            title: "Pattern Watch",
            steps: [
                "Pick one pattern (e.g. Entitlement).",
                "Notice every time it shows up this week.",
                "Journal one example."
            ],
            dueDescription: "Before Session 8"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "CAT Session 7: Criminal and Addictive Thinking Patterns\n\nConcept: Compulsive/Lifestyle patterns (Entitlement, Mollification, etc).\n\nParticipant Progress:\nParticipant rated personal patterns: [Yes/No].\nPrimary pattern identified: [Insert Pattern].\n\nFacilitator Notes:\n[Insert Notes]"
    },
    {
        id: "cat-program-session-8",
        programId: "cat-program",
        sessionNumber: 8,
        title: "Criminal and Addictive Tactics",
        purpose: "Identify behavioral tactics used to avoid accountability, divert attention, or intimidate.",
        objectives: [
            "Define 'Tactics' vs 'Thinking Errors'",
            "Identify common tactics: Diversion, Aggression, Manipulation",
            "Recognize the 'setup' before the tactic",
            "Roleplay 'stopping the tactic' and choosing a better option"
        ],
        facilitatorPrompts: [
            {
                id: "cat-8-overview",
                section: "overview",
                content: "Tactics are the BEHAVIORS we use to cover up our thinking or avoid consequences. If Distortions are the thoughts, Tactics are the moves we make.\n\nExamples: Changing the subject (Diversion), Getting loud (Aggression), Playing the expect (Manipulation).\n\nThe goal is to stop the tactic and face the issue.",
                participantContent: "Tactics are the moves we make to avoid accountability.\n\nThe goal is to stop the tactic and face the issue.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-8-opening",
                section: "opening",
                content: "Check-in. Review Pattern Watch from Session 7.\n\nAsk:\n“When you get caught doing something wrong, what is your first move?”",
                participantContent: "When you get caught doing something wrong, what is your first move?",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-8-review",
                section: "review",
                content: "Review Patterns (Entitlement/Power). Tactics are often how we enforce those patterns.",
                participantContent: "Tactics enforce our patterns.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-8-teach",
                section: "teach",
                content: "Teach Common Tactics:\n\n1. Diversion: Confusion, changing the subject, answering a question with a question.\n2. Aggression: Getting loud, standing up, threatening, attacking the person not the issue.\n3. Manipulation: Playing the victim, seduction, using 'therapy talk' to hide.\n4. Deception: Lying by omission, vagueness.\n\nDiscuss: Why do we use them? (To protect the addiction/lifestyle).",
                participantContent: "Common Tactics:\n\n1. Diversion (Changing the subject)\n2. Aggression (Intimidation)\n3. Manipulation (Playing roles)\n4. Deception (Omission/Vagueness)",
                suggestedPacing: "20 min"
            },
            {
                id: "cat-8-activity",
                section: "activity",
                content: "Guide participants to the worksheet: 'My Tactics and Better Options'.\n\nInstructions:\nCheck off the tactics you have used. Then write a 'Better Option' for each.\n\nExample:\nTactic: Getting loud.\nBetter Option: Taking a breath and saying 'I am feeling defensive'.",
                participantContent: "Activity: My Tactics and Better Options\n\nIdentify your go-to moves.",
                suggestedPacing: "20 min"
            },
            {
                id: "cat-8-responses",
                section: "responses",
                content: "Roleplay (Optional) or Discussion.\n\n“What happens when someone calls you out on a tactic?”\n“How does it feel to drop the tactic and just be real?”",
                participantContent: "Discussion:\nWhat happens when someone calls you out?",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-8-notes",
                section: "notes",
                content: "Facilitator Note:\nTactics defend the ego. Breaking them requires safety. If a participant uses a tactic IN group (e.g. diverting), gently name it. \"That sounds like a diversion. Can we come back to the question?\"",
                participantContent: "Safety allows us to drop the mask.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-8-caseworx",
                section: "caseworx",
                content: "Document session notes. Did participant admit to using tactics?",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-8-wrapup",
                section: "wrapup",
                content: "Close the session.\n\n“Next time you feel the urge to change the subject or get loud, stop. Ask yourself: What am I trying to hide?”",
                participantContent: "Homework:\nCatch yourself using a tactic.",
                suggestedPacing: "5 min"
            }
        ],
        activityTemplates: [
            {
                id: "cat-8-worksheet-1",
                type: "worksheet",
                title: "My Tactics and Better Options",
                instructions: "Check the tactics you use. Write a better option for each.",
                questions: [
                    { id: "q-cat-8-1", text: "Diversion (Changing subject, confusion):", type: "text" },
                    { id: "q-cat-8-2", text: "Aggression (Loudness, threats, staring down):", type: "text" },
                    { id: "q-cat-8-3", text: "Manipulation (Therapy talk, victim role):", type: "text" },
                    { id: "q-cat-8-4", text: "Deception (Lying, leaving out details):", type: "text" },
                    { id: "q-cat-8-better", text: "Choose one tactic. What is a Better Option?", type: "text" }
                ]
            },
            {
                id: "cat-8-scenarios",
                type: "worksheet",
                title: "Tactic Spotting",
                instructions: "Name the tactic in the scenario.",
                questions: [
                    { id: "q-cat-8-scen-1", text: "1. PO asks about a positive drug screen. Participant says: \"Why are you always picking on me?\"", type: "text" },
                    { id: "q-cat-8-scen-2", text: "2. Counselor asks a question. Participant starts talking about football.", type: "text" },
                    { id: "q-cat-8-scen-3", text: "3. Participant says, \"I know I messed up, I'm such a loser, nothing ever works\" (looking for pity).", type: "text" }
                ]
            }
        ],
        homeworkTemplate: {
            id: "cat-8-hw",
            title: "Stop the Tactic",
            steps: [
                "Notice when you use a tactic.",
                "Stop mid-sentence if you can.",
                "Admit it: \"I was just trying to distract you.\""
            ],
            dueDescription: "Before Session 9"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "CAT Session 8: Criminal and Addictive Tactics\n\nConcept: Behavioral tactics (Diversion, Aggression, etc).\n\nParticipant Progress:\nParticipant identified personal tactics: [Yes/No].\nPrimary tactic identified: [Insert Tactic].\n\nFacilitator Notes:\n[Insert Notes]"
    },
    {
        id: "cat-program-session-9",
        programId: "cat-program",
        sessionNumber: 9,
        title: "Practicing Full Thinking Reports",
        purpose: "Apply the full S-T-F-B-C model to real life situations. Demonstrate proficiency in the CAT model.",
        objectives: [
            "Complete a full Thinking Report independently",
            "Identify the distortions and patterns in the report",
            "Rewrite the thought/behavior for a better outcome",
            "Graduation/Completion review"
        ],
        facilitatorPrompts: [
            {
                id: "cat-9-overview",
                section: "overview",
                content: "This is the final session of CAT. We bring it all together.\n\nThinking Report + Distortions + Patterns + Tactics.\n\nThe goal is to show that you can separate the Facts from the Thoughts, catch the Errors, and choose a new Behavior.",
                participantContent: "Putting it all together.\n\nFacts -> Thoughts -> Behavior.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-9-opening",
                section: "opening",
                content: "Check-in. Review Tactic Stopping homework.\n\nAsk:\n“Does the CAT model make sense to you now? How has it changed how you see your choices?”",
                participantContent: "How has CAT changed how you see your choices?",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-9-review",
                section: "review",
                content: "Quick review of the 3 pillars:\n1. Camera Check (Facts vs Thoughts)\n2. Distortions (The errors)\n3. Patterns (The lifestyle)\n\nAll of them lead to the Thinking Report.",
                participantContent: "1. Camera Check\n2. Distortions\n3. Patterns",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-9-teach",
                section: "teach",
                content: "No new new teaching. Focus on Application.\n\nReview the 'Intervention' point in a Thinking Report.\nWe can intervene at the Thought (Accountability knowing).\nWe can intervene at the Behavior (Stop the tactic).\n\nThe goal is not to be perfect. The goal is to be AWARE.",
                participantContent: "The goal is not to be perfect. The goal is to be AWARE.",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-9-activity",
                section: "activity",
                content: "Guide participants to the worksheet: 'Full Thinking Report'.\n\nInstructions:\nPick one significant event from this week. Complete the full report.\nThen, underneath, Lable the Distortion and the Pattern.\nFinally, write a 'New Thought' that would have led to a better outcome.",
                participantContent: "Activity: Full Thinking Report\n\nProve your skills.",
                suggestedPacing: "30 min"
            },
            {
                id: "cat-9-responses",
                section: "responses",
                content: "Review a few reports.\nCelebrate the insights.\n\n\"Look how far you've come from Session 1 where we blamed everyone else.\"",
                participantContent: "Look how far you've come.",
                suggestedPacing: "10 min"
            },
            {
                id: "cat-9-notes",
                section: "notes",
                content: "Facilitator Note:\nThis is a graduation session. Emphasize progress. Hand out certificates if applicable (or mark completion in app).",
                participantContent: "Congratulations on completing CAT.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-9-caseworx",
                section: "caseworx",
                content: "Document completion. Note proficiency level.",
                suggestedPacing: "5 min"
            },
            {
                id: "cat-9-wrapup",
                section: "wrapup",
                content: "Close the program.\n\n“You have the tools. The rest is practice. Keep doing Thinking Reports.”",
                participantContent: "You have the tools. Keep practicing.",
                suggestedPacing: "5 min"
            }
        ],
        activityTemplates: [
            {
                id: "cat-9-worksheet-1",
                type: "worksheet",
                title: "Full Thinking Report",
                instructions: "Complete the full report for a recent event.",
                questions: [
                    { id: "q-cat-9-sit", text: "Situation (Fact):", type: "text" },
                    { id: "q-cat-9-th", text: "Thought (The Glitch):", type: "text" },
                    { id: "q-cat-9-feel", text: "Feeling (Emotion):", type: "text" },
                    { id: "q-cat-9-beh", text: "Behavior (Action/Tactic):", type: "text" },
                    { id: "q-cat-9-cons", text: "Consequence:", type: "text" },
                    { id: "q-cat-9-dist", text: "Label the Distortion/Pattern:", type: "text" },
                    { id: "q-cat-9-new", text: "New Thought (Accountability):", type: "text" },
                    { id: "q-cat-9-new-beh", text: "New Behavior (Result):", type: "text" }
                ]
            }
        ],
        homeworkTemplate: {
            id: "cat-9-hw",
            title: "Maintenance",
            steps: [
                "Run a Thinking Report whenever you get stuck.",
                "Review your patterns monthly."
            ],
            dueDescription: "Ongoing"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "CAT Session 9: Practicing Full Thinking Reports\n\nConcept: Full Application.\n\nParticipant Progress:\nParticipant completed full report: [Yes/No].\nProficiency demonstrated: [Yes/No].\n\nFacilitator Notes:\n[Insert Notes]"
    },
];

export const codaSessions: Session[] = [
    {
        id: "coda-program-session-1",
        programId: "coda",
        sessionNumber: 1,
        title: "Understanding Codependency (Definition & Cycle)",
        purpose: "CODA Session 1",
        objectives: [ "Identify codependent patterns", "Practice detachment" ],
        facilitatorPrompts: [
            {
                id: "coda-1-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
Codependency is a learned behavioral pattern where self-worth and emotional stability depend on controlling, fixing, or rescuing others. This session introduces codependency as a cycle similar to addiction and emphasizes awareness over guilt.

## FACILITATOR — OPENING (5 min)
Discussion prompts:
- What do you think codependency means?
- How does trying to control or fix others affect you?
- Where do you notice anxiety when others struggle?

## FACILITATOR — REVIEW (10 min)
Codependency is not a personality trait but a behavioral pattern. The cycle often begins with anxiety or pain and leads to control, temporary relief, resentment, and guilt.

## FACILITATOR — TEACH (20 min)
Teach the codependency cycle:
Pain/Anxiety → Control/Caretaking → Temporary Relief → Resentment/Exhaustion → Guilt → More Control.
Emphasize the shift from control to connection and from fear to self-respect.

## FACILITATOR — ACTIVITY (15 min)
Worksheet: Identifying the Codependency Cycle.

## FACILITATOR — RESPONSES
Participants share one place they recognize the cycle.

## FACILITATOR — NOTES
Avoid shaming. Reinforce awareness and self-responsibility.

## FACILITATOR — CASEWORX GUIDANCE
Document understanding of codependency definition and cycle.

## FACILITATOR — WRAP-UP (5 min)
Notice one moment this week where anxiety pushes you toward control.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "coda-1-hw",
             title: "Homework",
             steps: ["Review codependency patterns"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Understanding Codependency (Definition & Cycle) - Session 1\n\nNotes:"
    },
    {
        id: "coda-program-session-2",
        programId: "coda",
        sessionNumber: 2,
        title: "The Fixer Role and Illusion of Control",
        purpose: "CODA Session 2",
        objectives: [ "Identify codependent patterns", "Practice detachment" ],
        facilitatorPrompts: [
            {
                id: "coda-2-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
This session examines the compulsive need to fix or rescue others and the illusion of control that drives it.

## FACILITATOR — OPENING (5 min)
Discussion prompts:
- When do you feel responsible for others?
- What happens when you stop fixing?

## FACILITATOR — REVIEW (10 min)
Review how fixing creates dependency and self-neglect.

## FACILITATOR — TEACH (20 min)
Clarify real control (your choices) versus illusion of control (managing others). Discuss burnout and resentment.

## FACILITATOR — ACTIVITY (15 min)
Worksheet: What Happens When I Stop Fixing?

## FACILITATOR — RESPONSES
Participants share fears or insights.

## FACILITATOR — NOTES
Reinforce redirecting energy toward self-care.

## FACILITATOR — CASEWORX GUIDANCE
Document recognition of fixer patterns.

## FACILITATOR — WRAP-UP (5 min)
Practice letting others handle one responsibility this week.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "coda-2-hw",
             title: "Homework",
             steps: ["Review codependency patterns"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "The Fixer Role and Illusion of Control - Session 2\n\nNotes:"
    },
    {
        id: "coda-program-session-3",
        programId: "coda",
        sessionNumber: 3,
        title: "Low Self-Worth and External Validation",
        purpose: "CODA Session 3",
        objectives: [ "Identify codependent patterns", "Practice detachment" ],
        facilitatorPrompts: [
            {
                id: "coda-3-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
Low self-worth drives people-pleasing and overhelping through external validation.

## FACILITATOR — OPENING (5 min)
Discussion prompts:
- Where do you seek approval?
- What makes you feel valuable?

## FACILITATOR — REVIEW (10 min)
External validation provides short-term relief but reinforces insecurity.

## FACILITATOR — TEACH (20 min)
Identify beliefs like “I matter when I’m useful.” Introduce internal validation skills.

## FACILITATOR — ACTIVITY (15 min)
Worksheet: Shifting from External to Internal Validation.

## FACILITATOR — RESPONSES
Share one validation source and a healthier alternative.

## FACILITATOR — NOTES
Focus on self-worth building, not perfection.

## FACILITATOR — CASEWORX GUIDANCE
Document insight into validation patterns.

## FACILITATOR — WRAP-UP (5 min)
Practice one internal validation skill this week.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "coda-3-hw",
             title: "Homework",
             steps: ["Review codependency patterns"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Low Self-Worth and External Validation - Session 3\n\nNotes:"
    },
    {
        id: "coda-program-session-4",
        programId: "coda",
        sessionNumber: 4,
        title: "Fear of Abandonment and Rejection",
        purpose: "CODA Session 4",
        objectives: [ "Identify codependent patterns", "Practice detachment" ],
        facilitatorPrompts: [
            {
                id: "coda-4-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
Fear of abandonment drives control and people-pleasing behaviors.

## FACILITATOR — OPENING (5 min)
Discussion prompts:
- What do you fear losing?
- How does fear affect your choices?

## FACILITATOR — REVIEW (10 min)
Fear-based behavior leads to self-neglect.

## FACILITATOR — TEACH (20 min)
Discuss attachment wounds and building security through self-trust.

## FACILITATOR — ACTIVITY (15 min)
Worksheet: Fear-Based Choices vs Healthy Responses.

## FACILITATOR — RESPONSES
Participants identify fear-driven behaviors.

## FACILITATOR — NOTES
Reinforce boundaries as safety.

## FACILITATOR — CASEWORX GUIDANCE
Document fear-awareness and boundary planning.

## FACILITATOR — WRAP-UP (5 min)
Use one boundary when fear shows up.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "coda-4-hw",
             title: "Homework",
             steps: ["Review codependency patterns"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Fear of Abandonment and Rejection - Session 4\n\nNotes:"
    },
    {
        id: "coda-program-session-5",
        programId: "coda",
        sessionNumber: 5,
        title: "Boundaries and Emotional Fusion",
        purpose: "CODA Session 5",
        objectives: [ "Identify codependent patterns", "Practice detachment" ],
        facilitatorPrompts: [
            {
                id: "coda-5-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
Boundaries protect identity and reduce resentment.

## FACILITATOR — OPENING (5 min)
Discussion prompts:
- Where do boundaries feel hardest?
- What happens when you don’t set them?

## FACILITATOR — REVIEW (10 min)
Emotional fusion blurs responsibility.

## FACILITATOR — TEACH (20 min)
Teach types of boundaries and reframe boundaries as self-respect.

## FACILITATOR — ACTIVITY (15 min)
Worksheet: Identifying and Setting Boundaries.

## FACILITATOR — RESPONSES
Share one boundary you need.

## FACILITATOR — NOTES
Normalize guilt when setting boundaries.

## FACILITATOR — CASEWORX GUIDANCE
Document boundary insight and plans.

## FACILITATOR — WRAP-UP (5 min)
Practice one small boundary this week.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "coda-5-hw",
             title: "Homework",
             steps: ["Review codependency patterns"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Boundaries and Emotional Fusion - Session 5\n\nNotes:"
    },
    {
        id: "coda-program-session-6",
        programId: "coda",
        sessionNumber: 6,
        title: "Enabling vs Supporting",
        purpose: "CODA Session 6",
        objectives: [ "Identify codependent patterns", "Practice detachment" ],
        facilitatorPrompts: [
            {
                id: "coda-6-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
This session clarifies the difference between enabling and supporting.

## FACILITATOR — OPENING (5 min)
Discussion prompts:
- When does helping become harmful?
- What does real support look like?

## FACILITATOR — REVIEW (10 min)
Enabling removes responsibility; supporting preserves it.

## FACILITATOR — TEACH (20 min)
Discuss consequences, accountability, and healthy support.

## FACILITATOR — ACTIVITY (15 min)
Worksheet: Enabling vs Supporting Scenarios.

## FACILITATOR — RESPONSES
Participants identify healthier responses.

## FACILITATOR — NOTES
Reinforce allowing natural consequences.

## FACILITATOR — CASEWORX GUIDANCE
Document understanding of enabling vs supporting.

## FACILITATOR — WRAP-UP (5 min)
Practice supporting without rescuing.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "coda-6-hw",
             title: "Homework",
             steps: ["Review codependency patterns"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Enabling vs Supporting - Session 6\n\nNotes:"
    },
    {
        id: "coda-program-session-7",
        programId: "coda",
        sessionNumber: 7,
        title: "Caretaking–Resentment Cycle",
        purpose: "CODA Session 7",
        objectives: [ "Identify codependent patterns", "Practice detachment" ],
        facilitatorPrompts: [
            {
                id: "coda-7-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
Overgiving leads to resentment and burnout.

## FACILITATOR — OPENING (5 min)
Discussion prompts:
- Where do you overgive?
- What resentment builds?

## FACILITATOR — REVIEW (10 min)
Resentment signals missing boundaries.

## FACILITATOR — TEACH (20 min)
Teach difference between helping and caretaking.

## FACILITATOR — ACTIVITY (15 min)
Worksheet: Saying No When You Want To.

## FACILITATOR — RESPONSES
Share insights about resentment.

## FACILITATOR — NOTES
Normalize resentment as information.

## FACILITATOR — CASEWORX GUIDANCE
Document recognition of caretaking patterns.

## FACILITATOR — WRAP-UP (5 min)
Replace one “yes” with a healthy “no.”`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "coda-7-hw",
             title: "Homework",
             steps: ["Review codependency patterns"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Caretaking–Resentment Cycle - Session 7\n\nNotes:"
    },
    {
        id: "coda-program-session-8",
        programId: "coda",
        sessionNumber: 8,
        title: "Dependency Shifts in Recovery",
        purpose: "CODA Session 8",
        objectives: [ "Identify codependent patterns", "Practice detachment" ],
        facilitatorPrompts: [
            {
                id: "coda-8-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
Dependency can shift from substances to people or routines.

## FACILITATOR — OPENING (5 min)
Discussion prompts:
- Where has dependency shifted?
- What feels like emotional reliance?

## FACILITATOR — REVIEW (10 min)
Healthy support vs unhealthy attachment.

## FACILITATOR — TEACH (20 min)
Teach emotional independence without isolation.

## FACILITATOR — ACTIVITY (15 min)
Worksheet: Identifying Dependency Shifts.

## FACILITATOR — RESPONSES
Participants share one shift noticed.

## FACILITATOR — NOTES
Reinforce balance between support and autonomy.

## FACILITATOR — CASEWORX GUIDANCE
Document insight into dependency shifts.

## FACILITATOR — WRAP-UP (5 min)
Practice self-regulation before reaching out.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "coda-8-hw",
             title: "Homework",
             steps: ["Review codependency patterns"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Dependency Shifts in Recovery - Session 8\n\nNotes:"
    },
    {
        id: "coda-program-session-9",
        programId: "coda",
        sessionNumber: 9,
        title: "Assertiveness and Saying “No”",
        purpose: "CODA Session 9",
        objectives: [ "Identify codependent patterns", "Practice detachment" ],
        facilitatorPrompts: [
            {
                id: "coda-9-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
Assertiveness allows honesty without aggression.

## FACILITATOR — OPENING (5 min)
Discussion prompts:
- When is it hard to say no?
- What happens when you don’t?

## FACILITATOR — REVIEW (10 min)
Fear and guilt block assertiveness.

## FACILITATOR — TEACH (20 min)
Teach I-statements, clear requests, and boundary language.

## FACILITATOR — ACTIVITY (15 min)
Worksheet: Practicing Assertive Statements.

## FACILITATOR — RESPONSES
Share one assertive phrase.

## FACILITATOR — NOTES
Reinforce assertiveness as self-respect.

## FACILITATOR — CASEWORX GUIDANCE
Document assertive skill use.

## FACILITATOR — WRAP-UP (5 min)
Use assertiveness once this week.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "coda-9-hw",
             title: "Homework",
             steps: ["Review codependency patterns"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Assertiveness and Saying “No” - Session 9\n\nNotes:"
    },
    {
        id: "coda-program-session-10",
        programId: "coda",
        sessionNumber: 10,
        title: "Healthy Interdependence",
        purpose: "CODA Session 10",
        objectives: [ "Identify codependent patterns", "Practice detachment" ],
        facilitatorPrompts: [
            {
                id: "coda-10-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
Healthy interdependence balances support and autonomy.

## FACILITATOR — OPENING (5 min)
Discussion prompts:
- What does a healthy relationship look like?
- Where is balance needed?

## FACILITATOR — REVIEW (10 min)
Avoid extremes of isolation and enmeshment.

## FACILITATOR — TEACH (20 min)
Review boundaries, assertiveness, support, and self-worth.

## FACILITATOR — ACTIVITY (15 min)
Worksheet: Personal Growth Plan.

## FACILITATOR — RESPONSES
Participants share one growth goal.

## FACILITATOR — NOTES
Emphasize continued practice.

## FACILITATOR — CASEWORX GUIDANCE
Document completion of growth plan.

## FACILITATOR — WRAP-UP (5 min)
Continue practicing skills beyond group.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "coda-10-hw",
             title: "Homework",
             steps: ["Review codependency patterns"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Healthy Interdependence - Session 10\n\nNotes:"
    },
];


export const relapsePreventionSessions: Session[] = [
    {
        id: "rp-program-session-1",
        programId: "relapse-prevention",
        sessionNumber: 1,
        title: "Introduction to Relapse Prevention",
        purpose: "Relapse Prevention Session 1",
        objectives: [ "Understand session topics", "Identify personal relevance" ],
        facilitatorPrompts: [
            {
                id: "rp-1-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
Relapse prevention is a skill-building process that supports long-term recovery. Relapse is often a process that begins before substance use through changes in thinking, mood, and behavior. This session introduces early warning signs and Seemingly Unimportant Decisions (SUDs).

## FACILITATOR — OPENING (5 min)
Relapse prevention focuses on recognizing risk early and responding before escalation.
Discussion prompts:
- What does relapse prevention mean?
- Does relapse start before using?
- What small choices quietly increase risk?

## FACILITATOR — REVIEW (10 min)
Relapse is a process. Early changes in routine, thinking, and behavior matter.
SUDs are small decisions that quietly raise risk.

## FACILITATOR — TEACH (20 min)
- Relapse prevention = recognizing warning signs and acting early.
- Warning signs:
  - Thoughts: “I’m fine,” “I can handle it.”
  - Mood: irritability, restlessness, overwhelm.
  - Behavior: isolation, skipped supports, dishonesty.
- SUD examples: skipping calls, driving past old spots, isolating.
Early action beats late intensity.

## FACILITATOR — ACTIVITY (15 min)
Worksheet: Warning Signs and SUDs.

## FACILITATOR — RESPONSES
Share one warning sign and one early action.

## FACILITATOR — NOTES
Redirect “relapse just happens” to process awareness.

## FACILITATOR — CASEWORX GUIDANCE
Document warning signs, SUDs, and early action steps.

## FACILITATOR — WRAP-UP (5 min)
Notice one warning sign or SUD this week and respond early.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "rp-1-hw",
             title: "Homework",
             steps: ["Review session materials"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Introduction to Relapse Prevention - Session 1\n\nNotes:"
    },
    {
        id: "rp-program-session-2",
        programId: "relapse-prevention",
        sessionNumber: 2,
        title: "Maintaining a Balanced Lifestyle",
        purpose: "Relapse Prevention Session 2",
        objectives: [ "Understand session topics", "Identify personal relevance" ],
        facilitatorPrompts: [
            {
                id: "rp-2-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
Lifestyle balance reduces relapse risk. Imbalance increases stress and vulnerability.

## FACILITATOR — OPENING (5 min)
Discussion prompts:
- What happens when life feels out of balance?
- How do boredom and loneliness affect decisions?

## FACILITATOR — REVIEW (10 min)
Lifestyle imbalance is an early warning sign.

## FACILITATOR — TEACH (20 min)
- Wellness domains: physical, emotional, social, spiritual, work/school, recreation.
- Boredom and loneliness increase impulsivity.
- Small, consistent changes reduce risk.

## FACILITATOR — ACTIVITY (15 min)
Worksheet: Wellness Wheel and Balance Plan.

## FACILITATOR — RESPONSES
Share one area to improve and one action step.

## FACILITATOR — NOTES
Coach toward small, controllable steps.

## FACILITATOR — CASEWORX GUIDANCE
Document balance areas and action planning.

## FACILITATOR — WRAP-UP (5 min)
Follow through on one balance step this week.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "rp-2-hw",
             title: "Homework",
             steps: ["Review session materials"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Maintaining a Balanced Lifestyle - Session 2\n\nNotes:"
    },
    {
        id: "rp-program-session-3",
        programId: "relapse-prevention",
        sessionNumber: 3,
        title: "Identifying External Triggers",
        purpose: "Relapse Prevention Session 3",
        objectives: [ "Understand session topics", "Identify personal relevance" ],
        facilitatorPrompts: [
            {
                id: "rp-3-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
External triggers include people, places, situations, and environments linked to past use.

## FACILITATOR — OPENING (5 min)
Discussion prompts:
- Which people or places raise risk?
- What is the difference between avoidance and planning?

## FACILITATOR — REVIEW (10 min)
External triggers are stronger when routine is weak.

## FACILITATOR — TEACH (20 min)
- Strategies: avoid high-risk settings, change routines, use support early, plan exits.
- Safety over proving control.

## FACILITATOR — ACTIVITY (15 min)
Worksheet: External Trigger Map.

## FACILITATOR — RESPONSES
Share one trigger and one plan step.

## FACILITATOR — NOTES
Reframe avoidance as responsibility.

## FACILITATOR — CASEWORX GUIDANCE
Document triggers and planning steps.

## FACILITATOR — WRAP-UP (5 min)
Practice one trigger-management step this week.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "rp-3-hw",
             title: "Homework",
             steps: ["Review session materials"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Identifying External Triggers - Session 3\n\nNotes:"
    },
    {
        id: "rp-program-session-4",
        programId: "relapse-prevention",
        sessionNumber: 4,
        title: "Identifying Internal Triggers",
        purpose: "Relapse Prevention Session 4",
        objectives: [ "Understand session topics", "Identify personal relevance" ],
        facilitatorPrompts: [
            {
                id: "rp-4-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
Internal triggers include emotions, thoughts, and physical states that increase relapse vulnerability.

## FACILITATOR — OPENING (5 min)
Discussion prompts:
- Which feelings raise cravings?
- Why does timing matter with coping?

## FACILITATOR — REVIEW (10 min)
Internal triggers build quietly; early recognition helps.

## FACILITATOR — TEACH (20 min)
- Common triggers: stress, anger, loneliness, boredom, guilt, anxiety, fatigue.
- Coping: grounding, pausing, journaling, support, routine basics.
- Use skills early.

## FACILITATOR — ACTIVITY (15 min)
Worksheet: Internal Trigger and Coping Plan.

## FACILITATOR — RESPONSES
Share one trigger and one coping tool.

## FACILITATOR — NOTES
Redirect “coping doesn’t work” to timing.

## FACILITATOR — CASEWORX GUIDANCE
Document triggers and coping strategies.

## FACILITATOR — WRAP-UP (5 min)
Practice one coping skill early this week.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "rp-4-hw",
             title: "Homework",
             steps: ["Review session materials"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Identifying Internal Triggers - Session 4\n\nNotes:"
    },
    {
        id: "rp-program-session-5",
        programId: "relapse-prevention",
        sessionNumber: 5,
        title: "Coping with Cravings",
        purpose: "Relapse Prevention Session 5",
        objectives: [ "Understand session topics", "Identify personal relevance" ],
        facilitatorPrompts: [
            {
                id: "rp-5-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
Cravings are time-limited urges that can be managed without using.

## FACILITATOR — OPENING (5 min)
Discussion prompts:
- What do cravings feel like?
- What makes them worse or better?

## FACILITATOR — REVIEW (10 min)
Coping works best early.

## FACILITATOR — TEACH (20 min)
- Cravings rise and fall like a wave.
- Tools: delay, distract, ground, contact support, routine basics.

## FACILITATOR — ACTIVITY (15 min)
Worksheet: Craving Coping Plan.

## FACILITATOR — RESPONSES
Share one coping tool.

## FACILITATOR — NOTES
Coach toward simple early actions.

## FACILITATOR — CASEWORX GUIDANCE
Document cues, coping tools, and plans.

## FACILITATOR — WRAP-UP (5 min)
Practice a 10–20 minute coping plan.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "rp-5-hw",
             title: "Homework",
             steps: ["Review session materials"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Coping with Cravings - Session 5\n\nNotes:"
    },
    {
        id: "rp-program-session-6",
        programId: "relapse-prevention",
        sessionNumber: 6,
        title: "High-Risk Situations and Having a Plan",
        purpose: "Relapse Prevention Session 6",
        objectives: [ "Understand session topics", "Identify personal relevance" ],
        facilitatorPrompts: [
            {
                id: "rp-6-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
High-risk situations require planning to reduce impulsive decisions.

## FACILITATOR — OPENING (5 min)
Discussion prompts:
- What situations raise risk fastest?
- What does planning look like?

## FACILITATOR — REVIEW (10 min)
Planning reduces last-minute decisions.

## FACILITATOR — TEACH (20 min)
- Plans include exit, transportation, boundaries, support check-ins, coping tools.

## FACILITATOR — ACTIVITY (15 min)
Worksheet: High-Risk Situation Plan.

## FACILITATOR — RESPONSES
Share one plan step.

## FACILITATOR — NOTES
Plans must be specific and realistic.

## FACILITATOR — CASEWORX GUIDANCE
Document planning steps.

## FACILITATOR — WRAP-UP (5 min)
Plan for one upcoming high-risk situation.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "rp-6-hw",
             title: "Homework",
             steps: ["Review session materials"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "High-Risk Situations and Having a Plan - Session 6\n\nNotes:"
    },
    {
        id: "rp-program-session-7",
        programId: "relapse-prevention",
        sessionNumber: 7,
        title: "Developing a Support Network",
        purpose: "Relapse Prevention Session 7",
        objectives: [ "Understand session topics", "Identify personal relevance" ],
        facilitatorPrompts: [
            {
                id: "rp-7-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
Support reduces isolation and strengthens accountability.

## FACILITATOR — OPENING (5 min)
Discussion prompts:
- Who do you contact when struggling?
- What stops people from reaching out?

## FACILITATOR — REVIEW (10 min)
Support makes planning realistic.

## FACILITATOR — TEACH (20 min)
- Supports include peers, sponsor, therapist, spiritual support, family, court/program staff.
- Use support early and honestly.

## FACILITATOR — ACTIVITY (15 min)
Worksheet: Support Network Map.

## FACILITATOR — RESPONSES
Share one support action.

## FACILITATOR — NOTES
Support is a strategy, not a weakness.

## FACILITATOR — CASEWORX GUIDANCE
Document support identification and actions.

## FACILITATOR — WRAP-UP (5 min)
Use support intentionally this week.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "rp-7-hw",
             title: "Homework",
             steps: ["Review session materials"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Developing a Support Network - Session 7\n\nNotes:"
    },
    {
        id: "rp-program-session-8",
        programId: "relapse-prevention",
        sessionNumber: 8,
        title: "Creating a Relapse Prevention Plan",
        purpose: "Relapse Prevention Session 8",
        objectives: [ "Understand session topics", "Identify personal relevance" ],
        facilitatorPrompts: [
            {
                id: "rp-8-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
Participants build or update a personal relapse prevention plan.

## FACILITATOR — OPENING (5 min)
Discussion prompts:
- What makes a plan work?
- Why does early action matter?

## FACILITATOR — REVIEW (10 min)
Combine warning signs, triggers, coping, planning, and support.

## FACILITATOR — TEACH (20 min)
Plan components: triggers, warning signs, coping tools, supports, avoid/limit areas, replacement routines.

## FACILITATOR — ACTIVITY (15 min)
Worksheet: Relapse Prevention Plan.

## FACILITATOR — RESPONSES
Share one plan element.

## FACILITATOR — NOTES
Coach toward specificity.

## FACILITATOR — CASEWORX GUIDANCE
Document plan completion and components.

## FACILITATOR — WRAP-UP (5 min)
Review and use one plan step this week.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "rp-8-hw",
             title: "Homework",
             steps: ["Review session materials"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Creating a Relapse Prevention Plan - Session 8\n\nNotes:"
    },
    {
        id: "rp-program-session-9",
        programId: "relapse-prevention",
        sessionNumber: 9,
        title: "Creating an Emergency Plan for Relapse or Major Setbacks",
        purpose: "Relapse Prevention Session 9",
        objectives: [ "Understand session topics", "Identify personal relevance" ],
        facilitatorPrompts: [
            {
                id: "rp-9-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
Emergency planning reduces harm and shortens setbacks.

## FACILITATOR — OPENING (5 min)
Discussion prompts:
- What should happen immediately after a setback?

## FACILITATOR — REVIEW (10 min)
Emergency plans differ from prevention plans.

## FACILITATOR — TEACH (20 min)
- Steps: stop the slide, get safe, contact support, be honest, re-engage structure.
- Include major life setbacks.

## FACILITATOR — ACTIVITY (15 min)
Worksheet: Emergency Plan.

## FACILITATOR — RESPONSES
Share one emergency step.

## FACILITATOR — NOTES
Planning reduces harm; it does not cause relapse.

## FACILITATOR — CASEWORX GUIDANCE
Document emergency planning and re-engagement steps.

## FACILITATOR — WRAP-UP (5 min)
Keep the emergency plan accessible and review it regularly.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "rp-9-hw",
             title: "Homework",
             steps: ["Review session materials"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Creating an Emergency Plan for Relapse or Major Setbacks - Session 9\n\nNotes:"
    },
];


export const angerManagementSessions: Session[] = [
    {
        id: "am-program-session-1",
        programId: "anger-management",
        sessionNumber: 1,
        title: "Anger Management – Chapter 1",
        purpose: "Anger Management Session 1",
        objectives: [ "Understand anger triggers", "Practice regulation skills" ],
        facilitatorPrompts: [
            {
                id: "am-1-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
This session focuses on anger management concepts from Chapter 1. Participants increase awareness of triggers, escalation patterns, and practical skills to manage anger safely and responsibly.

## FACILITATOR — OPENING (5 min)
Brief check-in and orientation to Session 1. Participants reflect on recent situations where anger showed up.

## FACILITATOR — REVIEW (10 min)
Review of prior anger management skills and how they apply to current challenges.

## FACILITATOR — TEACH (20 min)
Key teaching points from Chapter 1, including self-awareness, emotional regulation, communication strategies, and decision-making skills.

## FACILITATOR — ACTIVITY (15 min)
Participants complete an in-session worksheet aligned with Chapter 1, identifying triggers, escalation cues, and coping tools.

## FACILITATOR — RESPONSES
Group discussion of insights and real-life application.

## FACILITATOR — NOTES
Reinforce that anger is a normal emotion; the goal is managing responses, not eliminating anger.

## FACILITATOR — CASEWORX GUIDANCE
Document participation, insight, and use of anger management skills.

## FACILITATOR — WRAP-UP (5 min)
Summarize key takeaways and encourage practice of one anger management skill before the next session.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "am-1-hw",
             title: "Homework",
             steps: ["Practice regulation skills"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Anger Management – Chapter 1 - Session 1\n\nNotes:"
    },
    {
        id: "am-program-session-2",
        programId: "anger-management",
        sessionNumber: 2,
        title: "Anger Management – Chapter 2",
        purpose: "Anger Management Session 2",
        objectives: [ "Understand anger triggers", "Practice regulation skills" ],
        facilitatorPrompts: [
            {
                id: "am-2-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
This session focuses on anger management concepts from Chapter 2. Participants increase awareness of triggers, escalation patterns, and practical skills to manage anger safely and responsibly.

## FACILITATOR — OPENING (5 min)
Brief check-in and orientation to Session 2. Participants reflect on recent situations where anger showed up.

## FACILITATOR — REVIEW (10 min)
Review of prior anger management skills and how they apply to current challenges.

## FACILITATOR — TEACH (20 min)
Key teaching points from Chapter 2, including self-awareness, emotional regulation, communication strategies, and decision-making skills.

## FACILITATOR — ACTIVITY (15 min)
Participants complete an in-session worksheet aligned with Chapter 2, identifying triggers, escalation cues, and coping tools.

## FACILITATOR — RESPONSES
Group discussion of insights and real-life application.

## FACILITATOR — NOTES
Reinforce that anger is a normal emotion; the goal is managing responses, not eliminating anger.

## FACILITATOR — CASEWORX GUIDANCE
Document participation, insight, and use of anger management skills.

## FACILITATOR — WRAP-UP (5 min)
Summarize key takeaways and encourage practice of one anger management skill before the next session.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "am-2-hw",
             title: "Homework",
             steps: ["Practice regulation skills"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Anger Management – Chapter 2 - Session 2\n\nNotes:"
    },
    {
        id: "am-program-session-3",
        programId: "anger-management",
        sessionNumber: 3,
        title: "Anger Management – Chapter 3",
        purpose: "Anger Management Session 3",
        objectives: [ "Understand anger triggers", "Practice regulation skills" ],
        facilitatorPrompts: [
            {
                id: "am-3-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
This session focuses on anger management concepts from Chapter 3. Participants increase awareness of triggers, escalation patterns, and practical skills to manage anger safely and responsibly.

## FACILITATOR — OPENING (5 min)
Brief check-in and orientation to Session 3. Participants reflect on recent situations where anger showed up.

## FACILITATOR — REVIEW (10 min)
Review of prior anger management skills and how they apply to current challenges.

## FACILITATOR — TEACH (20 min)
Key teaching points from Chapter 3, including self-awareness, emotional regulation, communication strategies, and decision-making skills.

## FACILITATOR — ACTIVITY (15 min)
Participants complete an in-session worksheet aligned with Chapter 3, identifying triggers, escalation cues, and coping tools.

## FACILITATOR — RESPONSES
Group discussion of insights and real-life application.

## FACILITATOR — NOTES
Reinforce that anger is a normal emotion; the goal is managing responses, not eliminating anger.

## FACILITATOR — CASEWORX GUIDANCE
Document participation, insight, and use of anger management skills.

## FACILITATOR — WRAP-UP (5 min)
Summarize key takeaways and encourage practice of one anger management skill before the next session.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "am-3-hw",
             title: "Homework",
             steps: ["Practice regulation skills"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Anger Management – Chapter 3 - Session 3\n\nNotes:"
    },
    {
        id: "am-program-session-4",
        programId: "anger-management",
        sessionNumber: 4,
        title: "Anger Management – Chapter 4",
        purpose: "Anger Management Session 4",
        objectives: [ "Understand anger triggers", "Practice regulation skills" ],
        facilitatorPrompts: [
            {
                id: "am-4-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
This session focuses on anger management concepts from Chapter 4. Participants increase awareness of triggers, escalation patterns, and practical skills to manage anger safely and responsibly.

## FACILITATOR — OPENING (5 min)
Brief check-in and orientation to Session 4. Participants reflect on recent situations where anger showed up.

## FACILITATOR — REVIEW (10 min)
Review of prior anger management skills and how they apply to current challenges.

## FACILITATOR — TEACH (20 min)
Key teaching points from Chapter 4, including self-awareness, emotional regulation, communication strategies, and decision-making skills.

## FACILITATOR — ACTIVITY (15 min)
Participants complete an in-session worksheet aligned with Chapter 4, identifying triggers, escalation cues, and coping tools.

## FACILITATOR — RESPONSES
Group discussion of insights and real-life application.

## FACILITATOR — NOTES
Reinforce that anger is a normal emotion; the goal is managing responses, not eliminating anger.

## FACILITATOR — CASEWORX GUIDANCE
Document participation, insight, and use of anger management skills.

## FACILITATOR — WRAP-UP (5 min)
Summarize key takeaways and encourage practice of one anger management skill before the next session.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "am-4-hw",
             title: "Homework",
             steps: ["Practice regulation skills"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Anger Management – Chapter 4 - Session 4\n\nNotes:"
    },
    {
        id: "am-program-session-5",
        programId: "anger-management",
        sessionNumber: 5,
        title: "Anger Management – Chapter 5",
        purpose: "Anger Management Session 5",
        objectives: [ "Understand anger triggers", "Practice regulation skills" ],
        facilitatorPrompts: [
            {
                id: "am-5-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
This session focuses on anger management concepts from Chapter 5. Participants increase awareness of triggers, escalation patterns, and practical skills to manage anger safely and responsibly.

## FACILITATOR — OPENING (5 min)
Brief check-in and orientation to Session 5. Participants reflect on recent situations where anger showed up.

## FACILITATOR — REVIEW (10 min)
Review of prior anger management skills and how they apply to current challenges.

## FACILITATOR — TEACH (20 min)
Key teaching points from Chapter 5, including self-awareness, emotional regulation, communication strategies, and decision-making skills.

## FACILITATOR — ACTIVITY (15 min)
Participants complete an in-session worksheet aligned with Chapter 5, identifying triggers, escalation cues, and coping tools.

## FACILITATOR — RESPONSES
Group discussion of insights and real-life application.

## FACILITATOR — NOTES
Reinforce that anger is a normal emotion; the goal is managing responses, not eliminating anger.

## FACILITATOR — CASEWORX GUIDANCE
Document participation, insight, and use of anger management skills.

## FACILITATOR — WRAP-UP (5 min)
Summarize key takeaways and encourage practice of one anger management skill before the next session.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "am-5-hw",
             title: "Homework",
             steps: ["Practice regulation skills"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Anger Management – Chapter 5 - Session 5\n\nNotes:"
    },
    {
        id: "am-program-session-6",
        programId: "anger-management",
        sessionNumber: 6,
        title: "Anger Management – Chapter 6",
        purpose: "Anger Management Session 6",
        objectives: [ "Understand anger triggers", "Practice regulation skills" ],
        facilitatorPrompts: [
            {
                id: "am-6-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
This session focuses on anger management concepts from Chapter 6. Participants increase awareness of triggers, escalation patterns, and practical skills to manage anger safely and responsibly.

## FACILITATOR — OPENING (5 min)
Brief check-in and orientation to Session 6. Participants reflect on recent situations where anger showed up.

## FACILITATOR — REVIEW (10 min)
Review of prior anger management skills and how they apply to current challenges.

## FACILITATOR — TEACH (20 min)
Key teaching points from Chapter 6, including self-awareness, emotional regulation, communication strategies, and decision-making skills.

## FACILITATOR — ACTIVITY (15 min)
Participants complete an in-session worksheet aligned with Chapter 6, identifying triggers, escalation cues, and coping tools.

## FACILITATOR — RESPONSES
Group discussion of insights and real-life application.

## FACILITATOR — NOTES
Reinforce that anger is a normal emotion; the goal is managing responses, not eliminating anger.

## FACILITATOR — CASEWORX GUIDANCE
Document participation, insight, and use of anger management skills.

## FACILITATOR — WRAP-UP (5 min)
Summarize key takeaways and encourage practice of one anger management skill before the next session.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "am-6-hw",
             title: "Homework",
             steps: ["Practice regulation skills"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Anger Management – Chapter 6 - Session 6\n\nNotes:"
    },
    {
        id: "am-program-session-7",
        programId: "anger-management",
        sessionNumber: 7,
        title: "Anger Management – Chapter 7",
        purpose: "Anger Management Session 7",
        objectives: [ "Understand anger triggers", "Practice regulation skills" ],
        facilitatorPrompts: [
            {
                id: "am-7-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
This session focuses on anger management concepts from Chapter 7. Participants increase awareness of triggers, escalation patterns, and practical skills to manage anger safely and responsibly.

## FACILITATOR — OPENING (5 min)
Brief check-in and orientation to Session 7. Participants reflect on recent situations where anger showed up.

## FACILITATOR — REVIEW (10 min)
Review of prior anger management skills and how they apply to current challenges.

## FACILITATOR — TEACH (20 min)
Key teaching points from Chapter 7, including self-awareness, emotional regulation, communication strategies, and decision-making skills.

## FACILITATOR — ACTIVITY (15 min)
Participants complete an in-session worksheet aligned with Chapter 7, identifying triggers, escalation cues, and coping tools.

## FACILITATOR — RESPONSES
Group discussion of insights and real-life application.

## FACILITATOR — NOTES
Reinforce that anger is a normal emotion; the goal is managing responses, not eliminating anger.

## FACILITATOR — CASEWORX GUIDANCE
Document participation, insight, and use of anger management skills.

## FACILITATOR — WRAP-UP (5 min)
Summarize key takeaways and encourage practice of one anger management skill before the next session.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "am-7-hw",
             title: "Homework",
             steps: ["Practice regulation skills"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Anger Management – Chapter 7 - Session 7\n\nNotes:"
    },
    {
        id: "am-program-session-8",
        programId: "anger-management",
        sessionNumber: 8,
        title: "Anger Management – Chapter 8",
        purpose: "Anger Management Session 8",
        objectives: [ "Understand anger triggers", "Practice regulation skills" ],
        facilitatorPrompts: [
            {
                id: "am-8-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
This session focuses on anger management concepts from Chapter 8. Participants increase awareness of triggers, escalation patterns, and practical skills to manage anger safely and responsibly.

## FACILITATOR — OPENING (5 min)
Brief check-in and orientation to Session 8. Participants reflect on recent situations where anger showed up.

## FACILITATOR — REVIEW (10 min)
Review of prior anger management skills and how they apply to current challenges.

## FACILITATOR — TEACH (20 min)
Key teaching points from Chapter 8, including self-awareness, emotional regulation, communication strategies, and decision-making skills.

## FACILITATOR — ACTIVITY (15 min)
Participants complete an in-session worksheet aligned with Chapter 8, identifying triggers, escalation cues, and coping tools.

## FACILITATOR — RESPONSES
Group discussion of insights and real-life application.

## FACILITATOR — NOTES
Reinforce that anger is a normal emotion; the goal is managing responses, not eliminating anger.

## FACILITATOR — CASEWORX GUIDANCE
Document participation, insight, and use of anger management skills.

## FACILITATOR — WRAP-UP (5 min)
Summarize key takeaways and encourage practice of one anger management skill before the next session.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "am-8-hw",
             title: "Homework",
             steps: ["Practice regulation skills"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Anger Management – Chapter 8 - Session 8\n\nNotes:"
    },
    {
        id: "am-program-session-9",
        programId: "anger-management",
        sessionNumber: 9,
        title: "Anger Management – Chapter 9",
        purpose: "Anger Management Session 9",
        objectives: [ "Understand anger triggers", "Practice regulation skills" ],
        facilitatorPrompts: [
            {
                id: "am-9-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
This session focuses on anger management concepts from Chapter 9. Participants increase awareness of triggers, escalation patterns, and practical skills to manage anger safely and responsibly.

## FACILITATOR — OPENING (5 min)
Brief check-in and orientation to Session 9. Participants reflect on recent situations where anger showed up.

## FACILITATOR — REVIEW (10 min)
Review of prior anger management skills and how they apply to current challenges.

## FACILITATOR — TEACH (20 min)
Key teaching points from Chapter 9, including self-awareness, emotional regulation, communication strategies, and decision-making skills.

## FACILITATOR — ACTIVITY (15 min)
Participants complete an in-session worksheet aligned with Chapter 9, identifying triggers, escalation cues, and coping tools.

## FACILITATOR — RESPONSES
Group discussion of insights and real-life application.

## FACILITATOR — NOTES
Reinforce that anger is a normal emotion; the goal is managing responses, not eliminating anger.

## FACILITATOR — CASEWORX GUIDANCE
Document participation, insight, and use of anger management skills.

## FACILITATOR — WRAP-UP (5 min)
Summarize key takeaways and encourage practice of one anger management skill before the next session.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "am-9-hw",
             title: "Homework",
             steps: ["Practice regulation skills"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Anger Management – Chapter 9 - Session 9\n\nNotes:"
    },
    {
        id: "am-program-session-10",
        programId: "anger-management",
        sessionNumber: 10,
        title: "Anger Management – Chapter 10",
        purpose: "Anger Management Session 10",
        objectives: [ "Understand anger triggers", "Practice regulation skills" ],
        facilitatorPrompts: [
            {
                id: "am-10-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
This session focuses on anger management concepts from Chapter 10. Participants increase awareness of triggers, escalation patterns, and practical skills to manage anger safely and responsibly.

## FACILITATOR — OPENING (5 min)
Brief check-in and orientation to Session 10. Participants reflect on recent situations where anger showed up.

## FACILITATOR — REVIEW (10 min)
Review of prior anger management skills and how they apply to current challenges.

## FACILITATOR — TEACH (20 min)
Key teaching points from Chapter 10, including self-awareness, emotional regulation, communication strategies, and decision-making skills.

## FACILITATOR — ACTIVITY (15 min)
Participants complete an in-session worksheet aligned with Chapter 10, identifying triggers, escalation cues, and coping tools.

## FACILITATOR — RESPONSES
Group discussion of insights and real-life application.

## FACILITATOR — NOTES
Reinforce that anger is a normal emotion; the goal is managing responses, not eliminating anger.

## FACILITATOR — CASEWORX GUIDANCE
Document participation, insight, and use of anger management skills.

## FACILITATOR — WRAP-UP (5 min)
Summarize key takeaways and encourage practice of one anger management skill before the next session.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "am-10-hw",
             title: "Homework",
             steps: ["Practice regulation skills"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Anger Management – Chapter 10 - Session 10\n\nNotes:"
    },
    {
        id: "am-program-session-11",
        programId: "anger-management",
        sessionNumber: 11,
        title: "Anger Management – Chapter 11",
        purpose: "Anger Management Session 11",
        objectives: [ "Understand anger triggers", "Practice regulation skills" ],
        facilitatorPrompts: [
            {
                id: "am-11-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
This session focuses on anger management concepts from Chapter 11. Participants increase awareness of triggers, escalation patterns, and practical skills to manage anger safely and responsibly.

## FACILITATOR — OPENING (5 min)
Brief check-in and orientation to Session 11. Participants reflect on recent situations where anger showed up.

## FACILITATOR — REVIEW (10 min)
Review of prior anger management skills and how they apply to current challenges.

## FACILITATOR — TEACH (20 min)
Key teaching points from Chapter 11, including self-awareness, emotional regulation, communication strategies, and decision-making skills.

## FACILITATOR — ACTIVITY (15 min)
Participants complete an in-session worksheet aligned with Chapter 11, identifying triggers, escalation cues, and coping tools.

## FACILITATOR — RESPONSES
Group discussion of insights and real-life application.

## FACILITATOR — NOTES
Reinforce that anger is a normal emotion; the goal is managing responses, not eliminating anger.

## FACILITATOR — CASEWORX GUIDANCE
Document participation, insight, and use of anger management skills.

## FACILITATOR — WRAP-UP (5 min)
Summarize key takeaways and encourage practice of one anger management skill before the next session.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "am-11-hw",
             title: "Homework",
             steps: ["Practice regulation skills"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Anger Management – Chapter 11 - Session 11\n\nNotes:"
    },
    {
        id: "am-program-session-12",
        programId: "anger-management",
        sessionNumber: 12,
        title: "Anger Management – Chapter 12",
        purpose: "Anger Management Session 12",
        objectives: [ "Understand anger triggers", "Practice regulation skills" ],
        facilitatorPrompts: [
            {
                id: "am-12-main",
                section: "content",
                content: `## FACILITATOR — OVERVIEW (5 min)
This session focuses on anger management concepts from Chapter 12. Participants increase awareness of triggers, escalation patterns, and practical skills to manage anger safely and responsibly.

## FACILITATOR — OPENING (5 min)
Brief check-in and orientation to Session 12. Participants reflect on recent situations where anger showed up.

## FACILITATOR — REVIEW (10 min)
Review of prior anger management skills and how they apply to current challenges.

## FACILITATOR — TEACH (20 min)
Key teaching points from Chapter 12, including self-awareness, emotional regulation, communication strategies, and decision-making skills.

## FACILITATOR — ACTIVITY (15 min)
Participants complete an in-session worksheet aligned with Chapter 12, identifying triggers, escalation cues, and coping tools.

## FACILITATOR — RESPONSES
Group discussion of insights and real-life application.

## FACILITATOR — NOTES
Reinforce that anger is a normal emotion; the goal is managing responses, not eliminating anger.

## FACILITATOR — CASEWORX GUIDANCE
Document participation, insight, and use of anger management skills.

## FACILITATOR — WRAP-UP (5 min)
Summarize key takeaways and encourage practice of one anger management skill before the next session.`,
                participantContent: `Participant content is pending for this session.\\n\\n**WORKSHEET (IN-SESSION):** Pending\\n\\n**SCENARIO ACTIVITY (AFTER BREAK):** Pending`,
                suggestedPacing: "60 min"
            }
        ],
        activityTemplates: [],
        homeworkTemplate: {
             id: "am-12-hw",
             title: "Homework",
             steps: ["Practice regulation skills"],
             dueDescription: "Next Session"
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate: "Anger Management – Chapter 12 - Session 12\n\nNotes:"
    },
];

