import type { JobCardSimplify4Props } from '@teamio/starter/components'
import { formatCzechDate, listingTab, todayIso } from './adStatus'
import { highlightDisplayName, portalLabel } from './portals'
import { candidatesOfJob, countJobCandidates } from './jobCandidates'
import { departmentsOf, type Ad, type Candidate, type Highlight, type Job, type Placement } from './types'

type JobCardSimplify4Data = Pick<
  JobCardSimplify4Props,
  'title' | 'owner' | 'hiringManagers' | 'branches' | 'candidates' | 'advertisements' | 'note'
>

type JobCardSimplify4Advertisement = NonNullable<JobCardSimplify4Props['advertisements']>[number]
type JobCardSimplify4Publication = NonNullable<JobCardSimplify4Advertisement['publications']>[number]

export function toJobCard(
  job: Job,
  today = todayIso(),
  jobCandidates: Candidate[] = candidatesOfJob(job.id),
): JobCardSimplify4Data {
  const tab = listingTab(job, today)

  return {
    title: job.title,
    owner: job.recruiter,
    hiringManagers: job.hiringManagers,
    branches: departmentsOf(job).map((name) => ({
      id: name,
      name,
    })),
    candidates: countJobCandidates(jobCandidates),
    advertisements:
      tab === 'draft' && (job.status === 'draft' || job.ads.length > 0)
        ? toDraftAdvertisements(job)
        : job.ads.map((ad) => toAdvertisement(ad, today)),
    note: toNote(job),
  }
}

function toNote(job: Job): JobCardSimplify4Props['note'] {
  if (!job.note) {
    return undefined
  }

  return {
    author: job.recruiter,
    text: job.note.text,
    addedAt: formatCzechDate(job.createdAt),
  }
}

function toDraftAdvertisements(job: Job): JobCardSimplify4Advertisement[] {
  if (job.ads.length === 0) {
    return [{ id: `${job.id}-draft`, title: job.title, status: 'draft' }]
  }

  return job.ads.map((ad) => ({
    id: ad.id,
    title: ad.title,
    status: 'draft',
  }))
}

function toAdvertisement(ad: Ad, today: string): JobCardSimplify4Advertisement {
  return {
    id: ad.id,
    title: ad.title,
    publications: ad.placements.map((placement) => toPublication(ad.id, placement, today)),
  }
}

function toPublication(adId: string, placement: Placement, today: string): JobCardSimplify4Publication {
  const highlights = (placement.highlights ?? []).map((highlight) =>
    toHighlight(adId, placement, highlight, today),
  )
  const publication: JobCardSimplify4Publication = {
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
): NonNullable<JobCardSimplify4Publication['highlights']>[number] {
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
