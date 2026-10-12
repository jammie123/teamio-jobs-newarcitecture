import type { CandidateItemData, CandidateStatusOption } from '@teamio/starter/components'
import { formatCzechDate } from './adStatus'
import { candidateStatusLabel } from './candidateStatus'
import { portalLabel } from './portals'
import type { Candidate, CandidateStatus } from './types'

/** Id of the pipeline cell that clears the status filter. Mirrors the starter's "Celkem" cell. */
const PIPELINE_ALL_ID = 'total'

/** Maps a candidate status onto a pipeline cell. `rejected` has no cell and counts only in total. */
const PIPELINE_STATUS_BY_CANDIDATE_STATUS: Record<CandidateStatus, string | undefined> = {
  unassessed: 'unassessed',
  preselected: 'preselected',
  offer: 'opalcovani',
  round1: 'invited',
  round2: 'invited',
  hired: 'hired',
  rejected: undefined,
}

const STATUS_COLORS: Record<CandidateStatus, CandidateStatusOption['color']> = {
  unassessed: 'neutral',
  preselected: 'informative',
  round1: 'informative',
  round2: 'informative',
  offer: 'warning',
  hired: 'success',
  rejected: 'danger',
}

const STATUS_ORDER: CandidateStatus[] = [
  'unassessed',
  'preselected',
  'round1',
  'round2',
  'offer',
  'hired',
  'rejected',
]

export const CANDIDATE_STATUS_OPTIONS: CandidateStatusOption[] = STATUS_ORDER.map((status) => ({
  id: status,
  label: candidateStatusLabel(status),
  color: STATUS_COLORS[status],
}))

export function toCandidateItem(candidate: Candidate): CandidateItemData {
  return {
    id: candidate.id,
    name: candidate.fullName,
    phone: candidate.phone,
    rating: { value: candidate.stars },
    statusId: candidate.status,
    lastContact: candidate.lastContact ? formatCzechDate(candidate.lastContact) : undefined,
    source: { name: portalLabel(candidate.source) },
    note: candidate.note ? { text: candidate.note } : undefined,
  }
}

export function pipelineCounts(candidates: Candidate[]): Record<string, number> {
  const counts: Record<string, number> = { [PIPELINE_ALL_ID]: candidates.length }

  for (const candidate of candidates) {
    const cell = PIPELINE_STATUS_BY_CANDIDATE_STATUS[candidate.status]
    if (cell) {
      counts[cell] = (counts[cell] ?? 0) + 1
    }
  }

  return counts
}

export function matchesPipelineStatus(candidate: Candidate, statusId: string | undefined): boolean {
  if (statusId === undefined || statusId === PIPELINE_ALL_ID) {
    return true
  }

  return PIPELINE_STATUS_BY_CANDIDATE_STATUS[candidate.status] === statusId
}
