# Job Listing Prototype Scaffold — Implementation Plan

> Mirror of the approved Cursor plan. Implement task-by-task. Do not build real Job Listing UI in this pass.

**Goal:** Runnable `job-listing` sibling app linked to starter via Vite alias, own git repo, personal skill + project rules.

## Tasks

1. Write design spec under `docs/superpowers/specs/`
2. Scaffold Vite/React/TS app (`pages/`, `router/`, `data/`), git init, README
3. Wire starter: alias, TS paths, Tailwind re-export + content, `global.css`, deps, `PageTemplate` placeholder
4. Create `~/.cursor/skills/teamio-prototypes/SKILL.md`
5. Add alwaysApply rules in `job-listing` and `teamio-prototype-starter`
6. Verify with `npm install`, `npm run typecheck`, `npm run build` / `dev`

## Verification

- App loads with Teamio shell styles
- `@teamio/starter/components` imports typecheck
- No local CSS modules or parallel Tailwind theme in `job-listing`
