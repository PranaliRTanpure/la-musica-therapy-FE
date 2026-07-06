# AI Code Reviewer

Every `git commit` runs an automated review of your **staged** changes before the commit completes. It checks for bugs, security issues, convention violations, and cross-browser/responsive problems, and it asks you questions about your own code.

## What happens on commit

1. **lint-staged** — ESLint + Prettier on staged files.
2. **typecheck** — `tsc --noEmit`. Type errors block the commit.
3. **AI review** — Claude reviews the diff against `CLAUDE.md` and the rubric in `scripts/review-prompt.md`.

If the review finds a **BLOCKER**, the commit is blocked. Fix the issues and commit again.

## The "Understand your code" questions

After every review you'll see 1–3 questions about the trickiest parts of your change. **You are expected to be able to answer them.** If you can't, you don't understand the code you're about to ship — go learn it before pushing. This is the point of the tool, not a formality.

## Setup (once per machine)

- **Locally**, the reviewer uses your **Claude Code** CLI. Install it and sign in:
  ```bash
  npm install -g @anthropic-ai/claude-code
  claude   # sign in once
  ```
- If the CLI isn't found, the reviewer falls back to `ANTHROPIC_API_KEY` if that env var is set. If neither is available, the review is skipped (commit still works) — but that means you committed unreviewed.

## Config

- **Rubric**: `scripts/review-prompt.md` — edit to change what gets flagged.
- **Model**: set `REVIEW_MODEL` (default `claude-sonnet-4-6`).
- **Force transport**: `REVIEW_MODE=cli` or `REVIEW_MODE=api`.

## Bypassing (don't make a habit of it)

```bash
SKIP_AI_REVIEW=1 git commit -m "..."   # skip AI review only
git commit --no-verify -m "..."        # skip ALL hooks
```

Every run is logged to `.reviews/` (gitignored). A missing review log for a commit means the reviewer was skipped — reviewers may check this.

## Upgrading to enforced CI later

This script is CI-ready. To make review unbypassable, run `node scripts/ai-review.mjs` in a GitHub Action with `ANTHROPIC_API_KEY` set and `CI=true`, against the PR diff, plus a branch protection rule requiring it to pass. No code changes needed — it auto-switches to API mode in CI.
