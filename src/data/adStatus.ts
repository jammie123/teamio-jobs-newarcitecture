import type { Ad, AdStatus, Job } from './types'

export type JobListingTab = 'active' | 'published' | 'unpublished' | 'draft' | 'archived'

/** Exclusive card/list bucket. Active is a wider Open-job filter, not a card status. */
export type JobCardListingStatus = Exclude<JobListingTab, 'active'>

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

export function jobBelongsToTab(job: Job, tab: JobListingTab, today = todayIso()): boolean {
  if (tab === 'active') {
    return job.status === 'open'
  }

  return listingTab(job, today) === tab
}

export function jobsForTab(jobs: Job[], tab: JobListingTab, today = todayIso()): Job[] {
  return jobs.filter((job) => jobBelongsToTab(job, tab, today))
}
