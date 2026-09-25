import type { Ad, AdStatus, Job } from './types'

export type JobListingTab =
  | 'open'
  | 'published'
  | 'unpublished'
  | 'endingSoon'
  | 'draft'
  | 'archived'

/** Exclusive card/list bucket. Open and ending-soon are wider filters, not card statuses. */
export type JobCardListingStatus = Exclude<JobListingTab, 'open' | 'endingSoon'>

/** Matches JobCardSynteza warning window: remaining days 0 through 7. */
const ENDING_SOON_MAX_DAYS = 7

export function todayIso(now = new Date()): string {
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatCzechDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${Number(day)}. ${Number(month)}. ${year}`
}

export function computeAdStatus(ad: Ad, today = todayIso()): AdStatus {
  const anyLive = ad.placements.some((placement) => placement.publishedTo >= today)
  return anyLive ? 'published' : 'unpublished'
}

export function listingTab(job: Job, today = todayIso()): JobCardListingStatus {
  if (job.status === 'archive') {
    return 'archived'
  }

  if (job.status === 'draft' || job.ads.length === 0) {
    return 'draft'
  }

  if (job.ads.some((ad) => computeAdStatus(ad, today) === 'published')) {
    return 'published'
  }

  return 'unpublished'
}

export function addDaysIso(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00`)
  date.setDate(date.getDate() + days)
  return todayIso(date)
}

function hasPlacementEndingSoon(job: Job, today: string): boolean {
  const latest = addDaysIso(today, ENDING_SOON_MAX_DAYS)
  return job.ads.some((ad) =>
    ad.placements.some(
      (placement) => placement.publishedTo >= today && placement.publishedTo <= latest,
    ),
  )
}

export function jobBelongsToTab(job: Job, tab: JobListingTab, today = todayIso()): boolean {
  if (tab === 'open') {
    return job.status === 'open'
  }

  if (tab === 'endingSoon') {
    return job.status === 'open' && hasPlacementEndingSoon(job, today)
  }

  return listingTab(job, today) === tab
}

export function jobsForTab(jobs: Job[], tab: JobListingTab, today = todayIso()): Job[] {
  return jobs.filter((job) => jobBelongsToTab(job, tab, today))
}
