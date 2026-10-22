import jobsMetaJson from './jobsMeta.json'
import { addDaysIso, todayIso } from '../adStatus'
import type { Ad, Job, JobStatus, Placement, PlacementStats, PortalId } from '../types'
import {
  ARCHIVE_END_OFFSET_DAYS,
  ARCHIVE_START_OFFSET_DAYS,
  DEFAULT_PUBLISHED_RUN_DAYS,
  DEFAULT_PUBLISHED_START_OFFSET_DAYS,
  ENDING_SOON_DAYS_FROM_TODAY,
  ENDING_SOON_JOB_IDS,
} from './defaults'
import { OPEN_JOB_PORTAL_MIX } from './openPortalMix'

type JobMeta = Omit<Job, 'ads'>

const jobsMeta = jobsMetaJson as JobMeta[]

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

function placementWindow(
  jobId: string,
  status: JobStatus,
  today: string,
): { publishedFrom: string; publishedTo: string } {
  if (status === 'archive') {
    return {
      publishedFrom: addDaysIso(today, ARCHIVE_START_OFFSET_DAYS),
      publishedTo: addDaysIso(today, ARCHIVE_END_OFFSET_DAYS),
    }
  }

  if (ENDING_SOON_JOB_IDS.has(jobId)) {
    return {
      publishedFrom: addDaysIso(today, DEFAULT_PUBLISHED_START_OFFSET_DAYS),
      publishedTo: addDaysIso(today, ENDING_SOON_DAYS_FROM_TODAY),
    }
  }

  return {
    publishedFrom: addDaysIso(today, DEFAULT_PUBLISHED_START_OFFSET_DAYS),
    publishedTo: addDaysIso(today, DEFAULT_PUBLISHED_RUN_DAYS),
  }
}

function buildPlacements(jobId: string, portals: readonly PortalId[], status: JobStatus, today: string): Placement[] {
  const window = placementWindow(jobId, status, today)
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

function adsForJob(meta: JobMeta, today: string): Ad[] {
  if (meta.status === 'draft') {
    return []
  }

  if (meta.status === 'archive') {
    return [buildAd(meta, ['jobs_cz', 'career_pages'], today)]
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
