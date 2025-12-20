docs/FACILITATOR_SPEC.md

Facilitator Spec v1

This document defines the Facilitator-side behavior contract for the Drug Court Learning Platform.
It is the source of truth for how facilitator workflows must function in V1.

If this document conflicts with README.md, follow this document for facilitator behavior.

Purpose

Facilitators deliver structured sessions with low friction and high compliance.
They guide pacing, verify attendance, and support participant engagement.
They do not control curriculum structure, progression rules, or attendance overrides.

Facilitator Role Boundaries
Facilitators can

Run scheduled sessions using the three-zone console.

Start and stop sessions.

Generate class QR codes for check-in.

Reset/regenerate a QR code for the active class session.

View participant progress states during the session (completion readiness).

Assign supplemental add-ons (worksheets, readings, videos) for that cohort/session occurrence.

Add notes tied to a session occurrence.

Add a note to a participant record that is tied to a session occurrence.

Message participants using templates, free text, or both.

Review homework and journals.

Request admin action when needed (curriculum changes, reschedules, corrections).

Facilitators cannot

Edit or restructure curriculum sessions, sections, or core prompts.

Remove required session content.

Edit homework prompts/questions.

Override attendance states (present/late/absent).

Assign or revoke makeup assignments manually.

Approve makeup work completion if they are the makeup facilitator.

Access participant written answers live during class.

Nonnegotiables

These rules must always be true.

Session unlocking

Participants cannot open the session before class begins.

The participant session unlocks only when the facilitator explicitly presses Start Session.

Live pacing rules

During a scheduled live class, participants are locked to the facilitator’s current section.

During a makeup session, participants are self-paced.

Progress visibility rules

Facilitators see completion readiness (who is done / not done).

Facilitators do not see participant written responses during the live session.

Participant responses are saved to the participant account for later review.

Time rules

Every class is treated as 90 minutes for reporting.

Standard structure is 45 min + 15 min break + 30 min.

The timer is pacing support only.

Ending early or late does not change reporting.

Attendance rules

Attendance overrides are admin-only.

In-person check-in uses QR + GPS validation.

Virtual sessions use the virtual flow (no GPS requirement).

Facilitators may reset the QR for that class session.

QR reset is not an attendance override.

Check-in timestamp and lateness

The participant check-in timestamp is always recorded.

Check-in time is written to the participant account.

Check-in time is reported to admin.

If a participant checks in after class has started, they are marked late.

“Class start” is the time the facilitator pressed Start Session.

Reliability and saving

There is no offline mode.

If power/network failure occurs, class is canceled.

Rescheduling requires an admin request/workflow.

Session progress must save at section boundaries (when a section is closed/completed).

Homework revision rules

When homework is sent back for revision:

The participant does not see the original submission.

Staff records retain both versions in history.

AI assistant rules (facilitator)

The facilitator AI is silent unless invoked.

It is for general, non-participant-specific information only.

It must not use participant history, attendance patterns, or PHI context.

Key Concepts
Curriculum vs Schedule

Curriculum sessions are ordered by sessionNumber.

Curriculum has no dates/times.

Schedule is the real calendar meeting.

Facilitator delivery follows the schedule, but content follows curriculum.

Facilitator Dashboard Expectations

The facilitator dashboard supports fast daily execution.

Must include

Weekly schedule grid (facilitator view).

“In-Person QR” and “Virtual Class” quick actions.

View participants (grouped by class).

Messages with reply.

Homework review workflow with approve / request revision.

Daily journal review workflow.

Makeup work needed list (assignment creation is not facilitator-controlled).

Notifications with badge clearing.

“Copy to CaseWorx” access for session notes (copy/paste).

Three-Zone Facilitation Console
Zone A: Header Controls

Must show:

Program + Session title.

Timer (90-minute pacing).

Section progress indicator.

Participant count for the active class.

Check-in status summary:

Present / Late / Not checked in.

Must include controls:

Start Session (locks in class start time and unlocks participants).

End Session (closes the session occurrence).

