---
description: Scaffold a new component or feature module per project conventions
argument-hint: <component/feature name + short description>
---

Scaffold per `CLAUDE.md`. Request: $ARGUMENTS

1. Decide scope: is this a shared component (`src/components/common/`) or a feature module (`src/features/<name>/`)? State your choice and why.

2. Create files:
   - For a feature: `src/features/<name>/components/<Name>.tsx`, `hooks/` if needed, `types.ts`, and an `index.ts` barrel export.
   - For a shared component: a single `.tsx` in `src/components/common/` with a named export.

3. Component requirements:
   - Function component, named export, typed props interface.
   - Use `@/` imports, `ahooks` for common hooks, `es-toolkit` for utils.
   - Keep presentational; data fetching goes through TanStack Query hooks / services, passed in or called via a colocated hook.

4. Run `npm run typecheck` and `npm run lint`, fix issues, then show the file tree created and a usage example.
