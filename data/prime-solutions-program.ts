import type { Program } from "@/types/curriculum"

export const primeSolutionsProgram: Program = {
  id: "prime-solutions",
  name: "Prime Solutions",
  description:
    "A 16-session recovery program designed to help participants reach their goals through structured treatment planning and change strategies.",
  totalSessions: 16,
  sessions: [
    {
      id: "session-1",
      number: 1,
      title: "Understanding Change & Treatment Goals",
      overview:
        "Participants explore what motivates them to change and define their personal goals for treatment. This opening session introduces the stages of change and encourages self-assessment.",
      totalDuration: 75,
      workbookPages: "pp. 17-19",
      homework: "Complete 'My First Action Plan' worksheet (p. 17)",
      sections: [
        {
          id: "s1-objectives",
          type: "objectives",
          title: "Session Objectives",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s1-obj-1",
              type: "bullets",
              label: "By the end of this session, participants will:",
              content: [
                "Recognize change as a process, not an event",
                "Identify their readiness for change",
                "Define one short-term and one long-term goal for recovery",
              ],
            },
          ],
        },
        {
          id: "s1-core",
          type: "coreConcept",
          title: "Core Concept: Every Voyage Begins Somewhere",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s1-core-1",
              type: "paragraph",
              content:
                "Recovery is a process of learning who you are and where you're headed. The first step is understanding your current stage of change. Like Alice in Wonderland, you stand at a fork in the path - treatment presents that fork.",
            },
            {
              id: "s1-core-2",
              type: "callout",
              label: "The Phases of Change",
              content: [
                "Phase 1: Low-Risk Choices - Following 0-1-2-3 guidelines",
                "Phase 2: High-Risk Choices - Using occasionally, at risk for problems",
                "Phase 3: High-Risk + Psychological Dependence - Use integrated into life",
                "Phase 4: Addiction - Loss of control, possible withdrawal",
              ],
            },
          ],
        },
        {
          id: "s1-facilitator",
          type: "facilitatorTalkingPoints",
          title: "Facilitator Talking Points",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s1-fac-1",
              type: "script",
              label: "Opening Framing (10 min)",
              facilitatorOnly: true,
              content:
                "Recovery is a process of learning who you are and where you're headed. The first step is understanding your current stage of change.",
            },
            {
              id: "s1-fac-2",
              type: "bullets",
              label: "Discussion Prompts",
              facilitatorOnly: true,
              content: [
                "What brought you to treatment?",
                "What does 'change' mean to you right now?",
                "What do you hope to be different by the end of this program?",
              ],
            },
            {
              id: "s1-fac-3",
              type: "callout",
              label: "Resistance Tip",
              facilitatorOnly: true,
              content:
                "Some participants may feel forced into treatment. Validate their feelings while redirecting to personal goals: 'Even if you didn't choose to be here, what would make this time worthwhile for YOU?'",
            },
          ],
        },
        {
          id: "s1-exercises",
          type: "exercises",
          title: "Exercises & Discussion",
          duration: 30,
          completed: false,
          blocks: [
            {
              id: "s1-ex-1",
              type: "steps",
              label: "Activity: Identify Your Phase",
              content: [
                "Review the four phases of change together",
                "Ask participants to privately identify their current phase",
                "Discuss (without forcing disclosure): What phase resonates most?",
                "Emphasize: No judgment - awareness is the first step",
              ],
            },
            {
              id: "s1-ex-2",
              type: "paragraph",
              label: "Reflection Question",
              content:
                "In one sentence, describe the place you are 'sailing from' - your starting point for this treatment voyage.",
            },
            {
              id: "s1-ex-3",
              type: "bullets",
              label: "Treatment Path Discussion",
              content: [
                "What do you plan to do about using alcohol and drugs during treatment?",
                "What are your hopes for after treatment?",
                "Do you intend to not use at all? Keep using? Reduce?",
              ],
            },
          ],
        },
        {
          id: "s1-takeaways",
          type: "participantTakeaways",
          title: "Participant Takeaways",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s1-take-1",
              type: "bullets",
              label: "Key Takeaways",
              content: [
                "Change is a process with identifiable stages",
                "Knowing where you are helps you know where to go",
                "Your treatment path is YOUR choice",
                "Action plans break big goals into manageable steps",
              ],
            },
            {
              id: "s1-take-2",
              type: "paragraph",
              label: "Between Sessions",
              content:
                "Notice moments this week when you think about your goals. What triggers those thoughts? What helps you stay focused?",
            },
          ],
        },
        {
          id: "s1-wrapup",
          type: "wrapUp",
          title: "Wrap-Up & Homework",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s1-wrap-1",
              type: "paragraph",
              label: "Closing Reflection",
              content:
                "Take a moment to write down one thing you learned about yourself today and one question you still have.",
            },
            {
              id: "s1-wrap-2",
              type: "callout",
              label: "Homework Assignment",
              content:
                "Complete 'My First Action Plan' (p. 17). Your most immediate goal: What do you need to do to make sure you come to the next session? Write down the steps you'll take.",
            },
          ],
        },
      ],
      participantPrompts: [
        { id: "s1-p1", prompt: "In one sentence, describe where you are 'sailing from'", type: "reflection" },
        { id: "s1-p2", prompt: "What is one short-term goal for your recovery?", type: "action" },
        { id: "s1-p3", prompt: "What is one long-term goal for your recovery?", type: "action" },
      ],
    },
    {
      id: "session-2",
      number: 2,
      title: "How People Make Changes: The Stages of Change",
      overview:
        "Deep dive into the Stages of Change model, helping participants identify their personal stage and understand ambivalence.",
      totalDuration: 75,
      workbookPages: "pp. 18-21",
      homework: "Complete 'Hey, I've Done This Before!' worksheet (p. 21)",
      sections: [
        {
          id: "s2-objectives",
          type: "objectives",
          title: "Session Objectives",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s2-obj-1",
              type: "bullets",
              label: "By the end of this session, participants will:",
              content: [
                "Understand the five stages of change",
                "Identify their personal stage of change",
                "Recognize ambivalence as normal, not failure",
              ],
            },
          ],
        },
        {
          id: "s2-core",
          type: "coreConcept",
          title: "Core Concept: The Stages of Change",
          duration: 15,
          completed: false,
          blocks: [
            {
              id: "s2-core-1",
              type: "callout",
              label: "The Five Stages",
              content: [
                "No Way, Not Now (Precontemplation) - Not considering change",
                "Maybe, But... (Contemplation) - Thinking about it, ambivalent",
                "Getting Ready (Preparation) - Planning to take action",
                "Doing It (Action) - Actively making changes",
                "The New Me (Maintenance) - Sustaining the changes",
              ],
            },
            {
              id: "s2-core-2",
              type: "paragraph",
              content:
                "Change isn't linear. People move back and forth between stages. This is normal and expected. The goal is progress, not perfection.",
            },
          ],
        },
        {
          id: "s2-facilitator",
          type: "facilitatorTalkingPoints",
          title: "Facilitator Talking Points",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s2-fac-1",
              type: "script",
              facilitatorOnly: true,
              content:
                "Today we're going to explore how people actually change. It's not a straight line from problem to solution - it's more like a spiral staircase.",
            },
            {
              id: "s2-fac-2",
              type: "bullets",
              label: "Key Points to Emphasize",
              facilitatorOnly: true,
              content: [
                "Normalize ambivalence - it's part of the process",
                "Past attempts at change aren't failures - they're learning",
                "Each stage has its own tasks and challenges",
                "Meeting people where they are, not where we want them to be",
              ],
            },
          ],
        },
        {
          id: "s2-exercises",
          type: "exercises",
          title: "Exercises & Discussion",
          duration: 30,
          completed: false,
          blocks: [
            {
              id: "s2-ex-1",
              type: "steps",
              label: "Activity: Stage Identification",
              content: [
                "Review each stage with examples",
                "Have participants privately mark their current stage",
                "Small group discussion: What stage feels most familiar?",
                "Whole group: What helps people move from one stage to the next?",
              ],
            },
            {
              id: "s2-ex-2",
              type: "paragraph",
              label: "Ambivalence Exercise",
              content:
                "Think about something you've been ambivalent about (not necessarily substances). What were the 'maybe' and 'but' parts? How did you eventually decide?",
            },
          ],
        },
        {
          id: "s2-takeaways",
          type: "participantTakeaways",
          title: "Participant Takeaways",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s2-take-1",
              type: "bullets",
              content: [
                "Change happens in stages - know where you are",
                "Ambivalence is normal, not weakness",
                "Past attempts teach us what works and what doesn't",
                "Each stage requires different strategies",
              ],
            },
          ],
        },
        {
          id: "s2-wrapup",
          type: "wrapUp",
          title: "Wrap-Up & Homework",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s2-wrap-1",
              type: "callout",
              label: "Homework",
              content:
                "Complete 'Hey, I've Done This Before!' (p. 21). Think about a time you successfully made a change in your life. What helped? What got in the way?",
            },
          ],
        },
      ],
      participantPrompts: [
        { id: "s2-p1", prompt: "What stage of change are you in right now?", type: "reflection" },
        { id: "s2-p2", prompt: "What's one thing that's helped you change in the past?", type: "reflection" },
      ],
    },
    {
      id: "session-3",
      number: 3,
      title: "Learning from the Past",
      overview:
        "Analyze past relapse or failure experiences to identify barriers, supports, and reframe setbacks as learning opportunities.",
      totalDuration: 75,
      workbookPages: "p. 24",
      homework: "Complete 'Rewinding My Game Tape' worksheet (p. 24)",
      sections: [
        {
          id: "s3-objectives",
          type: "objectives",
          title: "Session Objectives",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s3-obj-1",
              type: "bullets",
              content: [
                "Analyze past relapse or failure experiences",
                "Identify personal barriers and supports",
                "Reframe setbacks as learning opportunities",
              ],
            },
          ],
        },
        {
          id: "s3-core",
          type: "coreConcept",
          title: "Core Concept: The Game Tape",
          duration: 15,
          completed: false,
          blocks: [
            {
              id: "s3-core-1",
              type: "paragraph",
              content:
                "Athletes watch game tapes to learn from mistakes. We can do the same with our past experiences. Looking back isn't about blame - it's about understanding what happened so we can do better.",
            },
            {
              id: "s3-core-2",
              type: "bullets",
              label: "What to Look For",
              content: [
                "Warning signs you missed",
                "People who helped or hindered",
                "Situations that were particularly risky",
                "What you would do differently",
              ],
            },
          ],
        },
        {
          id: "s3-facilitator",
          type: "facilitatorTalkingPoints",
          title: "Facilitator Talking Points",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s3-fac-1",
              type: "callout",
              label: "Clinical Note",
              facilitatorOnly: true,
              content:
                "This session may bring up shame. Normalize relapse as part of many recovery journeys. Focus on learning, not judgment.",
            },
            {
              id: "s3-fac-2",
              type: "bullets",
              facilitatorOnly: true,
              content: [
                "Use 'slipped' or 'lapsed' rather than 'failed'",
                "Emphasize growth mindset",
                "Watch for participants who are too hard on themselves",
              ],
            },
          ],
        },
        {
          id: "s3-exercises",
          type: "exercises",
          title: "Exercises & Discussion",
          duration: 30,
          completed: false,
          blocks: [
            {
              id: "s3-ex-1",
              type: "steps",
              label: "Rewinding the Tape",
              content: [
                "Think of a time things didn't go as planned",
                "What happened in the days/weeks before?",
                "Who was around? What were you feeling?",
                "What would you tell yourself if you could go back?",
              ],
            },
          ],
        },
        {
          id: "s3-takeaways",
          type: "participantTakeaways",
          title: "Participant Takeaways",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s3-take-1",
              type: "bullets",
              content: [
                "Past experiences are data, not destiny",
                "Identifying patterns helps prevent repeating them",
                "Support systems matter",
                "Self-compassion aids recovery",
              ],
            },
          ],
        },
        {
          id: "s3-wrapup",
          type: "wrapUp",
          title: "Wrap-Up & Homework",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s3-wrap-1",
              type: "callout",
              label: "Homework",
              content: "Complete 'Rewinding My Game Tape' (p. 24). Be honest but kind with yourself.",
            },
          ],
        },
      ],
      participantPrompts: [
        { id: "s3-p1", prompt: "What's one pattern you've noticed in your past experiences?", type: "reflection" },
        { id: "s3-p2", prompt: "Who or what has been most helpful in your recovery attempts?", type: "reflection" },
      ],
    },
    {
      id: "session-4",
      number: 4,
      title: "Staging My Treatment Plan",
      overview:
        "Connect personal goals to the stage model and explore multiple life domains affected by substance use.",
      totalDuration: 75,
      workbookPages: "pp. 25-28",
      homework: "Complete treatment plan mapping for two life domains",
      sections: [
        {
          id: "s4-objectives",
          type: "objectives",
          title: "Session Objectives",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s4-obj-1",
              type: "bullets",
              content: [
                "Connect goals to the stage model",
                "Explore multiple domains: substance use, legal, social",
                "Create stage-appropriate action steps",
              ],
            },
          ],
        },
        {
          id: "s4-core",
          type: "coreConcept",
          title: "Core Concept: Life Domains",
          duration: 15,
          completed: false,
          blocks: [
            {
              id: "s4-core-1",
              type: "paragraph",
              content:
                "Substance use affects every area of life. A complete treatment plan addresses multiple domains, not just the substance use itself.",
            },
            {
              id: "s4-core-2",
              type: "bullets",
              label: "Key Life Domains",
              content: [
                "Substance use patterns",
                "Legal situation",
                "Relationships and social life",
                "Employment and finances",
                "Physical and mental health",
                "Housing and living situation",
              ],
            },
          ],
        },
        {
          id: "s4-facilitator",
          type: "facilitatorTalkingPoints",
          title: "Facilitator Talking Points",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s4-fac-1",
              type: "script",
              facilitatorOnly: true,
              content:
                "Your treatment plan is like a map for your recovery journey. Today we're going to make sure the map covers all the important territories.",
            },
          ],
        },
        {
          id: "s4-exercises",
          type: "exercises",
          title: "Exercises & Discussion",
          duration: 30,
          completed: false,
          blocks: [
            {
              id: "s4-ex-1",
              type: "steps",
              label: "Domain Mapping",
              content: [
                "List the life domains affected by your substance use",
                "For each domain, identify your current stage of change",
                "Set one goal per domain",
                "Identify one action step for each goal",
              ],
            },
          ],
        },
        {
          id: "s4-takeaways",
          type: "participantTakeaways",
          title: "Participant Takeaways",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s4-take-1",
              type: "bullets",
              content: [
                "Recovery touches every part of life",
                "Different domains may be in different stages",
                "Start where you are, not where you think you should be",
                "Small steps in multiple areas add up",
              ],
            },
          ],
        },
        {
          id: "s4-wrapup",
          type: "wrapUp",
          title: "Wrap-Up & Homework",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s4-wrap-1",
              type: "callout",
              label: "Homework",
              content:
                "Complete your treatment plan mapping for at least two life domains. Bring questions next session.",
            },
          ],
        },
      ],
      participantPrompts: [
        { id: "s4-p1", prompt: "Which life domain needs the most attention right now?", type: "reflection" },
        { id: "s4-p2", prompt: "What's one small step you can take this week?", type: "action" },
      ],
    },
    {
      id: "session-5",
      number: 5,
      title: "High-Risk Choices: Drug Categories",
      overview: "Education on drug categories, their effects, and understanding personal high-risk choices.",
      totalDuration: 75,
      workbookPages: "pp. 29-35",
      homework: "Complete personal risk assessment worksheet",
      sections: [
        {
          id: "s5-objectives",
          type: "objectives",
          title: "Session Objectives",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s5-obj-1",
              type: "bullets",
              content: [
                "Learn drug categories and their effects",
                "Understand the concept of cross-tolerance",
                "Identify personal high-risk substances",
              ],
            },
          ],
        },
        {
          id: "s5-core",
          type: "coreConcept",
          title: "Core Concept: Drug Categories",
          duration: 20,
          completed: false,
          blocks: [
            {
              id: "s5-core-1",
              type: "bullets",
              label: "Major Categories",
              content: [
                "Depressants (alcohol, benzos, opioids)",
                "Stimulants (cocaine, meth, prescription stimulants)",
                "Hallucinogens (LSD, psilocybin)",
                "Cannabis",
                "Inhalants",
              ],
            },
            {
              id: "s5-core-2",
              type: "paragraph",
              content:
                "Understanding how different substances affect the brain helps explain tolerance, dependence, and why certain combinations are dangerous.",
            },
          ],
        },
        {
          id: "s5-facilitator",
          type: "facilitatorTalkingPoints",
          title: "Facilitator Talking Points",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s5-fac-1",
              type: "callout",
              facilitatorOnly: true,
              content:
                "This is educational, not judgmental. Some participants may minimize their use of certain substances. Focus on information, not confrontation.",
            },
          ],
        },
        {
          id: "s5-exercises",
          type: "exercises",
          title: "Exercises & Discussion",
          duration: 25,
          completed: false,
          blocks: [
            {
              id: "s5-ex-1",
              type: "steps",
              label: "Personal Risk Assessment",
              content: [
                "List all substances you've used",
                "Categorize them",
                "Rate your risk level with each (low/medium/high)",
                "Identify which ones are hardest to avoid",
              ],
            },
          ],
        },
        {
          id: "s5-takeaways",
          type: "participantTakeaways",
          title: "Participant Takeaways",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s5-take-1",
              type: "bullets",
              content: [
                "Knowledge is power in recovery",
                "Cross-addiction is real",
                "Personal risk varies by substance",
                "Avoiding one substance may not be enough",
              ],
            },
          ],
        },
        {
          id: "s5-wrapup",
          type: "wrapUp",
          title: "Wrap-Up & Homework",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s5-wrap-1",
              type: "callout",
              label: "Homework",
              content: "Complete your personal risk assessment. Be thorough and honest.",
            },
          ],
        },
      ],
      participantPrompts: [
        { id: "s5-p1", prompt: "Which substance category poses the highest risk for you?", type: "reflection" },
      ],
    },
    {
      id: "session-6",
      number: 6,
      title: "What Happens to the Brain",
      overview: "Understanding the neuroscience of addiction and how substances change the brain.",
      totalDuration: 75,
      workbookPages: "pp. 36-42",
      homework: "Reflect on personal brain-related experiences",
      sections: [
        {
          id: "s6-objectives",
          type: "objectives",
          title: "Session Objectives",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s6-obj-1",
              type: "bullets",
              content: [
                "Understand basic brain chemistry",
                "Learn how substances affect the reward system",
                "Recognize that brain changes are reversible with time",
              ],
            },
          ],
        },
        {
          id: "s6-core",
          type: "coreConcept",
          title: "Core Concept: The Hijacked Brain",
          duration: 20,
          completed: false,
          blocks: [
            {
              id: "s6-core-1",
              type: "paragraph",
              content:
                "Addiction hijacks the brain's natural reward system. Understanding this helps remove shame and provides hope - brains can heal.",
            },
            {
              id: "s6-core-2",
              type: "bullets",
              label: "Key Brain Concepts",
              content: [
                "Dopamine and the reward pathway",
                "Tolerance and the need for more",
                "Withdrawal and the brain seeking balance",
                "Neuroplasticity - the brain can change",
              ],
            },
          ],
        },
        {
          id: "s6-facilitator",
          type: "facilitatorTalkingPoints",
          title: "Facilitator Talking Points",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s6-fac-1",
              type: "script",
              facilitatorOnly: true,
              content:
                "This session helps participants understand WHY they feel the way they do. It's science, not weakness. Emphasize hope and healing.",
            },
          ],
        },
        {
          id: "s6-exercises",
          type: "exercises",
          title: "Exercises & Discussion",
          duration: 25,
          completed: false,
          blocks: [
            {
              id: "s6-ex-1",
              type: "paragraph",
              label: "Discussion",
              content:
                "Think about times when you needed more of a substance to get the same effect. How did that feel? What did you tell yourself about it?",
            },
          ],
        },
        {
          id: "s6-takeaways",
          type: "participantTakeaways",
          title: "Participant Takeaways",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s6-take-1",
              type: "bullets",
              content: [
                "Addiction is a brain condition, not a character flaw",
                "The brain can and does heal",
                "Time in recovery helps restore balance",
                "Cravings are brain signals, not commands",
              ],
            },
          ],
        },
        {
          id: "s6-wrapup",
          type: "wrapUp",
          title: "Wrap-Up & Homework",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s6-wrap-1",
              type: "callout",
              label: "Homework",
              content:
                "Write about a time you experienced tolerance or withdrawal. How does understanding the brain science change how you see that experience?",
            },
          ],
        },
      ],
      participantPrompts: [
        {
          id: "s6-p1",
          prompt: "How does understanding brain science affect how you see your addiction?",
          type: "reflection",
        },
      ],
    },
    {
      id: "session-7",
      number: 7,
      title: "The Thought – Feeling – Behavior Connection",
      overview: "Introduction to cognitive-behavioral concepts and how thoughts drive feelings and actions.",
      totalDuration: 75,
      workbookPages: "pp. 43-48",
      homework: "Complete thought record for three situations",
      sections: [
        {
          id: "s7-objectives",
          type: "objectives",
          title: "Session Objectives",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s7-obj-1",
              type: "bullets",
              content: [
                "Understand the connection between thoughts, feelings, and behaviors",
                "Identify automatic thoughts",
                "Begin practicing thought awareness",
              ],
            },
          ],
        },
        {
          id: "s7-core",
          type: "coreConcept",
          title: "Core Concept: The CBT Triangle",
          duration: 15,
          completed: false,
          blocks: [
            {
              id: "s7-core-1",
              type: "paragraph",
              content:
                "Our thoughts affect our feelings, which affect our behaviors. By changing how we think, we can change how we feel and what we do.",
            },
            {
              id: "s7-core-2",
              type: "callout",
              label: "The Triangle",
              content: "Situation → Thought → Feeling → Behavior → (back to Situation)",
            },
          ],
        },
        {
          id: "s7-facilitator",
          type: "facilitatorTalkingPoints",
          title: "Facilitator Talking Points",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s7-fac-1",
              type: "bullets",
              facilitatorOnly: true,
              content: [
                "Use concrete examples from everyday life first",
                "Substance-related examples come after the concept is understood",
                "Emphasize that thoughts are not facts",
              ],
            },
          ],
        },
        {
          id: "s7-exercises",
          type: "exercises",
          title: "Exercises & Discussion",
          duration: 30,
          completed: false,
          blocks: [
            {
              id: "s7-ex-1",
              type: "steps",
              label: "Thought Tracking",
              content: [
                "Think of a recent situation that upset you",
                "What was the first thought that came to mind?",
                "What feeling followed?",
                "What did you do (or want to do)?",
              ],
            },
          ],
        },
        {
          id: "s7-takeaways",
          type: "participantTakeaways",
          title: "Participant Takeaways",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s7-take-1",
              type: "bullets",
              content: [
                "Thoughts happen automatically",
                "We can learn to notice and examine our thoughts",
                "Changing thoughts can change feelings and behaviors",
                "This takes practice",
              ],
            },
          ],
        },
        {
          id: "s7-wrapup",
          type: "wrapUp",
          title: "Wrap-Up & Homework",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s7-wrap-1",
              type: "callout",
              label: "Homework",
              content:
                "Complete a thought record for three situations this week. Notice the thought-feeling-behavior connection.",
            },
          ],
        },
      ],
      participantPrompts: [
        { id: "s7-p1", prompt: "What's one automatic thought you noticed this week?", type: "reflection" },
      ],
    },
    {
      id: "session-8",
      number: 8,
      title: "Cravings & Triggers",
      overview: "Understanding cravings, identifying personal triggers, and developing a cravings management plan.",
      totalDuration: 75,
      workbookPages: "pp. 49-55",
      homework: "Complete personal trigger inventory and coping plan",
      sections: [
        {
          id: "s8-objectives",
          type: "objectives",
          title: "Session Objectives",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s8-obj-1",
              type: "bullets",
              content: [
                "Understand what cravings are and why they happen",
                "Identify personal triggers",
                "Develop strategies to manage cravings",
              ],
            },
          ],
        },
        {
          id: "s8-core",
          type: "coreConcept",
          title: "Core Concept: Cravings as Signals",
          duration: 15,
          completed: false,
          blocks: [
            {
              id: "s8-core-1",
              type: "paragraph",
              content:
                "Cravings are the brain's way of signaling that it wants something it's used to getting. They're uncomfortable but temporary. They're signals, not commands.",
            },
            {
              id: "s8-core-2",
              type: "bullets",
              label: "Types of Triggers",
              content: [
                "People (who you used with)",
                "Places (where you used)",
                "Things (paraphernalia, money)",
                "Times (paydays, weekends)",
                "Emotions (stress, boredom, celebration)",
              ],
            },
          ],
        },
        {
          id: "s8-facilitator",
          type: "facilitatorTalkingPoints",
          title: "Facilitator Talking Points",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s8-fac-1",
              type: "callout",
              facilitatorOnly: true,
              content:
                "Normalize cravings. Everyone in recovery experiences them. The goal is management, not elimination.",
            },
            {
              id: "s8-fac-2",
              type: "script",
              facilitatorOnly: true,
              content:
                "Think of cravings like waves. They build, peak, and then pass. You don't have to act on them - you can ride them out.",
            },
          ],
        },
        {
          id: "s8-exercises",
          type: "exercises",
          title: "Exercises & Discussion",
          duration: 30,
          completed: false,
          blocks: [
            {
              id: "s8-ex-1",
              type: "steps",
              label: "Trigger Inventory",
              content: [
                "List your personal triggers in each category",
                "Rate intensity (1-10) for each",
                "Identify which you can avoid vs. need to manage",
                "Develop one coping strategy for your top 3 triggers",
              ],
            },
          ],
        },
        {
          id: "s8-takeaways",
          type: "participantTakeaways",
          title: "Participant Takeaways",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s8-take-1",
              type: "bullets",
              content: [
                "Cravings are normal and temporary",
                "Knowing your triggers gives you power",
                "Avoid what you can, cope with what you can't",
                "Have a plan BEFORE the craving hits",
              ],
            },
          ],
        },
        {
          id: "s8-wrapup",
          type: "wrapUp",
          title: "Wrap-Up & Homework",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s8-wrap-1",
              type: "callout",
              label: "Homework",
              content: "Complete your personal trigger inventory and develop a coping plan for your top 5 triggers.",
            },
          ],
        },
      ],
      participantPrompts: [
        { id: "s8-p1", prompt: "What is your strongest trigger?", type: "reflection" },
        { id: "s8-p2", prompt: "What strategy will you use when cravings hit?", type: "action" },
      ],
    },
    {
      id: "session-9",
      number: 9,
      title: "The People in My Life",
      overview: "Examining relationships and their impact on recovery - supportive vs. high-risk relationships.",
      totalDuration: 75,
      workbookPages: "pp. 56-62",
      homework: "Complete relationship inventory",
      sections: [
        {
          id: "s9-objectives",
          type: "objectives",
          title: "Session Objectives",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s9-obj-1",
              type: "bullets",
              content: [
                "Identify supportive vs. high-risk relationships",
                "Understand how relationships affect recovery",
                "Develop strategies for managing difficult relationships",
              ],
            },
          ],
        },
        {
          id: "s9-core",
          type: "coreConcept",
          title: "Core Concept: Relationship Circles",
          duration: 15,
          completed: false,
          blocks: [
            {
              id: "s9-core-1",
              type: "paragraph",
              content:
                "The people around us can support or sabotage our recovery. We need to honestly assess our relationships and make conscious choices about who we spend time with.",
            },
            {
              id: "s9-core-2",
              type: "bullets",
              label: "Relationship Categories",
              content: [
                "Inner circle - people who actively support recovery",
                "Middle circle - neutral, could go either way",
                "Outer circle - high-risk, may need to avoid",
              ],
            },
          ],
        },
        {
          id: "s9-facilitator",
          type: "facilitatorTalkingPoints",
          title: "Facilitator Talking Points",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s9-fac-1",
              type: "callout",
              facilitatorOnly: true,
              content:
                "This can be emotional. Some may need to distance from family or long-term friends. Validate the difficulty while maintaining focus on recovery priorities.",
            },
          ],
        },
        {
          id: "s9-exercises",
          type: "exercises",
          title: "Exercises & Discussion",
          duration: 30,
          completed: false,
          blocks: [
            {
              id: "s9-ex-1",
              type: "steps",
              label: "Relationship Mapping",
              content: [
                "Draw three circles (inner, middle, outer)",
                "Place the important people in your life in each circle",
                "Be honest about where each person belongs",
                "Identify one relationship to strengthen, one to limit",
              ],
            },
          ],
        },
        {
          id: "s9-takeaways",
          type: "participantTakeaways",
          title: "Participant Takeaways",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s9-take-1",
              type: "bullets",
              content: [
                "Relationships profoundly affect recovery",
                "You can't change others, but you can change who you spend time with",
                "Building new supportive relationships takes time",
                "Setting boundaries is an act of self-care",
              ],
            },
          ],
        },
        {
          id: "s9-wrapup",
          type: "wrapUp",
          title: "Wrap-Up & Homework",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s9-wrap-1",
              type: "callout",
              label: "Homework",
              content:
                "Complete your relationship inventory. Identify one action step for improving your support network.",
            },
          ],
        },
      ],
      participantPrompts: [
        { id: "s9-p1", prompt: "Who is in your inner circle of support?", type: "reflection" },
        { id: "s9-p2", prompt: "What's one relationship you need to set limits on?", type: "reflection" },
      ],
    },
    {
      id: "session-10",
      number: 10,
      title: "Anger & Recovery",
      overview: "Understanding anger, its role in relapse, and developing healthy anger management strategies.",
      totalDuration: 75,
      workbookPages: "pp. 63-70",
      homework: "Complete anger log for one week",
      sections: [
        {
          id: "s10-objectives",
          type: "objectives",
          title: "Session Objectives",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s10-obj-1",
              type: "bullets",
              content: [
                "Understand the connection between anger and substance use",
                "Identify personal anger triggers and patterns",
                "Learn healthy anger management strategies",
              ],
            },
          ],
        },
        {
          id: "s10-core",
          type: "coreConcept",
          title: "Core Concept: Anger as a Secondary Emotion",
          duration: 15,
          completed: false,
          blocks: [
            {
              id: "s10-core-1",
              type: "paragraph",
              content:
                "Anger often covers up other emotions - hurt, fear, shame. Understanding what's underneath anger helps us respond rather than react.",
            },
            {
              id: "s10-core-2",
              type: "bullets",
              label: "Anger Warning Signs",
              content: [
                "Physical signs (tension, racing heart)",
                "Thought patterns (all-or-nothing thinking)",
                "Behavioral signs (raised voice, clenched fists)",
              ],
            },
          ],
        },
        {
          id: "s10-facilitator",
          type: "facilitatorTalkingPoints",
          title: "Facilitator Talking Points",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s10-fac-1",
              type: "callout",
              facilitatorOnly: true,
              content:
                "Anger is often a cover for vulnerability. Help participants see what's underneath without pushing too hard.",
            },
          ],
        },
        {
          id: "s10-exercises",
          type: "exercises",
          title: "Exercises & Discussion",
          duration: 30,
          completed: false,
          blocks: [
            {
              id: "s10-ex-1",
              type: "steps",
              label: "Anger Awareness",
              content: [
                "Think of a recent time you felt angry",
                "What triggered it?",
                "What emotions were underneath the anger?",
                "How did you respond? How would you respond differently?",
              ],
            },
          ],
        },
        {
          id: "s10-takeaways",
          type: "participantTakeaways",
          title: "Participant Takeaways",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s10-take-1",
              type: "bullets",
              content: [
                "Anger is normal; it's what you do with it that matters",
                "Look for what's underneath the anger",
                "Know your warning signs",
                "Have a plan before you're angry",
              ],
            },
          ],
        },
        {
          id: "s10-wrapup",
          type: "wrapUp",
          title: "Wrap-Up & Homework",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s10-wrap-1",
              type: "callout",
              label: "Homework",
              content:
                "Keep an anger log this week. When you feel angry, write down what triggered it, what was underneath, and how you responded.",
            },
          ],
        },
      ],
      participantPrompts: [
        { id: "s10-p1", prompt: "What emotion is usually underneath your anger?", type: "reflection" },
      ],
    },
    {
      id: "session-11",
      number: 11,
      title: "Managing Stress Without Substances",
      overview: "Developing healthy stress management strategies to replace substance use.",
      totalDuration: 75,
      workbookPages: "pp. 71-78",
      homework: "Practice one new stress management technique daily",
      sections: [
        {
          id: "s11-objectives",
          type: "objectives",
          title: "Session Objectives",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s11-obj-1",
              type: "bullets",
              content: [
                "Identify personal stress triggers",
                "Learn healthy stress management techniques",
                "Create a personalized stress management plan",
              ],
            },
          ],
        },
        {
          id: "s11-core",
          type: "coreConcept",
          title: "Core Concept: Stress and Substances",
          duration: 15,
          completed: false,
          blocks: [
            {
              id: "s11-core-1",
              type: "paragraph",
              content:
                "Many people used substances to manage stress. Recovery means finding new, healthy ways to cope. This takes practice and experimentation.",
            },
            {
              id: "s11-core-2",
              type: "bullets",
              label: "Healthy Stress Management Options",
              content: [
                "Physical activity",
                "Relaxation techniques (breathing, progressive muscle relaxation)",
                "Social support",
                "Time management",
                "Mindfulness and meditation",
              ],
            },
          ],
        },
        {
          id: "s11-facilitator",
          type: "facilitatorTalkingPoints",
          title: "Facilitator Talking Points",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s11-fac-1",
              type: "script",
              facilitatorOnly: true,
              content:
                "Today we're going to build your stress management toolkit. What works for one person may not work for another - the key is having multiple options.",
            },
          ],
        },
        {
          id: "s11-exercises",
          type: "exercises",
          title: "Exercises & Discussion",
          duration: 30,
          completed: false,
          blocks: [
            {
              id: "s11-ex-1",
              type: "steps",
              label: "Stress Toolkit Building",
              content: [
                "List your top 5 stressors",
                "Brainstorm healthy coping options for each",
                "Practice one technique together (deep breathing)",
                "Choose 3 strategies to try this week",
              ],
            },
          ],
        },
        {
          id: "s11-takeaways",
          type: "participantTakeaways",
          title: "Participant Takeaways",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s11-take-1",
              type: "bullets",
              content: [
                "Stress is unavoidable; how you respond is a choice",
                "Have multiple tools in your toolkit",
                "Prevention is better than crisis management",
                "Practice makes these skills more accessible",
              ],
            },
          ],
        },
        {
          id: "s11-wrapup",
          type: "wrapUp",
          title: "Wrap-Up & Homework",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s11-wrap-1",
              type: "callout",
              label: "Homework",
              content:
                "Practice at least one new stress management technique every day this week. Track what works and what doesn't.",
            },
          ],
        },
      ],
      participantPrompts: [
        { id: "s11-p1", prompt: "What's your top stressor right now?", type: "reflection" },
        { id: "s11-p2", prompt: "What stress management technique will you try first?", type: "action" },
      ],
    },
    {
      id: "session-12",
      number: 12,
      title: "Thinking Errors & Relapse",
      overview: "Identifying cognitive distortions that lead to relapse and practicing cognitive restructuring.",
      totalDuration: 75,
      workbookPages: "pp. 79-86",
      homework: "Complete thought restructuring worksheet",
      sections: [
        {
          id: "s12-objectives",
          type: "objectives",
          title: "Session Objectives",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s12-obj-1",
              type: "bullets",
              content: [
                "Identify common thinking errors",
                "Recognize personal patterns of distorted thinking",
                "Practice cognitive restructuring",
              ],
            },
          ],
        },
        {
          id: "s12-core",
          type: "coreConcept",
          title: "Core Concept: Thought Relapse Before Behavior",
          duration: 15,
          completed: false,
          blocks: [
            {
              id: "s12-core-1",
              type: "paragraph",
              content:
                "Relapse starts in the mind before it shows in behavior. Certain thinking patterns (thinking errors) pave the way for relapse. Catching and correcting these thoughts is relapse prevention.",
            },
            {
              id: "s12-core-2",
              type: "bullets",
              label: "Common Thinking Errors",
              content: [
                "All-or-nothing thinking",
                "Catastrophizing",
                "Mind reading",
                "Emotional reasoning",
                "Should statements",
                "Minimizing/Rationalizing",
              ],
            },
          ],
        },
        {
          id: "s12-facilitator",
          type: "facilitatorTalkingPoints",
          title: "Facilitator Talking Points",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s12-fac-1",
              type: "callout",
              facilitatorOnly: true,
              content:
                "Use humor when appropriate - thinking errors can feel 'silly' once we see them clearly. But don't minimize the power they have over behavior.",
            },
          ],
        },
        {
          id: "s12-exercises",
          type: "exercises",
          title: "Exercises & Discussion",
          duration: 30,
          completed: false,
          blocks: [
            {
              id: "s12-ex-1",
              type: "steps",
              label: "Catching Thinking Errors",
              content: [
                "Review common thinking errors with examples",
                "Identify your 'favorite' thinking errors",
                "Practice reframing one error into balanced thinking",
                "Share strategies for catching errors in real-time",
              ],
            },
          ],
        },
        {
          id: "s12-takeaways",
          type: "participantTakeaways",
          title: "Participant Takeaways",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s12-take-1",
              type: "bullets",
              content: [
                "Relapse starts in the mind",
                "Thinking errors are common but correctable",
                "Balanced thinking supports recovery",
                "Practice makes recognition automatic",
              ],
            },
          ],
        },
        {
          id: "s12-wrapup",
          type: "wrapUp",
          title: "Wrap-Up & Homework",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s12-wrap-1",
              type: "callout",
              label: "Homework",
              content:
                "Complete the thought restructuring worksheet. Catch at least 3 thinking errors this week and practice reframing them.",
            },
          ],
        },
      ],
      participantPrompts: [{ id: "s12-p1", prompt: "What's your most common thinking error?", type: "reflection" }],
    },
    {
      id: "session-13",
      number: 13,
      title: "Building a Recovery Lifestyle",
      overview: "Creating structure, healthy routines, and meaningful activities to support ongoing recovery.",
      totalDuration: 75,
      workbookPages: "pp. 87-93",
      homework: "Create a weekly recovery schedule",
      sections: [
        {
          id: "s13-objectives",
          type: "objectives",
          title: "Session Objectives",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s13-obj-1",
              type: "bullets",
              content: [
                "Understand the importance of structure in recovery",
                "Identify meaningful activities",
                "Create a balanced weekly schedule",
              ],
            },
          ],
        },
        {
          id: "s13-core",
          type: "coreConcept",
          title: "Core Concept: Recovery as a Lifestyle",
          duration: 15,
          completed: false,
          blocks: [
            {
              id: "s13-core-1",
              type: "paragraph",
              content:
                "Recovery isn't just about not using - it's about building a life you don't want to escape from. This means creating structure, finding meaning, and developing healthy routines.",
            },
            {
              id: "s13-core-2",
              type: "bullets",
              label: "Components of a Recovery Lifestyle",
              content: [
                "Regular sleep schedule",
                "Healthy eating",
                "Physical activity",
                "Meaningful work or activities",
                "Social connection",
                "Spiritual or mindfulness practices",
              ],
            },
          ],
        },
        {
          id: "s13-facilitator",
          type: "facilitatorTalkingPoints",
          title: "Facilitator Talking Points",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s13-fac-1",
              type: "script",
              facilitatorOnly: true,
              content:
                "Empty time is dangerous time. Today we're filling in the gaps with purposeful activities that support your recovery.",
            },
          ],
        },
        {
          id: "s13-exercises",
          type: "exercises",
          title: "Exercises & Discussion",
          duration: 30,
          completed: false,
          blocks: [
            {
              id: "s13-ex-1",
              type: "steps",
              label: "Weekly Schedule Building",
              content: [
                "Map your current typical week",
                "Identify high-risk times (empty, unstructured)",
                "Brainstorm healthy activities to fill gaps",
                "Create a balanced weekly schedule",
              ],
            },
          ],
        },
        {
          id: "s13-takeaways",
          type: "participantTakeaways",
          title: "Participant Takeaways",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s13-take-1",
              type: "bullets",
              content: [
                "Structure supports recovery",
                "Balance work, rest, and play",
                "Fill high-risk times with healthy activities",
                "Build a life worth living sober",
              ],
            },
          ],
        },
        {
          id: "s13-wrapup",
          type: "wrapUp",
          title: "Wrap-Up & Homework",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s13-wrap-1",
              type: "callout",
              label: "Homework",
              content:
                "Create your weekly recovery schedule. Follow it for one week and note what works and what needs adjustment.",
            },
          ],
        },
      ],
      participantPrompts: [
        { id: "s13-p1", prompt: "What time of day is highest risk for you?", type: "reflection" },
        { id: "s13-p2", prompt: "What meaningful activity will you add to your schedule?", type: "action" },
      ],
    },
    {
      id: "session-14",
      number: 14,
      title: "Relapse Prevention Planning",
      overview: "Creating a comprehensive relapse prevention plan with warning signs and action steps.",
      totalDuration: 75,
      workbookPages: "pp. 94-102",
      homework: "Complete personal relapse prevention plan",
      sections: [
        {
          id: "s14-objectives",
          type: "objectives",
          title: "Session Objectives",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s14-obj-1",
              type: "bullets",
              content: [
                "Identify personal warning signs of relapse",
                "Create a comprehensive prevention plan",
                "Establish accountability and support systems",
              ],
            },
          ],
        },
        {
          id: "s14-core",
          type: "coreConcept",
          title: "Core Concept: Relapse as a Process",
          duration: 15,
          completed: false,
          blocks: [
            {
              id: "s14-core-1",
              type: "paragraph",
              content:
                "Relapse is a process, not an event. It starts with emotional and mental changes before any substance use. Catching the process early makes prevention possible.",
            },
            {
              id: "s14-core-2",
              type: "bullets",
              label: "Stages of Relapse",
              content: [
                "Emotional relapse (isolating, poor self-care)",
                "Mental relapse (romanticizing use, planning)",
                "Physical relapse (actual use)",
              ],
            },
          ],
        },
        {
          id: "s14-facilitator",
          type: "facilitatorTalkingPoints",
          title: "Facilitator Talking Points",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s14-fac-1",
              type: "callout",
              facilitatorOnly: true,
              content:
                "This is practical, concrete planning. Help participants be specific. 'I'll call someone' is not enough - WHO will you call?",
            },
          ],
        },
        {
          id: "s14-exercises",
          type: "exercises",
          title: "Exercises & Discussion",
          duration: 30,
          completed: false,
          blocks: [
            {
              id: "s14-ex-1",
              type: "steps",
              label: "Prevention Plan Development",
              content: [
                "List your personal warning signs for each stage",
                "Identify 3 people you can call in crisis",
                "Create specific action steps for each warning sign",
                "Plan for what to do IF relapse happens (not failure planning - reality planning)",
              ],
            },
          ],
        },
        {
          id: "s14-takeaways",
          type: "participantTakeaways",
          title: "Participant Takeaways",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s14-take-1",
              type: "bullets",
              content: [
                "Prevention starts with awareness",
                "Have specific, concrete plans",
                "Build accountability into your plan",
                "Know your warning signs",
              ],
            },
          ],
        },
        {
          id: "s14-wrapup",
          type: "wrapUp",
          title: "Wrap-Up & Homework",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s14-wrap-1",
              type: "callout",
              label: "Homework",
              content: "Complete your personal relapse prevention plan. Share it with at least one supportive person.",
            },
          ],
        },
      ],
      participantPrompts: [
        { id: "s14-p1", prompt: "What is your earliest warning sign of relapse?", type: "reflection" },
        { id: "s14-p2", prompt: "Who are the 3 people on your crisis call list?", type: "action" },
      ],
    },
    {
      id: "session-15",
      number: 15,
      title: "Family & Relationships in Recovery",
      overview: "Rebuilding trust, setting boundaries, and navigating family dynamics in recovery.",
      totalDuration: 75,
      workbookPages: "pp. 103-110",
      homework: "Write a letter (send or not) to someone affected by your use",
      sections: [
        {
          id: "s15-objectives",
          type: "objectives",
          title: "Session Objectives",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s15-obj-1",
              type: "bullets",
              content: [
                "Understand how addiction affects family systems",
                "Learn strategies for rebuilding trust",
                "Develop healthy communication skills",
              ],
            },
          ],
        },
        {
          id: "s15-core",
          type: "coreConcept",
          title: "Core Concept: Trust Takes Time",
          duration: 15,
          completed: false,
          blocks: [
            {
              id: "s15-core-1",
              type: "paragraph",
              content:
                "Addiction affects everyone in the family system. Trust was broken over time and will be rebuilt over time. Actions speak louder than words.",
            },
            {
              id: "s15-core-2",
              type: "bullets",
              label: "Rebuilding Trust",
              content: [
                "Consistency over time",
                "Accountability without defensiveness",
                "Following through on commitments",
                "Honest communication",
                "Respecting others' timeline for healing",
              ],
            },
          ],
        },
        {
          id: "s15-facilitator",
          type: "facilitatorTalkingPoints",
          title: "Facilitator Talking Points",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s15-fac-1",
              type: "callout",
              facilitatorOnly: true,
              content:
                "Some participants may have no family support or may have caused significant harm. Validate their feelings while focusing on what they CAN control.",
            },
          ],
        },
        {
          id: "s15-exercises",
          type: "exercises",
          title: "Exercises & Discussion",
          duration: 30,
          completed: false,
          blocks: [
            {
              id: "s15-ex-1",
              type: "steps",
              label: "Relationship Repair",
              content: [
                "List relationships affected by your substance use",
                "Identify one relationship to prioritize",
                "What specific actions can demonstrate your change?",
                "Practice 'I' statements for difficult conversations",
              ],
            },
          ],
        },
        {
          id: "s15-takeaways",
          type: "participantTakeaways",
          title: "Participant Takeaways",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s15-take-1",
              type: "bullets",
              content: [
                "Trust is rebuilt through consistent action over time",
                "You can't control others' responses, only your behavior",
                "Some relationships may not be repairable - and that's okay",
                "New, healthy relationships are possible",
              ],
            },
          ],
        },
        {
          id: "s15-wrapup",
          type: "wrapUp",
          title: "Wrap-Up & Homework",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s15-wrap-1",
              type: "callout",
              label: "Homework",
              content:
                "Write a letter to someone affected by your substance use. You don't have to send it - this is for your own processing.",
            },
          ],
        },
      ],
      participantPrompts: [
        { id: "s15-p1", prompt: "Which relationship do you most want to repair?", type: "reflection" },
      ],
    },
    {
      id: "session-16",
      number: 16,
      title: "Looking Forward: Continuing the Journey",
      overview: "Celebrating progress, reinforcing gains, and planning for ongoing recovery after the program.",
      totalDuration: 75,
      workbookPages: "pp. 111-116",
      homework: "Create 6-month and 1-year recovery vision",
      sections: [
        {
          id: "s16-objectives",
          type: "objectives",
          title: "Session Objectives",
          duration: 5,
          completed: false,
          blocks: [
            {
              id: "s16-obj-1",
              type: "bullets",
              content: [
                "Celebrate progress made during the program",
                "Consolidate learning and key strategies",
                "Create a plan for continuing growth after the program",
              ],
            },
          ],
        },
        {
          id: "s16-core",
          type: "coreConcept",
          title: "Core Concept: Recovery is a Lifelong Journey",
          duration: 15,
          completed: false,
          blocks: [
            {
              id: "s16-core-1",
              type: "paragraph",
              content:
                "This program is ending, but your recovery journey continues. You now have tools, strategies, and self-awareness that you didn't have before. The key is continuing to use them.",
            },
            {
              id: "s16-core-2",
              type: "bullets",
              label: "Continuing Your Journey",
              content: [
                "Stay connected to supportive people",
                "Continue using the skills you've learned",
                "Know when to seek additional help",
                "Celebrate milestones along the way",
                "Give back when you're ready",
              ],
            },
          ],
        },
        {
          id: "s16-facilitator",
          type: "facilitatorTalkingPoints",
          title: "Facilitator Talking Points",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s16-fac-1",
              type: "script",
              facilitatorOnly: true,
              content:
                "Today is about celebration AND preparation. We're honoring the work you've done while making sure you have a plan for what comes next.",
            },
            {
              id: "s16-fac-2",
              type: "callout",
              facilitatorOnly: true,
              content:
                "This is an emotional session. Allow space for reflection. Some may feel anxious about the program ending - validate this while reinforcing their capability.",
            },
          ],
        },
        {
          id: "s16-exercises",
          type: "exercises",
          title: "Exercises & Discussion",
          duration: 30,
          completed: false,
          blocks: [
            {
              id: "s16-ex-1",
              type: "steps",
              label: "Looking Back, Looking Forward",
              content: [
                "Share one thing you learned about yourself in this program",
                "What strategy has been most helpful?",
                "What are you most proud of?",
                "What's your vision for 6 months from now? 1 year?",
              ],
            },
            {
              id: "s16-ex-2",
              type: "paragraph",
              label: "Group Celebration",
              content:
                "Take turns acknowledging each group member's growth. What have you noticed and appreciated about each person's journey?",
            },
          ],
        },
        {
          id: "s16-takeaways",
          type: "participantTakeaways",
          title: "Participant Takeaways",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s16-take-1",
              type: "bullets",
              content: [
                "You have more skills now than when you started",
                "Recovery is ongoing, not a destination",
                "Setbacks can happen - you know how to respond",
                "You are capable of building the life you want",
                "Connection and support remain essential",
              ],
            },
          ],
        },
        {
          id: "s16-wrapup",
          type: "wrapUp",
          title: "Wrap-Up & Closing",
          duration: 10,
          completed: false,
          blocks: [
            {
              id: "s16-wrap-1",
              type: "paragraph",
              label: "Final Reflection",
              content:
                "Write down one commitment you're making to yourself as you continue your journey. Keep it somewhere you'll see it.",
            },
            {
              id: "s16-wrap-2",
              type: "callout",
              label: "Final Homework",
              content:
                "Create your 6-month and 1-year recovery vision. What does your life look like? What have you accomplished? Who is in your life?",
            },
          ],
        },
      ],
      participantPrompts: [
        { id: "s16-p1", prompt: "What are you most proud of from this program?", type: "reflection" },
        { id: "s16-p2", prompt: "What is your commitment to yourself going forward?", type: "action" },
      ],
    },
  ],
}
