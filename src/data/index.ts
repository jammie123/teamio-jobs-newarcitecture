import candidatesJson from './candidates.json'
import { buildJobsFromSimplyData } from './simply/buildJobsFromSimplyData'
import type { Candidate } from './types'

export const jobs = buildJobsFromSimplyData()
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

export { candidatesOfJob, countJobCandidates, newCandidateCount } from './jobCandidates'

export { toJobCard } from './toJobCard'

export { candidateListPath, pipelineStatusFromSearch } from './candidateListLink'

export {
  CANDIDATE_MOVE_TO_OPTIONS,
  CANDIDATE_STATUS_OPTIONS,
  matchesCandidateSearch,
  matchesPipelineStatus,
  newPipelineCounts,
  pipelineCounts,
  toCandidateItem,
} from './toCandidateItem'

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
