import jobsMetaJson from './jobsMeta.json'
import { addDaysIso, todayIso } from '../adStatus'
import type { Ad, Job, JobStatus, Placement, PlacementStats, PortalId } from '../types'
import {
  ARCHIVE_END_OFFSET_DAYS,
  ARCHIVE_START_OFFSET_DAYS,
  DEFAULT_PUBLISHED_RUN_DAYS,
  DEFAULT_PUBLISHED_START_OFFSET_DAYS,
  ENDING_SOON_DAYS_FROM_TODAY,
  EXPIRED_OLD_END_OFFSET_DAYS,
  EXPIRED_OLD_START_OFFSET_DAYS,
  EXPIRED_RECENT_END_OFFSET_DAYS,
  EXPIRED_RECENT_START_OFFSET_DAYS,
} from './defaults'
import { type OpenPlacementProfile, openPlacementProfile } from './openPlacementProfiles'
import { OPEN_JOB_PORTAL_MIX } from './openPortalMix'

type JobMeta = Omit<Job, 'ads'>

const jobsMeta = jobsMetaJson as JobMeta[]

type DateWindow = { publishedFrom: string; publishedTo: string }

function hashCode(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function statsFor(jobId: string, portal: PortalId): PlacementStats {
  const seed = hashCode(`${jobId}:${portal}`)
  const views = 200 + (seed % 2400)
  const clicks = Math.round(views * (0.08 + (seed % 7) / 100))
  const applications = Math.max(1, Math.round(clicks * (0.12 + (seed % 5) / 100)))
  return { views, clicks, applications }
}

function liveWindow(today: string): DateWindow {
  return {
    publishedFrom: addDaysIso(today, DEFAULT_PUBLISHED_START_OFFSET_DAYS),
    publishedTo: addDaysIso(today, DEFAULT_PUBLISHED_RUN_DAYS),
  }
}

function endingSoonWindow(today: string): DateWindow {
  return {
    publishedFrom: addDaysIso(today, DEFAULT_PUBLISHED_START_OFFSET_DAYS),
    publishedTo: addDaysIso(today, ENDING_SOON_DAYS_FROM_TODAY),
  }
}

function expiredRecentWindow(today: string): DateWindow {
  return {
    publishedFrom: addDaysIso(today, EXPIRED_RECENT_START_OFFSET_DAYS),
    publishedTo: addDaysIso(today, EXPIRED_RECENT_END_OFFSET_DAYS),
  }
}

function expiredOldWindow(today: string): DateWindow {
  return {
    publishedFrom: addDaysIso(today, EXPIRED_OLD_START_OFFSET_DAYS),
    publishedTo: addDaysIso(today, EXPIRED_OLD_END_OFFSET_DAYS),
  }
}

function archiveWindow(today: string): DateWindow {
  return {
    publishedFrom: addDaysIso(today, ARCHIVE_START_OFFSET_DAYS),
    publishedTo: addDaysIso(today, ARCHIVE_END_OFFSET_DAYS),
  }
}

function windowForProfile(profile: OpenPlacementProfile, today: string): DateWindow {
  switch (profile) {
    case 'endingSoon':
      return endingSoonWindow(today)
    case 'allExpiredRecent':
      return expiredRecentWindow(today)
    case 'allExpiredOld':
      return expiredOldWindow(today)
    case 'live':
    case 'splitExpiredLive':
    default:
      return liveWindow(today)
  }
}

function buildPlacements(
  jobId: string,
  portals: readonly PortalId[],
  status: JobStatus,
  today: string,
): Placement[] {
  if (status === 'archive') {
    const window = archiveWindow(today)
    return portals.map((portal) => ({
      portal,
      publishedFrom: window.publishedFrom,
      publishedTo: window.publishedTo,
      stats: statsFor(jobId, portal),
    }))
  }

  const profile = openPlacementProfile(jobId)

  if (profile === 'splitExpiredLive') {
    const expired = expiredRecentWindow(today)
    const live = liveWindow(today)
    return portals.map((portal, index) => {
      const window = index === 0 ? expired : live
      return {
        portal,
        publishedFrom: window.publishedFrom,
        publishedTo: window.publishedTo,
        stats: statsFor(jobId, portal),
      }
    })
  }

  const window = windowForProfile(profile, today)
  return portals.map((portal) => ({
    portal,
    publishedFrom: window.publishedFrom,
    publishedTo: window.publishedTo,
    stats: statsFor(jobId, portal),
  }))
}

function buildAd(meta: JobMeta, portals: readonly PortalId[], today: string): Ad {
  return {
    id: `${meta.id}-ad-1`,
    title: meta.title,
    status: 'published',
    department: meta.department,
    placements: buildPlacements(meta.id, portals, meta.status, today),
  }
}

const ARCHIVE_PORTAL_MIX: Record<string, readonly PortalId[]> = {
  'job-005': ['jobs_cz', 'prace_cz'],
  'job-008': ['prace_cz', 'career_pages'],
  'job-012': ['jobs_cz', 'atmoskop'],
  'job-017': ['prace_za_rohem', 'career_pages'],
  'job-019': ['jobs_cz', 'export'],
  'job-020': ['career_pages', 'referral'],
}

function adsForJob(meta: JobMeta, today: string): Ad[] {
  if (meta.status === 'draft') {
    return []
  }

  if (meta.status === 'archive') {
    const portals = ARCHIVE_PORTAL_MIX[meta.id] ?? ['jobs_cz', 'career_pages']
    return [buildAd(meta, portals, today)]
  }

  const portals = OPEN_JOB_PORTAL_MIX[meta.id]
  if (!portals) {
    return []
  }

  return [buildAd(meta, portals, today)]
}

export function buildJobsFromSimplyData(today = todayIso()): Job[] {
  return jobsMeta.map((meta) => ({
    ...meta,
    ads: adsForJob(meta, today),
  }))
}
