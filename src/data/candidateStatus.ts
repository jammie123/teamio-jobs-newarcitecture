import type { CandidateStatus } from './types'

export const CANDIDATE_STATUS_LABELS: Record<CandidateStatus, string> = {
  unassessed: 'Neposouzený',
  preselected: 'Předvybraný',
  round1: '1. kolo',
  round2: '2. kolo',
  offer: 'Nabídka',
  rejected: 'Zamítnutý',
  hired: 'Přijatý',
}

export function candidateStatusLabel(status: CandidateStatus): string {
  return CANDIDATE_STATUS_LABELS[status]
}
