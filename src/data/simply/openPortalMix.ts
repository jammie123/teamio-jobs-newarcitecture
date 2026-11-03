import type { PortalId } from '../types'

/** Portal mix for open nábory (18) — 6 + 6 + 6 per Simply Data plan. */
export const OPEN_JOB_PORTAL_MIX: Record<string, readonly PortalId[]> = {
  // Skupina A — Práce + Kariérky
  'job-001': ['prace_cz', 'career_pages'],
  'job-002': ['prace_cz', 'career_pages'],
  'job-003': ['prace_cz', 'career_pages'],
  'job-004': ['prace_cz', 'career_pages'],
  'job-006': ['prace_cz', 'career_pages'],
  'job-007': ['prace_cz', 'career_pages'],

  // Skupina B — Jobs + Kariérky
  'job-009': ['jobs_cz', 'career_pages'],
  'job-010': ['jobs_cz', 'career_pages'],
  'job-011': ['jobs_cz', 'career_pages'],
  'job-013': ['jobs_cz', 'career_pages'],
  'job-014': ['jobs_cz', 'career_pages'],
  'job-015': ['jobs_cz', 'career_pages'],

  // Skupina C — různorodý mix
  'job-016': ['jobs_cz', 'atmoskop', 'career_pages'],
  'job-018': ['jobs_cz', 'referral', 'export'],
  'job-024': ['prace_za_rohem', 'career_pages'],
  'job-025': ['jobs_cz', 'prace_za_rohem', 'atmoskop'],
  'job-026': ['career_pages', 'referral', 'export'],
  'job-027': ['jobs_cz', 'export', 'prace_za_rohem'],
}

export const OPEN_JOB_IDS = Object.keys(OPEN_JOB_PORTAL_MIX)
