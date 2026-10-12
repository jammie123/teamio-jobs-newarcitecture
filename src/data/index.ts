import candidatesJson from './candidates.json'
import jobsJson from './jobs.json'
import type { Candidate, Job } from './types'

export const jobs = jobsJson as Job[]
export const candidates = candidatesJson as Candidate[]

export type {
  Ad,
  AdStatus,
  Candidate,
  CandidateSource,
  CandidateStatus,
  Highlight,
  HighlightType,
  Job,
  JobCandidates,
  JobDepartment,
  JobStatus,
  Note,
  NoteType,
  Placement,
  PlacementStats,
  PortalId,
} from './types'

export { departmentsOf, visibleDepartment } from './types'

export {
  statsForAd,
  statsForJob,
  sumPlacementStats,
  sumStats,
} from './aggregateStats'

export {
  HIGHLIGHTS_BY_PORTAL,
  HIGHLIGHT_LABELS,
  highlightDisplayName,
  highlightLabel,
  PORTAL_LABELS,
  portalLabel,
} from './portals'

export { NOTE_LABELS, noteLabel } from './notes'

export { CANDIDATE_STATUS_LABELS, candidateStatusLabel } from './candidateStatus'

export {
  addDaysIso,
  computeAdStatus,
  formatCzechDate,
  jobBelongsToTab,
  jobsForTab,
  listingTab,
  todayIso,
  type JobCardListingStatus,
  type JobListingTab,
} from './adStatus'

export {
  RECENTLY_ENDED_MAX_DAYS,
  isRecentlyEnded,
  latestEndedAt,
  partitionUnpublishedByEndedAge,
  shouldGroupUnpublishedByEndedAge,
} from './unpublishedGroups'

export { toJobCard } from './toJobCard'

export {
  toModalAdvertisements,
  toModalAdvertisementSections,
  toModalPlaces,
  toModalPlacesForAction,
  toTopPlaces,
  type JobAdAction,
} from './toJobModal'

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
