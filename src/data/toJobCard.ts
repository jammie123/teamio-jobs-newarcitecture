import type { JobCardSimplify2Props } from '@teamio/starter/components'
import { formatCzechDate, listingTab, todayIso } from './adStatus'
import { portalLabel } from './portals'
import type { Ad, Job, JobCandidates, Placement } from './types'

type JobCardSimplify2Data = Pick<
  JobCardSimplify2Props,
  'title' | 'owner' | 'hiringManagers' | 'candidates' | 'advertisements' | 'note'
>

type JobCardSimplify2Candidates = NonNullable<JobCardSimplify2Props['candidates']>
type JobCardSimplify2Advertisement = NonNullable<JobCardSimplify2Props['advertisements']>[number]
type JobCardSimplify2Publication = NonNullable<JobCardSimplify2Advertisement['publications']>[number]

const EMPTY_CANDIDATES: JobCardSimplify2Candidates = {
  new: 0,
  unassessed: 0,
  preselected: 0,
  opalcovani: 0,
  invited: 0,
  hired: 0,
}

export function toJobCard(job: Job, today = todayIso()): JobCardSimplify2Data {
  const tab = listingTab(job, today)

  return {
    title: job.title,
    owner: job.recruiter,
    hiringManagers: job.hiringManagers,
    candidates: toSyntezaCandidates(job.candidates) ?? (tab === 'draft' ? EMPTY_CANDIDATES : undefined),
    advertisements:
      tab === 'draft'
        ? toDraftAdvertisements(job)
        : job.ads.map((ad) => toAdvertisement(ad, today)),
    note: toNote(job),
  }
}

function toSyntezaCandidates(candidates?: JobCandidates): JobCardSimplify2Candidates | undefined {
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

function toNote(job: Job): JobCardSimplify2Props['note'] {
  if (!job.note) {
    return undefined
  }

  return {
    author: job.recruiter,
    text: job.note.text,
    addedAt: formatCzechDate(job.createdAt),
  }
}

function toDraftAdvertisements(job: Job): JobCardSimplify2Advertisement[] {
  if (job.ads.length === 0) {
    return [{ id: `${job.id}-draft`, title: job.title, status: 'draft' }]
  }

  return job.ads.map((ad) => ({
    id: ad.id,
    title: ad.title,
    status: 'draft',
  }))
}

function toAdvertisement(ad: Ad, today: string): JobCardSimplify2Advertisement {
  return {
    id: ad.id,
    title: ad.title,
    publications: ad.placements.map((placement) => toPublication(ad.id, placement, today)),
  }
}

function toPublication(adId: string, placement: Placement, today: string): JobCardSimplify2Publication {
  const publication: JobCardSimplify2Publication = {
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
