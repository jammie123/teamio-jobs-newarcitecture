import type { CandidateItemData, CandidateStatusOption } from '@teamio/starter/components'
import { formatCzechDate } from './adStatus'
import { candidateStatusLabel } from './candidateStatus'
import { portalLabel } from './portals'
import type { Candidate, CandidateStatus } from './types'

/** Id of the pipeline cell that clears the status filter. Mirrors the starter's "Celkem" cell. */
const PIPELINE_ALL_ID = 'total'

/** Maps a candidate status onto a pipeline cell. Every candidate also counts in total. */
const PIPELINE_STATUS_BY_CANDIDATE_STATUS: Record<CandidateStatus, string | undefined> = {
  unassessed: 'unassessed',
  preselected: 'preselected',
  offer: 'opalcovani',
  round1: 'invited',
  round2: 'invited',
  hired: 'hired',
  rejected: 'rejected',
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

/** Targets of "Posunout do" in the row menu and the bulk bar; rejecting is a separate action. */
export const CANDIDATE_MOVE_TO_OPTIONS: CandidateStatusOption[] = CANDIDATE_STATUS_OPTIONS.filter(
  (option) => option.id !== 'rejected',
)

export function toCandidateItem(candidate: Candidate): CandidateItemData {
  return {
    id: candidate.id,
    name: candidate.fullName,
    phone: candidate.phone,
    rating: { value: candidate.stars },
    statusId: candidate.status,
    isNew: candidate.isNew && candidate.status === 'unassessed' ? true : undefined,
    isNewlyOpalcovani: candidate.isNew && candidate.status === 'offer' ? true : undefined,
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

/**
 * Counts of new candidates for the pipeline pill: unassessed candidates flagged `isNew` and offers
 * flagged `isNew` ("nově opalcovaní"). Other pipeline cells never show a pill.
 */
export function newPipelineCounts(candidates: Candidate[]): Record<string, number> {
  const counts: Record<string, number> = {}

  for (const candidate of candidates) {
    if (!candidate.isNew) continue
    const cell = candidate.status === 'unassessed' || candidate.status === 'offer'
      ? PIPELINE_STATUS_BY_CANDIDATE_STATUS[candidate.status]
      : undefined
    if (cell) {
      counts[cell] = (counts[cell] ?? 0) + 1
    }
  }

  return counts
}

function normalizeForSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

/** Case- and diacritics-insensitive match of the candidate's name; an empty query matches all. */
export function matchesCandidateSearch(candidate: Candidate, query: string): boolean {
  const normalized = normalizeForSearch(query.trim())
  return normalized === '' || normalizeForSearch(candidate.fullName).includes(normalized)
}

export function matchesPipelineStatus(candidate: Candidate, statusId: string | undefined): boolean {
  if (statusId === undefined || statusId === PIPELINE_ALL_ID) {
    return true
  }

  return PIPELINE_STATUS_BY_CANDIDATE_STATUS[candidate.status] === statusId
}
