import type { JobCardV40Props } from '@teamio/starter/components'
import { formatCzechDate, jobUnpublishedByRecruiter, listingTab, todayIso } from './adStatus'
import { highlightDisplayName, portalLabel } from './portals'
import { candidatesOfJob, countJobCandidates } from './jobCandidates'
import { departmentsOf, type Ad, type Candidate, type Highlight, type Job, type Placement } from './types'

type JobCardV40Data = Pick<
  JobCardV40Props,
  | 'title'
  | 'department'
  | 'owner'
  | 'hiringManagers'
  | 'status'
  | 'candidates'
  | 'advertisements'
  | 'note'
  | 'lastChanged'
>

type JobCardV40Advertisement = NonNullable<JobCardV40Props['advertisements']>[number]
type JobCardV40Publication = NonNullable<JobCardV40Advertisement['publications']>[number]
type CardStatus = NonNullable<JobCardV40Props['status']>

export function toJobCard(
  job: Job,
  today = todayIso(),
  jobCandidates: Candidate[] = candidatesOfJob(job.id),
): JobCardV40Data {
  const advertisements = job.ads.map((ad) => toAdvertisement(ad, today))

  return {
    title: job.title,
    department: departmentsOf(job)[0],
    owner: job.recruiter,
    hiringManagers: job.hiringManagers,
    status: toCardStatus(job, today),
    candidates: countJobCandidates(jobCandidates),
    advertisements,
    note: toNote(job),
    lastChanged: formatCzechDate(job.createdAt),
  }
}

function toNote(job: Job): JobCardV40Props['note'] {
  if (!job.note) {
    return undefined
  }

  return {
    author: job.recruiter,
    text: job.note.text,
    addedAt: formatCzechDate(job.createdAt),
  }
}

/**
 * V40: unpublished = recruiter ended („Ukončené vystavování“). Date-expired ads stay
 * published so the card can show „Expirováno nedávno“ / „Expirováno“ from the end dates.
 */
function toCardStatus(job: Job, today: string): CardStatus {
  const tab = listingTab(job, today)

  if (tab === 'draft') {
    return 'draft'
  }

  if (tab === 'archived') {
    return 'archived'
  }

  if (tab === 'unpublished' && jobUnpublishedByRecruiter(job)) {
    return 'unpublished'
  }

  return 'published'
}

function toAdvertisement(ad: Ad, today: string): JobCardV40Advertisement {
  return {
    id: ad.id,
    publications: ad.placements.flatMap((placement) => {
      const dateEnded = placement.publishedTo < today
      // V40 has no turned-off channel. A still-dated disabled channel is not an ended run.
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
): JobCardV40Publication {
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
): NonNullable<JobCardV40Publication['highlights']>[number] {
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
