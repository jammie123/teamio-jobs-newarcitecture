/** How open nábory run or end — drives tab „Nezveřejněný“ and mixed expired/live on cards. */
export type OpenPlacementProfile =
  | 'live'
  | 'endingSoon'
  /** All placements ended within the last 30 days. */
  | 'allExpiredRecent'
  /** All placements ended more than 30 days ago. */
  | 'allExpiredOld'
  /** First portal in the mix is expired; the rest keep running. */
  | 'splitExpiredLive'
  /** Simplify 11 — běží + expirováno + vypnutý kanál (kombinace D). */
  | 'simplify11Partial'
  /** Simplify 11 — běží + vypnutý kanál (kombinace E). */
  | 'simplify11RunningDisabled'
  /** Simplify 11 — expirováno + vypnutý kanál (kombinace F). */
  | 'simplify11ExpiredDisabled'
  /** Simplify 11 — všechny kanály vypnuté. */
  | 'simplify11AllDisabled'
  /** Simplify 11 — aktivní kanály s různými daty konce. */
  | 'simplify11MixedPeriods'

export const OPEN_JOB_PLACEMENT_PROFILE: Record<string, OpenPlacementProfile> = {
  'job-001': 'endingSoon',
  'job-002': 'allExpiredRecent',
  'job-003': 'splitExpiredLive',
  'job-004': 'allExpiredOld',
  'job-007': 'simplify11RunningDisabled',
  'job-010': 'allExpiredRecent',
  'job-011': 'allExpiredOld',
  'job-015': 'splitExpiredLive',
  'job-016': 'endingSoon',
  'job-018': 'simplify11MixedPeriods',
  'job-024': 'allExpiredOld',
  'job-025': 'simplify11Partial',
  'job-026': 'simplify11ExpiredDisabled',
  'job-027': 'simplify11AllDisabled',
}

export function openPlacementProfile(jobId: string): OpenPlacementProfile {
  return OPEN_JOB_PLACEMENT_PROFILE[jobId] ?? 'live'
}
