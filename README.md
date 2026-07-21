# My App

React + Vite + TypeScript base.

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL
npm run dev
```

## API codegen

Point `orval.config.ts` `input.target` at your backend OpenAPI spec, then:

```bash
npm run api:gen
```

## Scripts

- `dev`, `build`, `preview`
- `lint`, `lint:fix`, `format`, `typecheck`
- `api:gen`

## AI workflows

See `CLAUDE.md`. Slash commands in `.claude/commands/`:

- `/ticket` — implement a JIRA ticket
- `/mom-to-tickets` — convert meeting minutes to tickets
- `/component` — scaffold a component/feature
- `/api-wire` — regenerate + wire API hooks

# la-musica-therapy-FE

## When a commit is blocked: `/fix-review`

If the review returns BLOCKERs and blocks your commit, run the **`/fix-review`** slash command in Claude Code. It reads the latest `.reviews/` log and walks you through each blocker one at a time — explaining _why_ each is a real problem, proposing and applying a fix, then re-running typecheck + lint. It ends by putting the "Understand your code" questions back in front of you.

It is deliberately NOT a silent auto-fixer: the point is that you understand what was wrong and why the fix works before you re-commit. Re-committing triggers a fresh review.
