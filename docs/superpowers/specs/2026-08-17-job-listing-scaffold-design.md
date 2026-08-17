# Job Listing Prototype Scaffold — Design

**Date:** 2026-08-17  
**Status:** Approved  
**Scope:** Scaffold only (no real Job Listing UI)

## Goal

Create a sibling Vite + React + TypeScript app at `TeamioPrototypes/job-listing/` that consumes `teamio-prototype-starter` components and design tokens without copying them or inventing local styles. The prototype has its own git repository.

## Layout

```text
TeamioPrototypes/
├── teamio-prototype-starter/   # shared catalog + Storybook + tokens
└── job-listing/                # this prototype (own git)
    ├── src/pages/
    ├── src/router/
    ├── src/data/
    └── …
```

## Responsibilities

| Location | Owns |
| --- | --- |
| `teamio-prototype-starter` | UI components, Tailwind tokens (`tm-`), `global.css`, Storybook |
| `job-listing` | Pages, router, mock/fixture data, composition of catalog components |

## Linking

- Vite alias: `@teamio/starter` → `../teamio-prototype-starter/src`
- Entry imports `@teamio/starter/styles/global.css`
- Tailwind: re-use starter theme (`prefix: 'tm-'`); `content` scans both apps’ `src`
- Runtime deps mirrored as needed (React, Radix, lucide, floating-ui, fontsource, clsx)
- React dedupe in Vite resolve

Not used: `file:` package, npm workspaces, starter `dist/`, `@almacareer/teamio-ui-components`.

## App structure (scaffold)

- `App.tsx` mounts the router only
- One route `/` → `JobListingPage` with `PageTemplate` + placeholder copy
- `src/data/` prepared for JSON fixtures later (empty `.gitkeep`)

## Cursor guidance

- Personal skill: `~/.cursor/skills/teamio-prototypes/SKILL.md` (auto-discoverable)
- Project rule in `job-listing`: always apply — import starter only, no local theme/CSS, no new UI components here
- Project rule in starter: always apply — catalog only, no product pages in `App.tsx`

## Out of scope

Real job listing screens, filters, tables, mock JSON content, Storybook inside `job-listing`, publishing the starter as an npm library.
