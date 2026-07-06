## MUI & Styling Conventions

This project uses **MUI (Material UI)** with a central theme as the single source of truth for design. The theme lives in `src/theme/theme.ts` and is provided via `ThemeProvider` + `CssBaseline` in `main.tsx`.

### Absolute rules
- **Never hardcode colors, spacing, radii, or font sizes** in components. No `sx={{ color: '#2563EB' }}`, no `padding: '16px'`. Use theme tokens:
  - Colors: `color="primary.main"`, `sx={{ bgcolor: 'background.paper', color: 'text.secondary' }}`
  - Spacing: `sx={{ p: 2, mt: 3, gap: 2 }}` (numbers = theme.spacing units, 1 = 8px)
  - Radii: inherit from theme, or `sx={{ borderRadius: 1 }}` (theme multiplier)
  - Typography: use `<Typography variant="h3">`, not manual font-size.
- If a value is needed repeatedly or is a design decision, it belongs in the **theme**, not scattered in `sx`. Add to `src/theme/theme.ts` (palette, typography, or component `styleOverrides`).
- **Layout with MUI components**: `Container`, `Box`, `Stack`, `Grid` — not raw divs with manual CSS. Reach for `Stack` for 1D layouts, `Grid` for 2D/responsive columns.

### Responsive
- Mobile-first, via MUI breakpoints `xs | sm | md | lg | xl`.
- Use responsive `sx` object syntax: `sx={{ py: { xs: 3, md: 5 } }}`.
- Use responsive `Grid` sizing: `<Grid size={{ xs: 12, sm: 6, md: 3 }} />`.
- **Grid import (MUI v6):** the Grid with the `size` prop is `import Grid from '@mui/material/Grid2'`. The plain `Grid` from `@mui/material` is the legacy API (uses `item`/`xs`/`md` props) — do not mix them.
- Every screen must be verified at mobile (~375px), tablet (~768px), desktop (≥1200px). State how it behaves at each in your summary.

### Building screens from the designers' code
The designers provide a reference implementation (their repo + live Vercel site). When building a screen:
1. Use their source as the source of truth for exact spacing, colors, and structure — translate those into **theme tokens**, don't copy hardcoded values.
2. If their styling method differs (Tailwind/CSS), translate to MUI `sx`/theme equivalents.
3. Rebuild in THIS project's structure (`src/pages/` or `src/features/`), themed and responsive — do not copy their file structure.
4. If a color/spacing value recurs and isn't in the theme yet, add it to the theme rather than inlining.

### Reference pattern
`src/pages/ExampleScreen.tsx` is the canonical example — copy its structure (Container → Stack header → Grid of Cards → themed form). New static screens should look structurally like it.

### Component reuse
- Prefer MUI components directly when the theme covers styling.
- When the design needs a consistent custom variant (e.g. a specific button style used everywhere), set it via theme `components.styleOverrides` / `defaultProps`, OR create a wrapper in `src/components/common/`. Do NOT re-style the same component ad hoc on each screen.

### Definition of done (MUI additions)
- No hardcoded colors/spacing/radii/font-sizes; all via theme.
- Layout uses MUI layout components, not manual CSS divs.
- Responsive at xs/sm/md verified.
- Recurring design values live in `src/theme/theme.ts`, not inline.
