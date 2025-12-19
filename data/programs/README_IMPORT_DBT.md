# DBT 48-Week Program Content Bundle (for Antigravity)

This bundle contains an app-ready, **original** 48-week DBT-informed skills curriculum.

## Files
- `dbt_48_week_program.json` — canonical content (recommended for import/seed)
- `dbt_48_week_program.ts` — TypeScript export for direct use in a Next.js/Node codebase

## Schema overview (high level)
Top-level keys:
- `programSlug`, `programName`, `totalWeeks`
- `sections[]` — 3 sections aligned to DBT 1/2/3
- `dailyJournalTemplates[]` — 3 journal templates (A/B/C), one per section
- `weeks[]` — 48 week objects

Each `week` includes:
- `title`, `sessionPurpose`, `discussionPrompts[]`
- `inClassWorksheet` (id/title/purpose/fields[])
- `homeworkSheet` (id/title/purpose/fields[])
- `dailyJournalTemplateId`

## Intended use
1) Import JSON into your database or content store (preferred).
2) Render the curriculum by `weekNumber` (no calendar/times).
3) Use `sectionId` and `dailyJournalTemplateId` to switch the daily journal UI by section.

Generated at: 2025-12-17T01:06:36.840965Z
