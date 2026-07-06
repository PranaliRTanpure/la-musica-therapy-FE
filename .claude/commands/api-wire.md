---
description: Regenerate the API layer and wire generated hooks into a feature
argument-hint: <feature or endpoint to wire up>
---

Wire backend API into the front end. Request: $ARGUMENTS

1. If the backend spec changed, remind the user to ensure `orval.config.ts` `input.target` points at the current OpenAPI spec, then run `npm run api:gen`.

2. Identify the generated hook(s) in `src/api/generated/` relevant to: $ARGUMENTS

3. If business logic / transformation is needed, create or extend a wrapper in `src/services/`. Otherwise use the generated hook directly.

4. Wire it into the relevant component/page with proper loading, error, and empty states. Use the project's date/download utils where relevant.

5. Run `npm run typecheck` + `npm run lint`. Report what was wired and how to test.

Never hand-edit `src/api/generated/`.
