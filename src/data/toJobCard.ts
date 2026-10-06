import type { JobCardSimplify3Props } from '@teamio/starter/components'
import { formatCzechDate, listingTab, todayIso } from './adStatus'
import { highlightDisplayName, portalLabel } from './portals'
import { departmentsOf, type Ad, type Highlight, type Job, type JobCandidates, type Placement } from './types'

type JobCardSimplify3Data = Pick<
  JobCardSimplify3Props,
  'title' | 'owner' | 'hiringManagers' | 'branches' | 'candidates' | 'advertisements' | 'note'
>

type JobCardSimplify3Candidates = NonNullable<JobCardSimplify3Props['candidates']>
type JobCardSimplify3Advertisement = NonNullable<JobCardSimplify3Props['advertisements']>[number]
type JobCardSimplify3Publication = NonNullable<JobCardSimplify3Advertisement['publications']>[number]

const EMPTY_CANDIDATES: JobCardSimplify3Candidates = {
  new: 0,
  unassessed: 0,
  preselected: 0,
  opalcovani: 0,
  invited: 0,
  hired: 0,
}

export function toJobCard(job: Job, today = todayIso()): JobCardSimplify3Data {
  const tab = listingTab(job, today)

  return {
    title: job.title,
    owner: job.recruiter,
    hiringManagers: job.hiringManagers,
    branches: departmentsOf(job).map((name) => ({
      id: name,
      name,
    })),
    candidates: toSyntezaCandidates(job.candidates) ?? (tab === 'draft' ? EMPTY_CANDIDATES : undefined),
    advertisements:
      tab === 'draft'
        ? toDraftAdvertisements(job)
        : job.ads.map((ad) => toAdvertisement(ad, today)),
    note: toNote(job),
  }
}

function toSyntezaCandidates(candidates?: JobCandidates): JobCardSimplify3Candidates | undefined {
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
  const newOpalcovani =
    candidates.newOpalcovani && opalcovani > 0
      ? Math.min(candidates.newOpalcovani, opalcovani)
      : undefined

  return {
    new: candidates.new ?? 0,
    unassessed: candidates.unassessed,
    preselected,
    opalcovani,
    ...(newOpalcovani ? { newOpalcovani } : {}),
    invited,
    hired,
    total: candidates.total,
  }
}

function toNote(job: Job): JobCardSimplify3Props['note'] {
  if (!job.note) {
    return undefined
  }

  return {
    author: job.recruiter,
    text: job.note.text,
    addedAt: formatCzechDate(job.createdAt),
  }
}

function toDraftAdvertisements(job: Job): JobCardSimplify3Advertisement[] {
  if (job.ads.length === 0) {
    return [{ id: `${job.id}-draft`, title: job.title, status: 'draft' }]
  }

  return job.ads.map((ad) => ({
    id: ad.id,
    title: ad.title,
    status: 'draft',
  }))
}

function toAdvertisement(ad: Ad, today: string): JobCardSimplify3Advertisement {
  return {
    id: ad.id,
    title: ad.title,
    publications: ad.placements.map((placement) => toPublication(ad.id, placement, today)),
  }
}

function toPublication(adId: string, placement: Placement, today: string): JobCardSimplify3Publication {
  const highlights = (placement.highlights ?? []).map((highlight) =>
    toHighlight(adId, placement, highlight, today),
  )
  const publication: JobCardSimplify3Publication = {
    id: `${adId}-${placement.portal}`,
    channel: portalLabel(placement.portal),
    startDate: formatCzechDate(placement.publishedFrom),
    endDate: formatCzechDate(placement.publishedTo),
    viewCount: placement.stats.views,
    reactionCount: placement.stats.applications,
    ...(highlights.length > 0 ? { highlights } : {}),
  }

  if (placement.publishedTo < today) {
    publication.status = 'expired'
  }

  return publication
}

function toHighlight(
  adId: string,
  placement: Placement,
  highlight: Highlight,
  today: string,
): NonNullable<JobCardSimplify3Publication['highlights']>[number] {
  const mapped = {
    id: `${adId}-${placement.portal}-${highlight.type}`,
    name: highlightDisplayName(highlight.type, placement.portal),
    kind: highlight.type,
    startDate: formatCzechDate(highlight.publishedFrom),
    endDate: formatCzechDate(highlight.publishedTo),
    viewCount: highlight.stats.views,
    reactionCount: highlight.stats.applications,
  }

  if (highlight.publishedTo < today) {
    return { ...mapped, status: 'expired' as const }
  }

  return mapped
}
