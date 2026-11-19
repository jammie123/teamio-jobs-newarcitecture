import {
  isRecentlyExpired,
  latestPlacementEnd,
  RECENTLY_EXPIRED_MAX_DAYS,
  todayIso,
  type JobListingTab,
} from './adStatus'
import type { JobSortKey } from './jobsSort'
import type { Job } from './types'

export const RECENTLY_ENDED_MAX_DAYS = RECENTLY_EXPIRED_MAX_DAYS
export const latestEndedAt = latestPlacementEnd
export const isRecentlyEnded = isRecentlyExpired

export function shouldGroupUnpublishedByEndedAge(tab: JobListingTab, sort: JobSortKey): boolean {
  return tab === 'unpublished' && (sort === 'latestAd' || sort === 'oldestAd')
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
