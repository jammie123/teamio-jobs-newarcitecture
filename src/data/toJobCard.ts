import type { JobCardSimplify25Props } from '@teamio/starter/components'
import { formatCzechDate, listingTab, todayIso, type JobCardListingStatus } from './adStatus'
import { highlightDisplayName, portalLabel } from './portals'
import { candidatesOfJob, countJobCandidates } from './jobCandidates'
import { departmentsOf, type Ad, type Candidate, type Highlight, type Job, type Placement } from './types'

type JobCardSimplify25Data = Pick<
  JobCardSimplify25Props,
  'title' | 'owner' | 'hiringManagers' | 'branches' | 'candidates' | 'advertisements' | 'note'
>

type JobCardSimplify25Advertisement = NonNullable<JobCardSimplify25Props['advertisements']>[number]
type JobCardSimplify25Publication = NonNullable<JobCardSimplify25Advertisement['publications']>[number]

export function toJobCard(
  job: Job,
  today = todayIso(),
  jobCandidates: Candidate[] = candidatesOfJob(job.id),
): JobCardSimplify25Data {
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
    advertisements: toAdvertisements(job, today, tab),
    note: toNote(job),
  }
}

function toNote(job: Job): JobCardSimplify25Props['note'] {
  if (!job.note) {
    return undefined
  }

  return {
    author: job.recruiter,
    text: job.note.text,
    addedAt: formatCzechDate(job.createdAt),
  }
}

function toAdvertisements(job: Job, today: string, tab: JobCardListingStatus): JobCardSimplify25Advertisement[] {
  if (job.ads.length === 0) {
    return [toNotAdvertisingAdvertisement(job)]
  }

  if (tab === 'draft' && (job.status === 'draft' || job.ads.length > 0)) {
    return toDraftAdvertisements(job)
  }

  return job.ads.map((ad) => toAdvertisement(ad, today))
}

function toNotAdvertisingAdvertisement(job: Job): JobCardSimplify25Advertisement {
  return {
    id: `${job.id}-not-advertising`,
    title: job.title,
    status: 'notAdvertising',
    publications: [],
  }
}

function toDraftAdvertisements(job: Job): JobCardSimplify25Advertisement[] {
  return job.ads.map((ad) => ({
    id: ad.id,
    title: ad.title,
    status: 'draft',
  }))
}

function toAdvertisement(ad: Ad, today: string): JobCardSimplify25Advertisement {
  const publications = ad.placements.map((placement) => toPublication(ad.id, placement, today))

  if (ad.notAdvertising) {
    return {
      id: ad.id,
      title: ad.title,
      status: 'notAdvertising',
      ...(ad.advertisingDeclinedAt
        ? { advertisingDeclinedAt: formatCzechDate(ad.advertisingDeclinedAt) }
        : {}),
      publications,
    }
  }

  return {
    id: ad.id,
    title: ad.title,
    publications,
  }
}

function toPublication(adId: string, placement: Placement, today: string): JobCardSimplify25Publication {
  const highlights = (placement.highlights ?? []).map((highlight) =>
    toHighlight(adId, placement, highlight, today),
  )
  const publication: JobCardSimplify25Publication = {
    id: `${adId}-${placement.portal}`,
    channel: portalLabel(placement.portal),
    startDate: formatCzechDate(placement.publishedFrom),
    endDate: formatCzechDate(placement.publishedTo),
    viewCount: placement.stats.views,
    reactionCount: placement.stats.applications,
    ...(highlights.length > 0 ? { highlights } : {}),
  }

  if (placement.channelDisabled) {
    publication.status = 'disabled'
  } else if (placement.publishedTo < today) {
    publication.status = 'expired'
  }

  return publication
}

function toHighlight(
  adId: string,
  placement: Placement,
  highlight: Highlight,
  today: string,
): NonNullable<JobCardSimplify25Publication['highlights']>[number] {
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
