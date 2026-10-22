import type { JobCardSimplify4Props } from '@teamio/starter/components'

/** Stat of the job card as emitted by `onCandidatesClick` (the starter's root export names a different card's stats). */
type JobCandidateStat = Parameters<NonNullable<JobCardSimplify4Props['onCandidatesClick']>>[0]

/** Query parameter of the candidate list that preselects a pipeline status. */
const STATUS_PARAM = 'status'

/** Pipeline cell opened by a click on a stat of the job card (`total` opens the whole list). */
const PIPELINE_STATUS_BY_STAT: Record<JobCandidateStat, string | undefined> = {
  total: undefined,
  unassessed: 'unassessed',
  preselected: 'preselected',
  opalcovani: 'opalcovani',
  invited: 'invited',
  nabidka: 'offer',
  hired: 'hired',
}

const KNOWN_PIPELINE_STATUSES = new Set(Object.values(PIPELINE_STATUS_BY_STAT))

/** Path of the candidate list of a job, optionally with the pipeline status of a job card stat active. */
export function candidateListPath(jobId: string, stat?: JobCandidateStat): string {
  const path = `/nabory/${jobId}/uchazeci`
  const status = stat ? PIPELINE_STATUS_BY_STAT[stat] : undefined

  return status ? `${path}?${STATUS_PARAM}=${status}` : path
}

/** Pipeline status from the candidate list URL; unknown or missing values mean no filter. */
export function pipelineStatusFromSearch(search: URLSearchParams): string | undefined {
  const status = search.get(STATUS_PARAM)

  return status && KNOWN_PIPELINE_STATUSES.has(status) ? status : undefined
}
