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
