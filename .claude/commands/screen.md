---
description: Build a static screen from the designers' reference code + screenshot, using the MUI theme
argument-hint: <screen name + route, then paste/attach the designer's component code and a screenshot>
---

Build a static screen for this React + TypeScript + MUI project. Follow `CLAUDE.md` (especially the MUI & Styling Conventions) strictly.

Request: $ARGUMENTS

You will be given some or all of: the designers' reference component source, a screenshot, and the target route. Use whatever is provided.

Steps:

1. **Analyze the reference.** From the designer's code/screenshot, identify: layout structure, the colors/spacing/typography used, and which parts map to existing theme tokens vs. new ones. State briefly what styling method the designers used (MUI / Tailwind / CSS) so the translation approach is clear.

2. **Check the theme first.** Read `src/theme/theme.ts`. If the screen needs a color, spacing value, radius, or typography variant that already exists, use it. If it needs a NEW recurring design token, add it to the theme rather than hardcoding — and note what you added.

3. **Build the screen** in `src/pages/<Name>.tsx` (or `src/features/<name>/` if it's a feature with sub-parts):
   - Compose with MUI layout components (`Container`, `Box`, `Stack`, `Grid`).
   - Grid with the `size` prop is `import Grid from '@mui/material/Grid2'` (MUI v6).
   - Use ONLY theme tokens for colors/spacing/radii/type — no hardcoded values.
   - Make it responsive with breakpoint syntax (`sx={{ ... { xs, sm, md } }}`, `Grid size={{ xs, sm, md }}`).
   - Static only — no data fetching. Use placeholder/sample content where data will later go, structured so real data drops in as props without layout changes.
   - Match `src/pages/ExampleScreen.tsx` structurally.

4. **Wire the route** into `src/routes/router.tsx` at the requested path.

5. **Verify**: run `npm run typecheck` and `npm run lint`, fix issues. Confirm the screen has no hardcoded style values (grep your own output for hex colors / px — there should be none in the component).

6. **Report**: files created/changed, any theme tokens added, and how the layout behaves at mobile (~375px) / tablet (~768px) / desktop (≥1200px). Note any spots where the designer's intent was ambiguous and you made a judgment call.

Never hardcode design values that belong in the theme. Never copy the designers' file structure — rebuild in this project's conventions.
