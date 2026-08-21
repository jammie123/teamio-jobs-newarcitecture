import type { Ad, AdStatus, Job } from './types'

export type JobListingTab = 'published' | 'unpublished' | 'draft' | 'archived'

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

export function listingTab(job: Job, today = todayIso()): JobListingTab {
  if (job.status === 'archive') {
    return 'archived'
  }

  if (job.ads.length === 0) {
    return 'draft'
  }

  if (job.ads.some((ad) => computeAdStatus(ad, today) === 'published')) {
    return 'published'
  }

  return 'unpublished'
}

export function jobsForTab(jobs: Job[], tab: JobListingTab, today = todayIso()): Job[] {
  return jobs.filter((job) => listingTab(job, today) === tab)
}
