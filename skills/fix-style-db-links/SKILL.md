# Fix Style and DB Links — SKILL

Related skill: `agent-customization`

Purpose
- Provide a concise, repeatable workflow that agents (and humans) use to fix UI style inconsistencies and broken database links in this repository.

When to use
- Use this skill when a UI page shows styling issues (misaligned elements, wrong colors, missing classes) or when DB-driven links (guild, user, or case links) resolve incorrectly or point to the wrong environment.

Outcome
- A clear set of edits to CSS, components, and configuration that restore consistent styling and repair DB link targets or environment references. Produces a minimal PR-ready diff and a short test checklist.

Step-by-step workflow
1. Triage
   - Reproduce the issue locally and capture screenshots or failing URLs.
   - Note the affected pages/components and any console/network errors.
2. Locate sources
   - Search component code for class names, inline styles, and CSS selectors.
   - Identify config files or environment variables that define DB link templates (e.g., API base URLs, link formatters).
3. Hypothesize fixes
   - For style: decide whether to change CSS variables, update class usage in JSX, or add responsive rules.
   - For DB links: determine whether the bug is in the formatter, environment config, or data mapping.
4. Implement small, focused changes
   - Make one change at a time (component or CSS file) and run the app to verify.
   - Prefer editing the least number of files to fix the issue.
5. Verify and add tests
   - Visual: verify pages in desktop and mobile widths; compare against screenshots.
   - Logical: unit-test the link formatter or add an integration assertion for produced URLs.
6. Document and PR
   - Add an entry to the PR describing the fix, files changed, and verification steps.

Decision points and branching
- If multiple components use the same broken styles, prefer a single CSS variable or shared class change over duplicated fixes.
- If links differ by environment (dev/staging/prod), prefer fixing the link template and environment mapping rather than hardcoding per-environment values.

Quality criteria / completion checks
- Visual parity: affected pages match the expected layout at 320px/768px/1280px.
- No console errors introduced.
- Link tests: link formatters produce correct absolute URLs for dev/staging/prod and the app uses env variables correctly.
- Changes are minimal and scoped: each PR addresses one root cause.

Common file locations (repository-specific hints)
- Styles: look under `src/styles/` (buttons.css, cards.css, sidebar.css, styles.css, typography.css).
- Components: `src/components/` — update JSX classnames or props when needed.
- Link logic: check `src/api/api.js`, any utils that format links, and pages that render anchors.

Ambiguities to clarify (questions to ask the requester)
- Which pages/components show the style regression? Provide screenshots or the route path.
- What is the expected visual style (reference screenshot or Figma link)?
- Which DB links are failing? Provide an example input and the incorrect URL produced.
- Which environment should fixes target first: `development`, `staging`, or `production`?

Example prompts to run this skill
- "Fix style: button padding and color on MemberHome; ensure matches design token `--primary`"
- "Fix DB links: case URLs are using old host; update formatter to use `REACT_APP_API_BASE`"

Editor-agent guidelines for iteration
1. Create a focused branch and open a working deployment if needed.
2. Run local dev server and reproduce the issue.
3. Make the minimal change, run, and capture verification screenshots.
4. If uncertain, add a short TODO comment in code pointing to this SKILL and ask the author a clarifying question.

What to record in PR description
- Short summary of the root cause.
- Files changed and why.
- Verification steps (screenshots, commands).

Next steps after running this skill
- Ask for any missing visual references or failing link examples so the agent can finalize edits.

Template checklists (copy into PR body)
- [ ] Reproduced the issue locally
- [ ] Implemented minimal fix
- [ ] Verified desktop/mobile views
- [ ] Added/updated unit or integration test for link formatting (if applicable)
- [ ] Updated PR description with screenshots and verification steps
