import jobsJson from './jobs.json'
import type { Job } from './types'

export const jobs = jobsJson as Job[]

export type {
  Ad,
  AdStatus,
  Job,
  JobCandidates,
  JobDepartment,
  JobStatus,
  Placement,
  PlacementStats,
  PortalId,
} from './types'

export { visibleDepartment } from './types'

export {
  statsForAd,
  statsForJob,
  sumPlacementStats,
  sumStats,
} from './aggregateStats'

export { PORTAL_LABELS, portalLabel } from './portals'

export {
  computeAdStatus,
  formatCzechDate,
  jobBelongsToTab,
  jobsForTab,
  listingTab,
  todayIso,
  type JobCardListingStatus,
  type JobListingTab,
} from './adStatus'

export { toJobCard } from './toJobCard'

export {
  EMPTY_JOBS_FILTER,
  filterOptionsFromJobs,
  jobMatchesFilter,
} from './jobsFilter'

export {
  DEFAULT_JOB_SORT,
  JOB_SORT_OPTIONS,
  formatJobCount,
  jobSortLabel,
  sortJobs,
  type JobSortKey,
  type JobSortOption,
} from './jobsSort'
