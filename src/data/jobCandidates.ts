import type { JobCardSimplify7Props } from '@teamio/starter/components'
import candidatesJson from './candidates.json'
import type { Candidate } from './types'

type JobCardCandidates = NonNullable<JobCardSimplify7Props['candidates']>

const allCandidates = candidatesJson as Candidate[]

const candidatesByJobId = new Map<string, Candidate[]>()
for (const candidate of allCandidates) {
  const list = candidatesByJobId.get(candidate.jobId)
  if (list) {
    list.push(candidate)
  } else {
    candidatesByJobId.set(candidate.jobId, [candidate])
  }
}

/** All candidates of one nábor; candidates.json is the single source of truth for every count. */
export function candidatesOfJob(jobId: string): Candidate[] {
  return candidatesByJobId.get(jobId) ?? []
}

/**
 * Stats of the job card. The pipeline cells match the candidate list (see `pipelineCounts`):
 * Pozvaný = 1. + 2. kolo, Opalcovaný = nabídka. "Nový" counts unassessed candidates flagged `isNew`,
 * `newOpalcovani` the flagged candidates with an offer.
 */
export function countJobCandidates(candidates: Candidate[]): JobCardCandidates {
  const counts = {
    new: 0,
    unassessed: 0,
    preselected: 0,
    opalcovani: 0,
    newOpalcovani: 0,
    invited: 0,
    hired: 0,
    total: candidates.length,
  }

  for (const candidate of candidates) {
    switch (candidate.status) {
      case 'unassessed':
        counts.unassessed += 1
        if (candidate.isNew) counts.new += 1
        break
      case 'preselected':
        counts.preselected += 1
        break
      case 'offer':
        counts.opalcovani += 1
        if (candidate.isNew) counts.newOpalcovani += 1
        break
      case 'round1':
      case 'round2':
        counts.invited += 1
        break
      case 'hired':
        counts.hired += 1
        break
      case 'rejected':
        break
    }
  }

  const { newOpalcovani, ...rest } = counts

  return newOpalcovani > 0 ? { ...rest, newOpalcovani } : rest
}

export function newCandidateCount(jobId: string): number {
  return countJobCandidates(candidatesOfJob(jobId)).new ?? 0
}
