import type { JobCardV8Props } from '@teamio/starter/components'
import { formatCzechDate, listingTab, todayIso } from './adStatus'
import { highlightDisplayName, portalLabel } from './portals'
import { candidatesOfJob, countJobCandidates } from './jobCandidates'
import type { Ad, Candidate, Highlight, Job, Placement } from './types'

type JobCardV8Data = Pick<
  JobCardV8Props,
  'title' | 'owner' | 'hiringManagers' | 'status' | 'candidates' | 'advertisements' | 'note' | 'showAdvertisementTitle'
>

type JobCardV8Advertisement = NonNullable<JobCardV8Props['advertisements']>[number]
type JobCardV8Publication = NonNullable<JobCardV8Advertisement['publications']>[number]
type CardStatus = NonNullable<JobCardV8Props['status']>

export function toJobCard(
  job: Job,
  today = todayIso(),
  jobCandidates: Candidate[] = candidatesOfJob(job.id),
): JobCardV8Data {
  const advertisements = job.ads.map((ad) => toAdvertisement(ad, today))

  return {
    title: job.title,
    owner: job.recruiter,
    hiringManagers: job.hiringManagers,
    status: toCardStatus(job, today),
    candidates: countJobCandidates(jobCandidates),
    advertisements,
    showAdvertisementTitle: advertisements.length > 1,
    note: toNote(job),
  }
}

function toNote(job: Job): JobCardV8Props['note'] {
  if (!job.note) {
    return undefined
  }

  return {
    author: job.recruiter,
    text: job.note.text,
    addedAt: formatCzechDate(job.createdAt),
  }
}

/** V8 renders the ad block for published and unpublished. Archive stays visible as ended ads. */
function toCardStatus(job: Job, today: string): CardStatus {
  const tab = listingTab(job, today)

  if (tab === 'unpublished' || tab === 'archived') {
    return 'unpublished'
  }

  return 'published'
}

function toAdvertisement(ad: Ad, today: string): JobCardV8Advertisement {
  return {
    id: ad.id,
    title: ad.title,
    publications: ad.placements.flatMap((placement) => {
      const dateEnded = placement.publishedTo < today
      // V8 has no turned-off channel. A still-dated disabled channel is not an ended run.
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
): JobCardV8Publication {
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
): NonNullable<JobCardV8Publication['highlights']>[number] {
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
