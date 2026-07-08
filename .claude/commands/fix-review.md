---
description: Read the latest AI review log and resolve its BLOCKER findings one at a time, with explanation
argument-hint: (no args needed — uses the most recent .reviews/ log; or pass a specific filename)
---

A commit was blocked by the AI reviewer. Help the developer resolve the blockers — but the goal is to fix AND teach, not to silently auto-fix. Follow `CLAUDE.md` conventions for any code you change.

$ARGUMENTS

## Steps

1. **Find the review.** If a filename was passed in the arguments, use `.reviews/<that file>`. Otherwise read the MOST RECENT file in the `.reviews/` directory (latest timestamp). If `.reviews/` is empty or missing, tell the developer there's no review to act on and stop.

2. **Extract the blockers.** From the review log, pull out every finding marked `[BLOCKER]`. Ignore WARNING and NIT for now (mention at the end that they exist, but don't fix them unless asked). Also note the "UNDERSTAND YOUR CODE" questions — you'll use them at the end.

3. **If there are no blockers**, say so — the commit likely failed for another reason (lint/typecheck). Run `npm run lint` and `npm run typecheck`, report what's actually failing, and help fix that instead.

4. **Work through blockers ONE AT A TIME.** For each blocker, do NOT just apply a fix silently. Instead:
   a. **Show** the developer the finding: which file/line, what the reviewer said.
   b. **Explain WHY it's a real problem** in plain terms — the actual risk or bug it causes. This is the teaching step; do not skip it.
   c. **Locate the code** in the actual file (read it — the review log may be slightly stale) and confirm the issue still exists.
   d. **Propose the fix** and explain what it changes and why that resolves it.
   e. **Apply it** (make the edit).
   f. Move to the next blocker.

5. **Verify.** After all fixes, run `npm run typecheck` and `npm run lint`. Fix anything that surfaces. Do not consider the work done until both pass.

6. **Comprehension check (IMPORTANT — do not skip).** Before wrapping up, present the "UNDERSTAND YOUR CODE" questions from the review log back to the developer, plus any that arise from the fixes you just made. Tell them plainly: they should be able to answer these about their own code before re-committing. The point of this step is that they understand what was wrong and why the fix works — not just that the code is now green.

7. **Report.** Summarize: each blocker and how it was resolved, confirmation that typecheck + lint pass, any remaining WARNING/NIT items they may want to address, and a reminder that re-committing will trigger a fresh review.

## Rules

- Fix the ROOT cause, not the symptom. Don't suppress a lint rule or cast to `any` to make a blocker disappear — that's gaming the review, which defeats its purpose.
- Never disable the reviewer, edit `.reviews/` logs, or weaken `scripts/review-prompt.md` to pass. If the developer asks you to, decline and explain why.
- If a "blocker" is genuinely a false positive (the reviewer was wrong), say so clearly, explain your reasoning, and let the developer decide — don't just override it silently.
- Keep the developer engaged: this command exists to close the understanding gap, not to auto-launder unreviewed code.
