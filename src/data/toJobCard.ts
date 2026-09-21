import type { JobAdvertisement, JobCardSyntezaProps, JobPublication } from '@teamio/starter/components'
import { formatCzechDate, todayIso } from './adStatus'
import { portalLabel } from './portals'
import type { Ad, Job, JobCandidates, Placement } from './types'

type JobCardSyntezaData = Pick<
  JobCardSyntezaProps,
  'title' | 'owner' | 'hiringManagers' | 'candidates' | 'advertisements' | 'note'
>

type JobCardSyntezaCandidates = NonNullable<JobCardSyntezaProps['candidates']>

export function toJobCard(job: Job, today = todayIso()): JobCardSyntezaData {
  return {
    title: job.title,
    owner: job.recruiter,
    hiringManagers: job.hiringManagers,
    candidates: toSyntezaCandidates(job.candidates),
    advertisements: job.ads.map((ad) => toAdvertisement(ad, today)),
    note: toNote(job),
  }
}

function toSyntezaCandidates(candidates?: JobCandidates): JobCardSyntezaCandidates | undefined {
  if (!candidates) {
    return undefined
  }

  const inProgress = candidates.inProgress
  const preselected = Math.ceil(inProgress / 2)
  const remaining = inProgress - preselected
  const opalcovani = Math.ceil(remaining / 2)
  const invited = remaining - opalcovani
  const leftover = Math.max(
    0,
    candidates.total - (candidates.new ?? 0) - candidates.unassessed - inProgress,
  )
  const hired =
    leftover === 0 ? 0 : Math.min(leftover, Math.max(1, Math.round(leftover * 0.08)))

  return {
    new: candidates.new ?? 0,
    unassessed: candidates.unassessed,
    preselected,
    opalcovani,
    invited,
    hired,
  }
}

function toNote(job: Job): JobCardSyntezaProps['note'] {
  if (!job.note) {
    return undefined
  }

  return {
    author: job.recruiter,
    text: job.note.text,
    addedAt: formatCzechDate(job.createdAt),
  }
}

function toAdvertisement(ad: Ad, today: string): JobAdvertisement {
  return {
    id: ad.id,
    title: ad.title,
    publications: ad.placements.map((placement) => toPublication(ad.id, placement, today)),
  }
}

function toPublication(adId: string, placement: Placement, today: string): JobPublication {
  const publication: JobPublication = {
    id: `${adId}-${placement.portal}`,
    channel: portalLabel(placement.portal),
    startDate: formatCzechDate(placement.publishedFrom),
    endDate: formatCzechDate(placement.publishedTo),
    viewCount: placement.stats.views,
    reactionCount: placement.stats.applications,
  }

  if (placement.publishedTo < today) {
    publication.status = 'expired'
  }

  return publication
}
