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

export const OPEN_JOB_PLACEMENT_PROFILE: Record<string, OpenPlacementProfile> = {
  'job-001': 'endingSoon',
  'job-002': 'allExpiredRecent',
  'job-003': 'splitExpiredLive',
  'job-004': 'allExpiredOld',
  'job-010': 'allExpiredRecent',
  'job-011': 'allExpiredOld',
  'job-015': 'splitExpiredLive',
  'job-016': 'endingSoon',
  'job-018': 'allExpiredRecent',
  'job-024': 'allExpiredOld',
}

export function openPlacementProfile(jobId: string): OpenPlacementProfile {
  return OPEN_JOB_PLACEMENT_PROFILE[jobId] ?? 'live'
}
