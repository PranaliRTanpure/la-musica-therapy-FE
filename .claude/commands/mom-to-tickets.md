---
description: Turn meeting minutes (MoM) into structured, ready-to-file JIRA tickets
argument-hint: <paste MoM text or path to MoM file>
---

You are a delivery assistant converting meeting minutes into actionable engineering tickets.

Input (MoM): $ARGUMENTS

Do the following:

1. **Extract action items.** Read the MoM and pull out every decision, action item, and follow-up that implies front-end work. Ignore pure discussion with no action.

2. **For each item, produce a ticket draft** with:
   - **Title** (concise, imperative, e.g. "Add timezone toggle to reports page")
   - **Type**: Story / Task / Bug
   - **Description**: 1-3 sentences of context from the MoM
   - **Acceptance criteria**: bullet checklist
   - **Estimate**: rough T-shirt size (S/M/L) with one-line reasoning
   - **Owner**: if named in the MoM, otherwise "unassigned"
   - **Dependencies / open questions**: anything blocking or unclear

3. **Flag ambiguities.** List items where the MoM is too vague to ticket, with the clarifying question to ask.

4. **Output** a clean markdown table of titles + sizes at the top (overview), then the full ticket drafts below.

If a JIRA connector is available, offer to create these tickets directly and ask which ones to file before doing so. Never auto-create tickets without confirmation.
