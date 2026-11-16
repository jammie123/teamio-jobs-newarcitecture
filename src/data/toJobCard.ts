import type { JobCardV30Props } from '@teamio/starter/components'
import { formatCzechDate, listingTab, todayIso } from './adStatus'
import { highlightDisplayName, portalLabel } from './portals'
import { candidatesOfJob, countJobCandidates } from './jobCandidates'
import type { Ad, Candidate, Highlight, Job, Placement } from './types'

type JobCardV30Data = Pick<
  JobCardV30Props,
  | 'title'
  | 'owner'
  | 'hiringManagers'
  | 'status'
  | 'candidates'
  | 'advertisements'
  | 'note'
  | 'lastChanged'
>

type JobCardV30Advertisement = NonNullable<JobCardV30Props['advertisements']>[number]
type JobCardV30Publication = NonNullable<JobCardV30Advertisement['publications']>[number]
type CardStatus = NonNullable<JobCardV30Props['status']>

export function toJobCard(
  job: Job,
  today = todayIso(),
  jobCandidates: Candidate[] = candidatesOfJob(job.id),
): JobCardV30Data {
  const advertisements = job.ads.map((ad) => toAdvertisement(ad, today))

  return {
    title: job.title,
    owner: job.recruiter,
    hiringManagers: job.hiringManagers,
    status: toCardStatus(job, today),
    candidates: countJobCandidates(jobCandidates),
    advertisements,
    note: toNote(job),
    lastChanged: formatCzechDate(job.createdAt),
  }
}

function toNote(job: Job): JobCardV30Props['note'] {
  if (!job.note) {
    return undefined
  }

  return {
    author: job.recruiter,
    text: job.note.text,
    addedAt: formatCzechDate(job.createdAt),
  }
}

/** V30 renders the ad block for published and unpublished. Archive stays visible as ended ads. */
function toCardStatus(job: Job, today: string): CardStatus {
  const tab = listingTab(job, today)

  if (tab === 'draft') {
    return 'draft'
  }

  if (tab === 'unpublished' || tab === 'archived') {
    return 'unpublished'
  }

  return 'published'
}

function toAdvertisement(ad: Ad, today: string): JobCardV30Advertisement {
  return {
    id: ad.id,
    publications: ad.placements.flatMap((placement) => {
      const dateEnded = placement.publishedTo < today
      // V30 has no turned-off channel. A still-dated disabled channel is not an ended run.
      if (placement.channelDisabled && !dateEnded) {
        return []
      }

      return [toPublication(ad.id, placement, today, dateEnded)]
    }),
  }
}

function toPublication(
  adId: string,
  placement: Placement,
  today: string,
  dateEnded: boolean,
): JobCardV30Publication {
  const highlights = (placement.highlights ?? []).map((highlight) =>
    toHighlight(adId, placement, highlight, today, dateEnded),
  )

  return {
    id: `${adId}-${placement.portal}`,
    channel: portalLabel(placement.portal),
    startDate: formatCzechDate(placement.publishedFrom),
    endDate: formatCzechDate(placement.publishedTo),
    viewCount: placement.stats.views,
    reactionCount: placement.stats.applications,
    ...(dateEnded ? { status: 'expired' as const } : {}),
    ...(highlights.length > 0 ? { highlights } : {}),
  }
}

function toHighlight(
  adId: string,
  placement: Placement,
  highlight: Highlight,
  today: string,
  publicationEnded: boolean,
): NonNullable<JobCardV30Publication['highlights']>[number] {
  const ended = publicationEnded || highlight.publishedTo < today

  return {
    id: `${adId}-${placement.portal}-${highlight.type}`,
    name: highlightDisplayName(highlight.type, placement.portal),
    startDate: formatCzechDate(highlight.publishedFrom),
    endDate: formatCzechDate(highlight.publishedTo),
    viewCount: highlight.stats.views,
    reactionCount: highlight.stats.applications,
    ...(ended ? { status: 'expired' as const } : {}),
  }
}
