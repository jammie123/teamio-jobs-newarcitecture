import type { JobCardV12Props } from '@teamio/starter/components'
import candidatesJson from './candidates.json'
import type { Candidate } from './types'

type JobCardCandidates = NonNullable<JobCardV12Props['candidates']>

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
 * Stats of JobCard V12. "Ve hře" is everyone still in process: předvybraný, kola, and nabídka.
 * "Nový" counts unassessed candidates flagged `isNew`, `newOpalcovani` the flagged offers.
 */
export function countJobCandidates(candidates: Candidate[]): JobCardCandidates {
  const counts = {
    new: 0,
    unassessed: 0,
    inProgress: 0,
    newOpalcovani: 0,
    total: candidates.length,
  }

  for (const candidate of candidates) {
    switch (candidate.status) {
      case 'unassessed':
        counts.unassessed += 1
        if (candidate.isNew) counts.new += 1
        break
      case 'preselected':
      case 'round1':
      case 'round2':
        counts.inProgress += 1
        break
      case 'offer':
        counts.inProgress += 1
        if (candidate.isNew) counts.newOpalcovani += 1
        break
      case 'hired':
      case 'rejected':
        break
    }
  }

  const { new: newly, newOpalcovani, ...rest } = counts

  return {
    ...rest,
    ...(newly > 0 ? { new: newly } : {}),
    ...(newOpalcovani > 0 ? { newOpalcovani } : {}),
  }
}

export function newCandidateCount(jobId: string): number {
  return countJobCandidates(candidatesOfJob(jobId)).new ?? 0
}