QR controls:

Show active QR.

Reset/regenerate QR (with reason prompt optional).

Toggle in-person vs virtual settings (based on session type).

Zone B: Navigation Spine (Soft Gate)

Displays sections and completion status.

Provides a readiness view for the facilitator.

Does not block navigation.

Shows participant completion readiness per section:

Example: “8/12 completed”.

Zone C: Content Workspace

Displays the facilitator-facing content for the current section.

Shows scripts, prompts, activity steps, and timing guidance.

Displays participant readiness signals only.

Does not display participant written responses during live class.

Session Lifecycle
1) Pre-session

Facilitator reviews the scheduled class.

Facilitator prepares the delivery view.

Facilitator selects in-person or virtual check-in mode.

2) Start Session

When facilitator presses Start Session:

A session occurrence is created.

The session is unlocked for participants.

Class start time is recorded.

Lateness evaluation becomes active.

3) Check-in behavior

In-person

QR scan + GPS validation is required.

Participant is present only if validated successfully.

Virtual

QR scan is required.

GPS is not required.

QR reset

Facilitator can reset/regenerate the QR for the class session.

Reset invalidates prior QR codes for that session occurrence.

Reset does not change attendance rules.

4) During session

Facilitator moves section-by-section.

Participants are locked to the facilitator’s current section.

Participants complete readings/questions.

Facilitator sees completion readiness only.

Progress saves at the end of each section.

5) Break

Break is part of the standard 90-minute structure.

Break timing is guidance only.

6) End session

When facilitator presses End Session:

The session occurrence is closed.

Attendance states are finalized by system rules.

Present/Late timestamps are stored and reported to admin.

A CaseWorx copy view is available (post-session).

Any needed admin actions are surfaced as requests (reschedule, corrections, etc.).

Notes and Documentation
Session-only facilitator note

Internal note tied to this session occurrence only.

Used for delivery observations.

Not visible to participants.

Participant account note (session-tied)

Stored on participant record.

Always linked to the session occurrence context.

Not editable into a global template.

Not visible to participants unless a future “share” feature is explicitly added.

Add-ons: Worksheets, Videos, Readings

Facilitators may add supplemental materials when a cohort needs more support.

Allowed

Add worksheets.

Add videos.

Add readings.

Add custom instructions for the add-on.

Not allowed

Removing required session materials.

Editing core curriculum content.

Editing homework prompts.

Scope rules

Add-ons apply to the cohort/session occurrence context.

Add-ons are visible to admin for oversight.

Making an add-on global requires admin action.

Homework Review Rules
Approve

Marks homework complete for that submission.

Request revision

Participant no longer sees the prior submission.

Staff retains both versions in history.

Revised submission becomes the active visible version for the participant.

Makeup Group Rules
Assignment authority

Admin controls makeup assignment creation and revocation.

Facilitators do not assign makeup manually.

Makeup facilitator role

The makeup facilitator:

Can start and stop the makeup session.

Does not approve the completed work.

Does not receive the approval routing workload.

Participant experience

Self-paced completion during makeup session.

Completed work is saved to participant account as Awaiting Approval.

Approval routing

Approval goes to the participant’s primary/assigned facilitator (not the makeup facilitator).

Admin receives:

confirmation of makeup attendance

timestamped records

the completed work packet metadata/status

AI Assistant: Facilitator Rules
Allowed

General questions.

Public factual questions.

Facilitation tips that are not participant-specific.

Example allowed prompts:

“How many overdose deaths were there in the U.S. last year?”

“Give me a brief definition of cognitive distortion.”

“What are common relapse triggers?”

Not allowed

Anything that uses participant data, PHI, or personalized participant analysis.

Anything that evaluates a participant’s compliance or risk based on their account.

Admin Request Triggers

Facilitators must be able to request admin help for:

Curriculum change requests (structure/content changes).

Session reschedule requests (cancelled class due to outage).

Attendance correction requests (admin-only changes).

Schedule corrections.

Escalations for technical or access issues.
