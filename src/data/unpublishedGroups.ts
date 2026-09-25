import { addDaysIso, todayIso, type JobListingTab } from './adStatus'
import type { JobSortKey } from './jobsSort'
import type { Job } from './types'

export const RECENTLY_ENDED_MAX_DAYS = 30

export function latestEndedAt(job: Job): string | null {
  const dates = job.ads.flatMap((ad) => ad.placements.map((placement) => placement.publishedTo))
  if (dates.length === 0) {
    return null
  }

  return dates.reduce((latest, date) => (date > latest ? date : latest))
}

export function isRecentlyEnded(job: Job, today = todayIso()): boolean {
  const endedAt = latestEndedAt(job)
  if (endedAt == null) {
    return false
  }

  return endedAt >= addDaysIso(today, -RECENTLY_ENDED_MAX_DAYS)
}

export function shouldGroupUnpublishedByEndedAge(tab: JobListingTab, sort: JobSortKey): boolean {
  return tab === 'unpublished' && (sort === 'latestAd' || sort === 'endingSoon')
}

export function partitionUnpublishedByEndedAge(
  jobs: Job[],
  today = todayIso(),
): { recent: Job[]; older: Job[] } {
  const recent: Job[] = []
  const older: Job[] = []

  for (const job of jobs) {
    if (isRecentlyEnded(job, today)) {
      recent.push(job)
    } else {
      older.push(job)
    }
  }

  return { recent, older }
}
