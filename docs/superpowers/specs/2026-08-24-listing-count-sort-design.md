# Listing count + sort — Design

**Date:** 2026-08-24  
**Status:** Approved  
**Scope:** Count + sort toolbar above the job cards on the Nábory listing

## Goal

Show how many nábory are in the current list, and let the user change order from a link dropdown. Default order puts a job with a just-published ad at the top.

## Layout

Between `JobsFilter` and the card list, a single row:

```text
12 náborů                          Nejnověji vystavený inzerát ▾
```

- Left: Czech plural count of the **visible** list (active tab + current filter). Same source as the tab pills.
- Right: link-styled dropdown toggle. Label is the **active** sort option. Chevron opens the menu.

Empty list still shows the toolbar (`0 náborů`) plus the empty-state sentence.

## Copy

| Count | Label |
| --- | --- |
| 1, 21, 31… (`n % 10 === 1` and not 11) | `1 nábor` |
| 2–4, 22–24… | `2 nábory` |
| 0, 5–20, 25+ | `5 náborů` |

No English “count”. Format the number with `cs-CZ` grouping.

## Sort options (set B)

| Key | Label | Order |
| --- | --- | --- |
| `latestAd` | Nejnověji vystavený inzerát | `max(publishedFrom)` desc — **default** |
| `newestJob` | Nejnovější nábor | `job.createdAt` desc |
| `endingSoon` | Nejdřív končí inzerát | soonest **live** `publishedTo` asc (`publishedTo >= today`) |
| `mostCandidates` | Nejvíc uchazečů | `candidates.total` desc (`undefined` = 0) |
| `titleAz` | Název A–Z | `title` `localeCompare(..., 'cs')` |

Missing sort key (no ads / no live ad): that job **sinks**, then `createdAt` desc, then title A–Z.

One sort state, shared across tabs.

## Data

- Add `createdAt: string` (ISO `YYYY-MM-DD`) on `Job`.
- Jobs with ads: `createdAt` is two weeks before the earliest `publishedFrom`.
- Drafts without ads: recent fixture dates so “Nejnovější nábor” is demonstrable.
- One published job keeps a `publishedFrom` of `2026-08-23` so the default sort has a clearly newest ad.

## Architecture

- **Prototype only.** Compose starter `Typography`, `Dropdown`, `DropdownToggle`, `DropdownBody`, `OptionList`, `Option`.
- Sort + count helpers live in `job-listing/src/data/jobsSort.ts`.
- No new starter catalog component.

## Out of scope

Reverse/oldest options, per-tab sort memory, URL persistence, views / new-candidates sorts.
