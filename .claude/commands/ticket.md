---
description: Implement a JIRA ticket end-to-end following project conventions
argument-hint: <TICKET-ID or pasted ticket description>
---

You are implementing a JIRA ticket for this project. Follow `CLAUDE.md` strictly.

Ticket: $ARGUMENTS

Steps:

1. **Understand the ticket.** If a JIRA connector is available, fetch ticket $ARGUMENTS to read the full description, acceptance criteria, and comments. Otherwise use the pasted text. Summarize back what you understand the requirement to be in 2-3 bullets before coding.

2. **Plan.** State which files you'll create/change and where they live per the folder structure. Identify:
   - which feature folder this belongs to (`src/features/<name>/`)
   - what API endpoints are involved (use generated orval hooks from `src/api/generated/`; if the endpoint isn't generated yet, note that `npm run api:gen` may be needed)
   - what state is server vs client

3. **Implement.** Write the component(s), service wrapper(s), types, and wire up routing if it's a new page. Use:
   - TanStack Query hooks for data
   - Zustand only for shared UI state
   - `@/` path alias
   - helpers in `src/utils/` for dates/downloads instead of reinventing

4. **Verify.** Run `npm run typecheck` and `npm run lint`. Fix everything.

5. **Report.** List the files changed and how to manually test the feature in the browser. Suggest a draft PR title referencing the ticket ID.

Do not hand-edit anything under `src/api/generated/`.
