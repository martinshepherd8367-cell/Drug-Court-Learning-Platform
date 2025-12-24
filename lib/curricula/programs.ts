import type { Program } from "../types";
import { dbt48WeekProgram } from "./dbt-data";
import { catSessions, codaSessions, relapsePreventionSessions, angerManagementSessions } from "./local-curricula";

export const curriculaPrograms: Program[] = [
  {
    id: "prime-solutions",
    slug: "prime-solutions",
    name: "Prime Solutions",
    description:
      "A comprehensive program designed to help participants reach their treatment goals through structured sessions focusing on change, recovery, and personal growth.",
    totalSessions: 16,
    isLocked: false,
    sessions: [
      {
        id: "prime-1",
        programId: "prime-solutions",
        sessionNumber: 1,
        title: "Understanding Change & Treatment Goals",
        purpose: "Introduce Prime Solutions model and identify personal goals for treatment.",
        objectives: [
          "Recognize change as a process, not an event",
          "Identify their readiness for change",
          "Define one short-term and one long-term goal for recovery",
        ],
        facilitatorPrompts: [
          {
            id: "fp-1-1",
            section: "overview",
            content: "Welcome participants and introduce the Prime Solutions model (phases 1-4: Low Risk → Addiction)",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-1-2",
            section: "opening",
            content:
              'Opening mindfulness: "Recovery is a process of learning who you are and where you\'re headed. The first step is understanding your current stage of change."',
            suggestedPacing: "5 min",
          },
          {
            id: "fp-1-3",
            section: "review",
            content:
              'For Session 1, ask: "What brought you to treatment?" and "What does change mean to you right now?"',
            suggestedPacing: "10 min",
          },
          {
            id: "fp-1-4",
            section: "teach",
            content:
              "Cover the Four Phases: Phase 1 (Low-Risk Choices), Phase 2 (High-Risk Choices), Phase 3 (Psychological Dependence), Phase 4 (Addiction). Use the Alice in Wonderland quote about choosing paths.",
            suggestedPacing: "20 min",
          },
          {
            id: "fp-1-5",
            section: "activity",
            content:
              "Activity: My First Action Plan (p. 17) - Have participants identify their most immediate treatment goal and steps to reach it.",
            suggestedPacing: "15 min",
          },
          {
            id: "fp-1-6",
            section: "wrapup",
            content:
              'Preview Session 2: "How People Make Changes: The Stages of Change" - We\'ll explore the stages from "No Way" to "The New Me"',
            suggestedPacing: "5 min",
          },
        ],
        activityTemplates: [
          {
            id: "act-1-1",
            type: "prompt",
            title: "My First Action Plan",
            instructions:
              "Think about your most immediate treatment goal. What do you need to do to make sure you come to your next treatment session?",
            questions: [
              { id: "q-1-1", text: "What is your most immediate treatment goal?", type: "text" },
              { id: "q-1-2", text: "List 2-3 steps you will take to reach this goal:", type: "text" },
              { id: "q-1-3", text: "What obstacles might you face?", type: "text" },
            ],
          },
        ],
        homeworkTemplate: {
          id: "hw-1",
          title: "My First Action Plan",
          steps: [
            "Complete the Action Plan worksheet on page 17",
            "Identify one barrier to attending your next session",
            "Write down one person who can support your recovery",
          ],
          dueDescription: "Before Session 2",
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate:
          "Session 1: Understanding Change & Treatment Goals\n\nParticipant engaged in discussion about stages of change. Completed My First Action Plan activity. Goals identified: [INSERT GOALS]. Barriers discussed: [INSERT BARRIERS]. Homework assigned: Complete Action Plan worksheet.\n\nFacilitator Notes:\n[INSERT NOTES]",
      },
      {
        id: "prime-2",
        programId: "prime-solutions",
        sessionNumber: 2,
        title: "How People Make Changes: The Stages of Change",
        purpose: "Help participants identify their personal stage of change and understand ambivalence.",
        objectives: [
          'Understand the stages from "No Way, Not Now" to "The New Me"',
          "Identify personal stage of change",
          "Discuss ambivalence and resistance",
        ],
        facilitatorPrompts: [
          {
            id: "fp-2-1",
            section: "overview",
            content: "Review the Stages of Change model (pp. 18-20)",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-2-2",
            section: "opening",
            content: "Check-in: How did completing the Action Plan go?",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-2-3",
            section: "review",
            content: "Review homework: Action Plan completion and barriers identified",
            suggestedPacing: "10 min",
          },
          {
            id: "fp-2-4",
            section: "teach",
            content:
              "Teach the five stages: Precontemplation, Contemplation, Preparation, Action, Maintenance. Normalize ambivalence.",
            suggestedPacing: "20 min",
          },
          {
            id: "fp-2-5",
            section: "activity",
            content:
              "Activity: \"Hey, I've Done This Before!\" (p. 21) - Reflect on past changes they've successfully made.",
            suggestedPacing: "15 min",
          },
          {
            id: "fp-2-6",
            section: "wrapup",
            content: "Preview Session 3: Learning from the Past - analyzing relapse and reframing setbacks",
            suggestedPacing: "5 min",
          },
        ],
        activityTemplates: [
          {
            id: "act-2-1",
            type: "prompt",
            title: "Hey, I've Done This Before!",
            instructions:
              "Think about a time when you successfully made a change in your life. What helped you succeed?",
            questions: [
              { id: "q-2-1", text: "Describe a change you successfully made in the past:", type: "text" },
              {
                id: "q-2-2",
                text: "What stage of change are you in right now?",
                type: "multiple_choice",
                options: ["Precontemplation", "Contemplation", "Preparation", "Action", "Maintenance"],
              },
              { id: "q-2-3", text: "What helped you succeed in making that past change?", type: "text" },
            ],
          },
        ],
        homeworkTemplate: {
          id: "hw-2",
          title: "Stages of Change Reflection",
          steps: [
            "Review pages 18-21 in your workbook",
            "Identify which stage of change you are in",
            "Write about one thing that creates ambivalence for you",
          ],
          dueDescription: "Before Session 3",
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate:
          "Session 2: Stages of Change\n\nParticipant identified current stage: [INSERT STAGE]. Discussed past successful changes and what helped. Ambivalence areas: [INSERT]. Homework: Stages reflection.\n\nFacilitator Notes:\n[INSERT NOTES]",
      },
      {
        id: "prime-3",
        programId: "prime-solutions",
        sessionNumber: 3,
        title: "Learning from the Past",
        purpose: "Analyze past relapse or failure experiences and reframe setbacks as learning opportunities.",
        objectives: [
          "Analyze past relapse or failure experiences",
          "Identify barriers and supports",
          "Reframe setbacks as learning opportunities",
        ],
        facilitatorPrompts: [
          {
            id: "fp-3-1",
            section: "overview",
            content: "Frame setbacks as data, not failures",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-3-2",
            section: "opening",
            content: 'Mindfulness: "Every setback carries a lesson if we\'re willing to look"',
            suggestedPacing: "5 min",
          },
          {
            id: "fp-3-3",
            section: "review",
            content: "Review stages of change homework and ambivalence discussions",
            suggestedPacing: "10 min",
          },
          {
            id: "fp-3-4",
            section: "teach",
            content:
              'Teach the concept of "relapse as teacher" - what triggers, warning signs, and patterns can we identify?',
            suggestedPacing: "20 min",
          },
          {
            id: "fp-3-5",
            section: "activity",
            content: 'Activity: "Rewinding My Game Tape" (p. 24) - Analyze a past setback step by step',
            suggestedPacing: "15 min",
          },
          {
            id: "fp-3-6",
            section: "wrapup",
            content: "Preview Session 4: Staging My Treatment Plan - connecting goals to stages",
            suggestedPacing: "5 min",
          },
        ],
        activityTemplates: [
          {
            id: "act-3-1",
            type: "worksheet",
            title: "Rewinding My Game Tape",
            instructions:
              "Think about a recent setback or relapse. Let's rewind and examine what happened step by step.",
            questions: [
              { id: "q-3-1", text: "What was the situation before the setback?", type: "text" },
              { id: "q-3-2", text: "What warning signs did you notice (or miss)?", type: "text" },
              { id: "q-3-3", text: "What triggered the setback?", type: "text" },
              { id: "q-3-4", text: "What could you do differently next time?", type: "text" },
            ],
          },
        ],
        homeworkTemplate: {
          id: "hw-3",
          title: "Learning from Setbacks",
          steps: [
            "Complete the Game Tape worksheet (p. 24)",
            "Identify your top 3 triggers",
            "List one person who can help when you feel triggered",
          ],
          dueDescription: "Before Session 4",
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate:
          "Session 3: Learning from the Past\n\nParticipant analyzed past setback using Game Tape activity. Triggers identified: [INSERT]. Warning signs: [INSERT]. Support person identified: [INSERT].\n\nFacilitator Notes:\n[INSERT NOTES]",
      },
      {
        id: "prime-4",
        programId: "prime-solutions",
        sessionNumber: 4,
        title: "Staging My Treatment Plan",
        purpose: "Connect personal goals to the stage model and explore multiple life domains.",
        objectives: [
          "Connect goals to the stage model",
          "Explore multiple domains: substance use, legal, social",
          "Create a staged treatment plan",
        ],
        facilitatorPrompts: [
          {
            id: "fp-4-1",
            section: "overview",
            content: "Review how stages connect to goal-setting",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-4-2",
            section: "opening",
            content: "Check-in on trigger identification from homework",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-4-3",
            section: "review",
            content: "Review Game Tape homework - what patterns emerged?",
            suggestedPacing: "10 min",
          },
          {
            id: "fp-4-4",
            section: "teach",
            content:
              "Teach about life domains affected by substance use: relationships, work, legal, health, finances, self-respect",
            suggestedPacing: "20 min",
          },
          {
            id: "fp-4-5",
            section: "activity",
            content: "Activity: Create a Staged Treatment Plan addressing at least 3 domains",
            suggestedPacing: "15 min",
          },
          {
            id: "fp-4-6",
            section: "wrapup",
            content: "Preview Session 5: Dealing with Cravings",
            suggestedPacing: "5 min",
          },
        ],
        activityTemplates: [
          {
            id: "act-4-1",
            type: "worksheet",
            title: "My Staged Treatment Plan",
            instructions: "Create goals for at least 3 life domains, matched to your current stage of change.",
            questions: [
              { id: "q-4-1", text: "Domain 1 (e.g., Substance Use) - Goal:", type: "text" },
              { id: "q-4-2", text: "Domain 2 (e.g., Legal) - Goal:", type: "text" },
              { id: "q-4-3", text: "Domain 3 (e.g., Relationships) - Goal:", type: "text" },
              { id: "q-4-4", text: "What stage of change are you in for each domain?", type: "text" },
            ],
          },
        ],
        homeworkTemplate: {
          id: "hw-4",
          title: "Complete Treatment Plan",
          steps: [
            "Finalize your Staged Treatment Plan",
            "Add at least one action step per domain",
            "Share your plan with a support person",
          ],
          dueDescription: "Before Session 5",
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate:
          "Session 4: Staging My Treatment Plan\n\nParticipant created staged treatment plan. Domains addressed: [INSERT]. Stage alignment: [INSERT]. Action steps identified.\n\nFacilitator Notes:\n[INSERT NOTES]",
      },
      {
        id: "prime-5",
        programId: "prime-solutions",
        sessionNumber: 5,
        title: "Dealing with Cravings",
        purpose: "Learn to recognize, understand, and manage cravings effectively.",
        objectives: [
          "Understand the nature of cravings",
          "Learn craving management techniques",
          "Develop a personal craving action plan",
        ],
        facilitatorPrompts: [
          {
            id: "fp-5-1",
            section: "overview",
            content: "Normalize cravings as part of recovery",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-5-2",
            section: "opening",
            content: "Mindfulness exercise focused on urge surfing",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-5-3",
            section: "review",
            content: "Review treatment plans and progress on domains",
            suggestedPacing: "10 min",
          },
          {
            id: "fp-5-4",
            section: "teach",
            content:
              "Teach craving anatomy: triggers, peak intensity, natural decline. Introduce HALT (Hungry, Angry, Lonely, Tired)",
            suggestedPacing: "20 min",
          },
          {
            id: "fp-5-5",
            section: "activity",
            content: "Activity: Create a Craving Action Plan with specific coping strategies",
            suggestedPacing: "15 min",
          },
          { id: "fp-5-6", section: "wrapup", content: "Preview Session 6: Problem Solving", suggestedPacing: "5 min" },
        ],
        activityTemplates: [
          {
            id: "act-5-1",
            type: "worksheet",
            title: "My Craving Action Plan",
            instructions: "Develop strategies to manage cravings when they arise.",
            questions: [
              { id: "q-5-1", text: "What are your top 3 craving triggers?", type: "text" },
              { id: "q-5-2", text: "On a scale of 1-10, how intense are your typical cravings?", type: "scale" },
              { id: "q-5-3", text: "List 3 healthy activities you can do when a craving hits:", type: "text" },
              { id: "q-5-4", text: "Who can you call when you have a strong craving?", type: "text" },
            ],
          },
        ],
        homeworkTemplate: {
          id: "hw-5",
          title: "Craving Log",
          steps: [
            "Track cravings this week using the HALT checklist",
            "Practice one urge surfing technique daily",
            "Use your Craving Action Plan at least once",
          ],
          dueDescription: "Before Session 6",
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate:
          "Session 5: Dealing with Cravings\n\nParticipant developed Craving Action Plan. Triggers: [INSERT]. Coping strategies: [INSERT]. Support contacts identified.\n\nFacilitator Notes:\n[INSERT NOTES]",
      },
      {
        id: "prime-6",
        programId: "prime-solutions",
        sessionNumber: 6,
        title: "Problem Solving",
        purpose: "Develop effective problem-solving skills for recovery challenges.",
        objectives: [
          "Learn a structured problem-solving approach",
          "Apply problem-solving to a current challenge",
          "Identify resources and support",
        ],
        facilitatorPrompts: [
          {
            id: "fp-6-1",
            section: "overview",
            content: "Introduce the 5-step problem-solving model",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-6-2",
            section: "opening",
            content: "Check-in on craving management experiences",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-6-3",
            section: "review",
            content: "Review craving logs and what worked/didn't work",
            suggestedPacing: "10 min",
          },
          {
            id: "fp-6-4",
            section: "teach",
            content: "Teach 5 steps: Define, Brainstorm, Evaluate, Choose, Act. Emphasize not skipping steps.",
            suggestedPacing: "20 min",
          },
          {
            id: "fp-6-5",
            section: "activity",
            content: "Activity: Apply problem-solving to a current real-life challenge",
            suggestedPacing: "15 min",
          },
          {
            id: "fp-6-6",
            section: "wrapup",
            content: "Preview Session 7: Managing Feelings",
            suggestedPacing: "5 min",
          },
        ],
        activityTemplates: [
          {
            id: "act-6-1",
            type: "worksheet",
            title: "Problem-Solving Worksheet",
            instructions: "Apply the 5-step model to a current challenge in your life.",
            questions: [
              { id: "q-6-1", text: "Step 1 - Define: What is the problem?", type: "text" },
              { id: "q-6-2", text: "Step 2 - Brainstorm: List at least 3 possible solutions:", type: "text" },
              { id: "q-6-3", text: "Step 3 - Evaluate: What are pros/cons of each?", type: "text" },
              { id: "q-6-4", text: "Step 4 - Choose: Which solution will you try?", type: "text" },
              { id: "q-6-5", text: "Step 5 - Act: What is your first action step?", type: "text" },
            ],
          },
        ],
        homeworkTemplate: {
          id: "hw-6",
          title: "Problem-Solving Practice",
          steps: [
            "Use the 5-step model on one problem this week",
            "Write down the outcome",
            "Identify what you would do differently",
          ],
          dueDescription: "Before Session 7",
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate:
          "Session 6: Problem Solving\n\nParticipant applied 5-step model to: [INSERT PROBLEM]. Solution chosen: [INSERT]. First action step: [INSERT].\n\nFacilitator Notes:\n[INSERT NOTES]",
      },
      {
        id: "prime-7",
        programId: "prime-solutions",
        sessionNumber: 7,
        title: "Managing Feelings",
        purpose: "Develop emotional awareness and healthy coping strategies.",
        objectives: [
          "Identify and name emotions accurately",
          "Understand the connection between feelings and behavior",
          "Learn healthy emotional coping strategies",
        ],
        facilitatorPrompts: [
          {
            id: "fp-7-1",
            section: "overview",
            content: "Introduce the feelings-behavior connection",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-7-2",
            section: "opening",
            content: "Feelings check-in: Name your current emotion",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-7-3",
            section: "review",
            content: "Review problem-solving homework outcomes",
            suggestedPacing: "10 min",
          },
          {
            id: "fp-7-4",
            section: "teach",
            content:
              "Teach emotional vocabulary, the feelings wheel, and how stuffing/exploding feelings leads to problems",
            suggestedPacing: "20 min",
          },
          {
            id: "fp-7-5",
            section: "activity",
            content: "Activity: Feelings journal and healthy coping menu",
            suggestedPacing: "15 min",
          },
          {
            id: "fp-7-6",
            section: "wrapup",
            content: "Preview Session 8: Communication Skills",
            suggestedPacing: "5 min",
          },
        ],
        activityTemplates: [
          {
            id: "act-7-1",
            type: "worksheet",
            title: "My Feelings & Coping Menu",
            instructions: "Identify your common feelings and healthy ways to cope with each.",
            questions: [
              { id: "q-7-1", text: "What emotion do you struggle with most?", type: "text" },
              { id: "q-7-2", text: "How do you usually cope with difficult feelings? (Be honest)", type: "text" },
              { id: "q-7-3", text: "List 3 healthy coping strategies you can try:", type: "text" },
              { id: "q-7-4", text: "Who can you talk to when feelings are overwhelming?", type: "text" },
            ],
          },
        ],
        homeworkTemplate: {
          id: "hw-7",
          title: "Feelings Tracker",
          steps: [
            "Track your feelings 3 times daily for one week",
            "Notice what triggers strong emotions",
            "Practice one healthy coping strategy each day",
          ],
          dueDescription: "Before Session 8",
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate:
          "Session 7: Managing Feelings\n\nParticipant identified struggle with: [INSERT EMOTION]. Current coping: [INSERT]. New strategies: [INSERT].\n\nFacilitator Notes:\n[INSERT NOTES]",
      },
      {
        id: "prime-8",
        programId: "prime-solutions",
        sessionNumber: 8,
        title: "Communication Skills",
        purpose: "Develop assertive communication and healthy relationship skills.",
        objectives: [
          "Understand passive, aggressive, and assertive communication",
          'Practice "I" statements',
          "Learn to set healthy boundaries",
        ],
        facilitatorPrompts: [
          {
            id: "fp-8-1",
            section: "overview",
            content: "Introduce the three communication styles",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-8-2",
            section: "opening",
            content: "Reflect on a recent difficult conversation",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-8-3",
            section: "review",
            content: "Review feelings tracker - what patterns emerged?",
            suggestedPacing: "10 min",
          },
          {
            id: "fp-8-4",
            section: "teach",
            content: 'Teach passive/aggressive/assertive styles, "I" statements formula, and boundary-setting',
            suggestedPacing: "20 min",
          },
          {
            id: "fp-8-5",
            section: "activity",
            content: "Activity: Role-play converting aggressive or passive statements to assertive",
            suggestedPacing: "15 min",
          },
          { id: "fp-8-6", section: "wrapup", content: "Preview Session 9: Building Support", suggestedPacing: "5 min" },
        ],
        activityTemplates: [
          {
            id: "act-8-1",
            type: "prompt",
            title: "Assertive Communication Practice",
            instructions: 'Convert these statements to assertive "I" statements.',
            questions: [
              { id: "q-8-1", text: 'Rewrite "You never listen to me!" as an assertive statement:', type: "text" },
              { id: "q-8-2", text: "What boundary do you need to set with someone?", type: "text" },
              { id: "q-8-3", text: 'Write an "I" statement to communicate that boundary:', type: "text" },
            ],
          },
        ],
        homeworkTemplate: {
          id: "hw-8",
          title: "Communication Practice",
          steps: [
            'Use one "I" statement in a real conversation',
            "Notice your default communication style",
            "Practice setting one small boundary",
          ],
          dueDescription: "Before Session 9",
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate:
          'Session 8: Communication Skills\n\nParticipant practiced assertive communication. Boundary identified: [INSERT]. "I" statement practice: [INSERT].\n\nFacilitator Notes:\n[INSERT NOTES]',
      },
      {
        id: "prime-9",
        programId: "prime-solutions",
        sessionNumber: 9,
        title: "Building Support",
        purpose: "Identify and strengthen recovery support network.",
        objectives: ["Map current support network", "Identify gaps in support", "Develop plan to strengthen support"],
        facilitatorPrompts: [
          {
            id: "fp-9-1",
            section: "overview",
            content: "Discuss why support is critical to recovery",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-9-2",
            section: "opening",
            content: "Share one person who has supported your recovery",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-9-3",
            section: "review",
            content: "Review communication homework - how did it go?",
            suggestedPacing: "10 min",
          },
          {
            id: "fp-9-4",
            section: "teach",
            content:
              "Teach about types of support: emotional, practical, recovery-specific. Discuss toxic vs healthy relationships.",
            suggestedPacing: "20 min",
          },
          {
            id: "fp-9-5",
            section: "activity",
            content: "Activity: Create a Support Network Map",
            suggestedPacing: "15 min",
          },
          {
            id: "fp-9-6",
            section: "wrapup",
            content: "Preview Session 10: High-Risk Situations",
            suggestedPacing: "5 min",
          },
        ],
        activityTemplates: [
          {
            id: "act-9-1",
            type: "worksheet",
            title: "My Support Network Map",
            instructions: "Map out your support network and identify gaps.",
            questions: [
              { id: "q-9-1", text: "Who provides emotional support? (List names)", type: "text" },
              { id: "q-9-2", text: "Who provides practical support? (transportation, housing, etc.)", type: "text" },
              { id: "q-9-3", text: "Who supports your recovery specifically?", type: "text" },
              { id: "q-9-4", text: "What type of support do you need more of?", type: "text" },
              { id: "q-9-5", text: "Who might be toxic to your recovery?", type: "text" },
            ],
          },
        ],
        homeworkTemplate: {
          id: "hw-9",
          title: "Strengthen Support",
          steps: [
            "Reach out to one supportive person this week",
            "Attend one recovery meeting or group",
            "Identify one new potential support person",
          ],
          dueDescription: "Before Session 10",
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate:
          "Session 9: Building Support\n\nParticipant mapped support network. Emotional support: [INSERT]. Recovery support: [INSERT]. Gaps identified: [INSERT].\n\nFacilitator Notes:\n[INSERT NOTES]",
      },
      {
        id: "prime-10",
        programId: "prime-solutions",
        sessionNumber: 10,
        title: "High-Risk Situations",
        purpose: "Identify and plan for high-risk situations.",
        objectives: [
          "Identify personal high-risk situations",
          "Develop specific coping plans",
          "Practice refusal skills",
        ],
        facilitatorPrompts: [
          {
            id: "fp-10-1",
            section: "overview",
            content: "Define high-risk situations and why planning matters",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-10-2",
            section: "opening",
            content: "Share one situation that feels risky for your recovery",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-10-3",
            section: "review",
            content: "Review support network homework - did you reach out?",
            suggestedPacing: "10 min",
          },
          {
            id: "fp-10-4",
            section: "teach",
            content:
              'Teach about people, places, things, emotions as risk categories. Introduce the "play the tape forward" technique.',
            suggestedPacing: "20 min",
          },
          {
            id: "fp-10-5",
            section: "activity",
            content: "Activity: High-Risk Situation Action Plan",
            suggestedPacing: "15 min",
          },
          {
            id: "fp-10-6",
            section: "wrapup",
            content: "Preview Session 11: Lifestyle Balance",
            suggestedPacing: "5 min",
          },
        ],
        activityTemplates: [
          {
            id: "act-10-1",
            type: "worksheet",
            title: "High-Risk Action Plan",
            instructions: "Identify your high-risk situations and plan your response.",
            questions: [
              { id: "q-10-1", text: "List your top 3 high-risk situations:", type: "text" },
              { id: "q-10-2", text: "For each situation, what will you do instead?", type: "text" },
              { id: "q-10-3", text: "What will you say if someone offers you substances?", type: "text" },
              { id: "q-10-4", text: "Who will you call if you find yourself in a high-risk situation?", type: "text" },
            ],
          },
        ],
        homeworkTemplate: {
          id: "hw-10",
          title: "Risk Management",
          steps: [
            "Avoid one high-risk situation this week",
            "Practice your refusal statement out loud",
            '"Play the tape forward" when you feel tempted',
          ],
          dueDescription: "Before Session 11",
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate:
          "Session 10: High-Risk Situations\n\nParticipant identified high-risk situations: [INSERT]. Coping plans: [INSERT]. Refusal skill practiced.\n\nFacilitator Notes:\n[INSERT NOTES]",
      },
      {
        id: "prime-11",
        programId: "prime-solutions",
        sessionNumber: 11,
        title: "Lifestyle Balance",
        purpose: "Develop a balanced lifestyle that supports recovery.",
        objectives: [
          "Assess current life balance",
          "Identify areas needing attention",
          "Create a balanced weekly plan",
        ],
        facilitatorPrompts: [
          {
            id: "fp-11-1",
            section: "overview",
            content: "Discuss why balance prevents relapse",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-11-2",
            section: "opening",
            content: "Rate your current life balance 1-10",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-11-3",
            section: "review",
            content: "Review high-risk homework - what situations did you avoid?",
            suggestedPacing: "10 min",
          },
          {
            id: "fp-11-4",
            section: "teach",
            content:
              'Teach about life domains: work, relationships, health, spirituality, recreation, recovery. Discuss "shoulds" vs "wants."',
            suggestedPacing: "20 min",
          },
          {
            id: "fp-11-5",
            section: "activity",
            content: "Activity: Create a Balanced Week Plan",
            suggestedPacing: "15 min",
          },
          {
            id: "fp-11-6",
            section: "wrapup",
            content: "Preview Session 12: Healthy Thinking",
            suggestedPacing: "5 min",
          },
        ],
        activityTemplates: [
          {
            id: "act-11-1",
            type: "worksheet",
            title: "My Balanced Week",
            instructions: "Plan a week that includes all important life areas.",
            questions: [
              { id: "q-11-1", text: "Rate each area 1-10: Work, Relationships, Health, Fun, Recovery", type: "text" },
              { id: "q-11-2", text: "Which area needs the most attention?", type: "text" },
              { id: "q-11-3", text: "What activity will you add this week for that area?", type: "text" },
              { id: "q-11-4", text: "What will you reduce or eliminate to make room?", type: "text" },
            ],
          },
        ],
        homeworkTemplate: {
          id: "hw-11",
          title: "Balance Practice",
          steps: [
            "Follow your balanced week plan",
            "Do one enjoyable activity that is NOT substance-related",
            "Notice how balance affects your mood",
          ],
          dueDescription: "Before Session 12",
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate:
          "Session 11: Lifestyle Balance\n\nParticipant rated life balance: [INSERT]. Area needing attention: [INSERT]. New activity added: [INSERT].\n\nFacilitator Notes:\n[INSERT NOTES]",
      },
      {
        id: "prime-12",
        programId: "prime-solutions",
        sessionNumber: 12,
        title: "Healthy Thinking",
        purpose: "Identify and challenge unhealthy thinking patterns.",
        objectives: [
          "Recognize cognitive distortions",
          "Challenge negative automatic thoughts",
          "Develop healthier thinking patterns",
        ],
        facilitatorPrompts: [
          {
            id: "fp-12-1",
            section: "overview",
            content: "Introduce the concept of cognitive distortions",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-12-2",
            section: "opening",
            content: "Share one negative thought you had this week",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-12-3",
            section: "review",
            content: "Review balanced week homework - how did it feel?",
            suggestedPacing: "10 min",
          },
          {
            id: "fp-12-4",
            section: "teach",
            content:
              "Teach common distortions: all-or-nothing, catastrophizing, mind reading, should statements. Use the ABC model.",
            suggestedPacing: "20 min",
          },
          {
            id: "fp-12-5",
            section: "activity",
            content: "Activity: Thought Record - catch and challenge a distortion",
            suggestedPacing: "15 min",
          },
          {
            id: "fp-12-6",
            section: "wrapup",
            content: "Preview Session 13: Values and Purpose",
            suggestedPacing: "5 min",
          },
        ],
        activityTemplates: [
          {
            id: "act-12-1",
            type: "worksheet",
            title: "Thought Record",
            instructions: "Catch a negative thought and challenge it.",
            questions: [
              { id: "q-12-1", text: "What was the situation?", type: "text" },
              { id: "q-12-2", text: "What thought went through your mind?", type: "text" },
              {
                id: "q-12-3",
                text: "What cognitive distortion might this be?",
                type: "multiple_choice",
                options: ["All-or-Nothing", "Catastrophizing", "Mind Reading", "Should Statements", "Other"],
              },
              { id: "q-12-4", text: "What is a more balanced thought?", type: "text" },
            ],
          },
        ],
        homeworkTemplate: {
          id: "hw-12",
          title: "Thought Tracking",
          steps: [
            "Complete 3 thought records this week",
            "Notice your most common distortion",
            "Practice replacing with balanced thoughts",
          ],
          dueDescription: "Before Session 13",
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate:
          "Session 12: Healthy Thinking\n\nParticipant identified distortion pattern: [INSERT]. Practiced challenging thoughts using ABC model.\n\nFacilitator Notes:\n[INSERT NOTES]",
      },
      {
        id: "prime-13",
        programId: "prime-solutions",
        sessionNumber: 13,
        title: "Values and Purpose",
        purpose: "Clarify personal values and connect recovery to purpose.",
        objectives: [
          "Identify core personal values",
          "Connect values to recovery motivation",
          "Create a values-based action plan",
        ],
        facilitatorPrompts: [
          {
            id: "fp-13-1",
            section: "overview",
            content: "Discuss how values guide decisions",
            suggestedPacing: "5 min",
          },
          { id: "fp-13-2", section: "opening", content: "What matters most to you in life?", suggestedPacing: "5 min" },
          {
            id: "fp-13-3",
            section: "review",
            content: "Review thought records - what patterns emerged?",
            suggestedPacing: "10 min",
          },
          {
            id: "fp-13-4",
            section: "teach",
            content: "Teach about values vs goals, values card sort process, living in alignment",
            suggestedPacing: "20 min",
          },
          {
            id: "fp-13-5",
            section: "activity",
            content: "Activity: Values Clarification and Action Plan",
            suggestedPacing: "15 min",
          },
          {
            id: "fp-13-6",
            section: "wrapup",
            content: "Preview Session 14: Relapse Prevention Planning",
            suggestedPacing: "5 min",
          },
        ],
        activityTemplates: [
          {
            id: "act-13-1",
            type: "worksheet",
            title: "My Core Values",
            instructions: "Identify your top values and how to live them.",
            questions: [
              { id: "q-13-1", text: "List your top 5 values (family, honesty, health, freedom, etc.):", type: "text" },
              { id: "q-13-2", text: "How does your substance use conflict with these values?", type: "text" },
              { id: "q-13-3", text: "How does recovery align with your values?", type: "text" },
              { id: "q-13-4", text: "What is one action you can take this week to live your #1 value?", type: "text" },
            ],
          },
        ],
        homeworkTemplate: {
          id: "hw-13",
          title: "Values in Action",
          steps: [
            "Take one action aligned with your top value",
            "Notice when your choices align or conflict with values",
            "Write about how it felt to act on your values",
          ],
          dueDescription: "Before Session 14",
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate:
          "Session 13: Values and Purpose\n\nParticipant identified core values: [INSERT]. Value-recovery connection: [INSERT]. Action plan: [INSERT].\n\nFacilitator Notes:\n[INSERT NOTES]",
      },
      {
        id: "prime-14",
        programId: "prime-solutions",
        sessionNumber: 14,
        title: "Relapse Prevention Planning",
        purpose: "Create a comprehensive relapse prevention plan.",
        objectives: [
          "Review all learned skills",
          "Identify personal warning signs",
          "Create a written relapse prevention plan",
        ],
        facilitatorPrompts: [
          {
            id: "fp-14-1",
            section: "overview",
            content: "Frame relapse prevention as ongoing, not one-time",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-14-2",
            section: "opening",
            content: "What skill from this program has helped you most?",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-14-3",
            section: "review",
            content: "Review values homework and living in alignment",
            suggestedPacing: "10 min",
          },
          {
            id: "fp-14-4",
            section: "teach",
            content:
              "Review all program skills: stages of change, triggers, cravings, problem-solving, feelings, communication, support, high-risk situations, balance, thinking, values",
            suggestedPacing: "20 min",
          },
          {
            id: "fp-14-5",
            section: "activity",
            content: "Activity: Complete Relapse Prevention Plan",
            suggestedPacing: "15 min",
          },
          {
            id: "fp-14-6",
            section: "wrapup",
            content: "Preview Session 15: Strengthening Recovery",
            suggestedPacing: "5 min",
          },
        ],
        activityTemplates: [
          {
            id: "act-14-1",
            type: "worksheet",
            title: "My Relapse Prevention Plan",
            instructions: "Create your comprehensive plan for maintaining recovery.",
            questions: [
              { id: "q-14-1", text: "My personal warning signs are:", type: "text" },
              { id: "q-14-2", text: "My high-risk situations are:", type: "text" },
              { id: "q-14-3", text: "My coping strategies include:", type: "text" },
              { id: "q-14-4", text: "My support people are:", type: "text" },
              { id: "q-14-5", text: "If I slip, I will:", type: "text" },
            ],
          },
        ],
        homeworkTemplate: {
          id: "hw-14",
          title: "Finalize Prevention Plan",
          steps: [
            "Complete your full Relapse Prevention Plan",
            "Share it with your support person",
            "Post warning signs somewhere visible",
          ],
          dueDescription: "Before Session 15",
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate:
          "Session 14: Relapse Prevention Planning\n\nParticipant created comprehensive RP plan. Warning signs: [INSERT]. Support people: [INSERT]. Plan shared with: [INSERT].\n\nFacilitator Notes:\n[INSERT NOTES]",
      },
      {
        id: "prime-15",
        programId: "prime-solutions",
        sessionNumber: 15,
        title: "Strengthening Recovery",
        purpose: "Build on progress and address remaining challenges.",
        objectives: [
          "Assess progress in treatment",
          "Identify ongoing challenges",
          "Strengthen weak areas of recovery plan",
        ],
        facilitatorPrompts: [
          {
            id: "fp-15-1",
            section: "overview",
            content: "Celebrate progress while staying vigilant",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-15-2",
            section: "opening",
            content: "What are you most proud of from this program?",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-15-3",
            section: "review",
            content: "Review relapse prevention plans - share with group",
            suggestedPacing: "10 min",
          },
          {
            id: "fp-15-4",
            section: "teach",
            content: "Discuss ongoing recovery: meetings, sponsors, therapy, lifestyle changes. Address complacency.",
            suggestedPacing: "20 min",
          },
          {
            id: "fp-15-5",
            section: "activity",
            content: "Activity: Identify and strengthen one weak area",
            suggestedPacing: "15 min",
          },
          {
            id: "fp-15-6",
            section: "wrapup",
            content: "Preview Session 16: Looking Forward (Final Session)",
            suggestedPacing: "5 min",
          },
        ],
        activityTemplates: [
          {
            id: "act-15-1",
            type: "prompt",
            title: "Strengthening My Recovery",
            instructions: "Identify and address your remaining challenges.",
            questions: [
              { id: "q-15-1", text: "What aspect of recovery is still challenging?", type: "text" },
              { id: "q-15-2", text: "What resource or skill do you need to strengthen?", type: "text" },
              { id: "q-15-3", text: "What specific action will you take to address this?", type: "text" },
            ],
          },
        ],
        homeworkTemplate: {
          id: "hw-15",
          title: "Strengthen Weak Areas",
          steps: [
            "Work on your identified challenge area",
            "Connect with a recovery support (meeting, sponsor, etc.)",
            "Prepare your thoughts for the final session",
          ],
          dueDescription: "Before Session 16",
        },
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate:
          "Session 15: Strengthening Recovery\n\nParticipant identified challenge: [INSERT]. Action plan to strengthen: [INSERT]. Recovery supports: [INSERT].\n\nFacilitator Notes:\n[INSERT NOTES]",
      },
      {
        id: "prime-16",
        programId: "prime-solutions",
        sessionNumber: 16,
        title: "Looking Forward",
        purpose: "Celebrate completion and plan for continued recovery.",
        objectives: [
          "Review journey through the program",
          "Celebrate accomplishments",
          "Set goals for continued recovery",
        ],
        facilitatorPrompts: [
          {
            id: "fp-16-1",
            section: "overview",
            content: "This is a celebration and a beginning",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-16-2",
            section: "opening",
            content: "Share one word that describes your journey",
            suggestedPacing: "5 min",
          },
          {
            id: "fp-16-3",
            section: "review",
            content: "Review: What brought you here? Where are you now?",
            suggestedPacing: "10 min",
          },
          {
            id: "fp-16-4",
            section: "teach",
            content: "Discuss transition: What comes next? Aftercare planning. The importance of continued connection.",
            suggestedPacing: "20 min",
          },
          {
            id: "fp-16-5",
            section: "activity",
            content: "Activity: Letter to Future Self + Certificate of Completion",
            suggestedPacing: "15 min",
          },
          {
            id: "fp-16-6",
            section: "wrapup",
            content: "Closing ceremony - acknowledgment and encouragement",
            suggestedPacing: "5 min",
          },
        ],
        activityTemplates: [
          {
            id: "act-16-1",
            type: "prompt",
            title: "Letter to My Future Self",
            instructions: "Write a letter to yourself to read in 6 months.",
            questions: [
              { id: "q-16-1", text: "Dear Future Me, I want you to remember...", type: "text" },
              { id: "q-16-2", text: "The most important thing I learned is...", type: "text" },
              { id: "q-16-3", text: "My goals for the next 6 months are...", type: "text" },
              { id: "q-16-4", text: "If you are struggling, please remember...", type: "text" },
            ],
          },
        ],
        homeworkTemplate: null,
        journalTemplateId: "journal-reflection",
        caseworxNoteTemplate:
          "Session 16: Looking Forward (PROGRAM COMPLETION)\n\nParticipant completed Prime Solutions program. Key learnings: [INSERT]. Aftercare plan: [INSERT]. Goals for continued recovery: [INSERT].\n\nFacilitator Notes:\n[INSERT NOTES]\n\nProgram Completion Date: [DATE]",
      },
    ],
  },
  {
    id: "cat-program",
    slug: "cat",
    name: "CAT (Criminal and Addictive Thinking)",
    description:
      "Cognitive behavioral approach focusing on criminal thinking patterns and their connection to addictive behavior.",
    totalSessions: 9,
    isLocked: false,
    sessions: catSessions,
  },
  {
    id: "relapse-prevention",
    slug: "relapse-prevention",
    name: "Relapse Prevention",
    description:
      "Focused program on identifying triggers, warning signs, and building sustainable recovery strategies.",
    totalSessions: 9,
    isLocked: false,
    sessions: relapsePreventionSessions,
  },
  {
    id: "anger-management",
    slug: "anger-management",
    name: "Anger Management",
    description: "Learn to recognize anger triggers and develop healthy coping strategies.",
    totalSessions: 12,
    isLocked: false,
    sessions: angerManagementSessions,
  },
  {
    id: "dbt-skills",
    slug: "dbt-skills",
    name: "DBT Skills",
    description:
      "Dialectical Behavior Therapy skills training for emotional regulation and interpersonal effectiveness.",
    totalSessions: 48,
    isLocked: false,
    sessions: dbt48WeekProgram.weeks.map((week) => {
      const sessionNum = week.weekNumber;
      return {
        id: `dbt-session-${sessionNum}`,
        programId: "dbt-skills",
        sessionNumber: sessionNum,
        title: week.title,
        purpose: week.sessionPurpose,
        objectives: ["Understand key concepts", "Practice skills", "Reflect on progress"],
        facilitatorPrompts: [
          {
            id: `fp-dbt-${sessionNum}-1`,
            section: "overview",
            content: `Session Purpose: ${week.sessionPurpose}`,
            suggestedPacing: "5 min",
          },
          {
            id: `fp-dbt-${sessionNum}-2`,
            section: "opening",
            content: dbt48WeekProgram.standardSessionFlow.opening,
            suggestedPacing: "5 min",
          },
          {
            id: `fp-dbt-${sessionNum}-3`,
            section: "review",
            content: dbt48WeekProgram.standardSessionFlow.review,
            suggestedPacing: "10 min",
          },
          {
            id: `fp-dbt-${sessionNum}-4`,
            section: "teach",
            content: `${dbt48WeekProgram.standardSessionFlow.teach}\n\nFocus: ${week.title}`,
            suggestedPacing: "20 min",
          },
          {
            id: `fp-dbt-${sessionNum}-5`,
            section: "activity",
            content: `${dbt48WeekProgram.standardSessionFlow.practice}\n\nWorksheet: ${week.inClassWorksheet.title}`,
            suggestedPacing: "15 min",
          },
          {
            id: `fp-dbt-${sessionNum}-6`,
            section: "wrapup",
            content: dbt48WeekProgram.standardSessionFlow.close,
            suggestedPacing: "5 min",
          },
        ],
        activityTemplates: week.inClassWorksheet
          ? [
            {
              id: week.inClassWorksheet.id,
              type: "worksheet",
              title: week.inClassWorksheet.title,
              instructions: week.inClassWorksheet.purpose,
              questions:
                week.inClassWorksheet.fields?.map((f) => ({
                  id: f.id,
                  text: f.label,
                  type: "text", // Defaulting to text for mapped fields
                })) || [],
            },
          ]
          : [],
        homeworkTemplate: week.homeworkSheet
          ? {
            id: week.homeworkSheet.id,
            title: week.homeworkSheet.title,
            steps: [week.homeworkSheet.purpose],
            dueDescription: "Before next session",
          }
          : null,
        journalTemplateId: week.dailyJournalTemplateId,
        caseworxNoteTemplate: `Session ${sessionNum}: ${week.title}\n\nParticipant practiced skills. Progress noted.\n\nFacilitator Notes:\n[INSERT NOTES]`,
      };
    }),
  },
  {
    id: "coda",
    slug: "coda",
    name: "CODA (Co-Dependents Anonymous)",
    description: "Recovery from codependency patterns and building healthy relationships.",
    totalSessions: 10,
    isLocked: false,
    sessions: codaSessions,
  },
];
