import type { Ad, AdStatus, Job } from './types'

export type JobListingTab = 'open' | 'published' | 'unpublished' | 'draft' | 'archived'

/** Exclusive card/list bucket. Open is a wider filter, not a card status. */
export type JobCardListingStatus = Exclude<JobListingTab, 'open'>

/**
 * JobCard V40 window for „Expirováno před N dny“. The heading stays highlighted for
 * `RECENTLY_EXPIRED_HIGHLIGHT_DAYS`.
 */
export const RECENTLY_EXPIRED_MAX_DAYS = 30
export const RECENTLY_EXPIRED_HIGHLIGHT_DAYS = 8

/** Fixture: all portals ended this many days ago so the listing shows Expirováno nedávno. */
export const RECENTLY_EXPIRED_END_OFFSET_DAYS = -6
export const RECENTLY_EXPIRED_START_OFFSET_DAYS = -75

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

export function addDaysIso(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00`)
  date.setDate(date.getDate() + days)
  return todayIso(date)
}

export function recentlyExpiredWindow(today = todayIso()): {
  publishedFrom: string
  publishedTo: string
} {
  return {
    publishedFrom: addDaysIso(today, RECENTLY_EXPIRED_START_OFFSET_DAYS),
    publishedTo: addDaysIso(today, RECENTLY_EXPIRED_END_OFFSET_DAYS),
  }
}

export function computeAdStatus(ad: Ad, today = todayIso()): AdStatus {
  const anyLive = ad.placements.some((placement) => placement.publishedTo >= today)
  return anyLive ? 'published' : 'unpublished'
}

export function latestPlacementEnd(job: Job): string | null {
  const dates = job.ads.flatMap((ad) => ad.placements.map((placement) => placement.publishedTo))
  if (dates.length === 0) {
    return null
  }

  return dates.reduce((latest, date) => (date > latest ? date : latest))
}

/** Recruiter stopped advertising; V40 then shows „Ukončené vystavování“. */
export function jobUnpublishedByRecruiter(job: Job): boolean {
  return job.ads.some((ad) => Boolean(ad.notAdvertising))
}

/** Every placement has already ended, and the latest end is still within 30 days. */
export function isRecentlyExpired(job: Job, today = todayIso()): boolean {
  const endedAt = latestPlacementEnd(job)
  if (endedAt == null || endedAt >= today) {
    return false
  }

  return endedAt >= addDaysIso(today, -RECENTLY_EXPIRED_MAX_DAYS)
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

export function jobBelongsToTab(job: Job, tab: JobListingTab, today = todayIso()): boolean {
  if (tab === 'open') {
    return job.status === 'open' && job.ads.length > 0
  }

  return listingTab(job, today) === tab
}

export function jobsForTab(jobs: Job[], tab: JobListingTab, today = todayIso()): Job[] {
  return jobs.filter((job) => jobBelongsToTab(job, tab, today))
}
