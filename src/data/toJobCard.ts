import type { JobAdvertisement, JobCardNewProps, JobPublication } from '@teamio/starter/components'
import { formatCzechDate, listingTab, todayIso } from './adStatus'
import { portalLabel } from './portals'
import type { Ad, Job, Placement } from './types'

type JobCardNewData = Pick<
  JobCardNewProps,
  'title' | 'owner' | 'hiringManagers' | 'status' | 'candidates' | 'advertisements'
>

type JobCardNewStatus = NonNullable<JobCardNewProps['status']>

export function toJobCard(job: Job, today = todayIso()): JobCardNewData {
  return {
    title: job.title,
    owner: job.recruiter,
    hiringManagers: job.hiringManagers,
    status: toJobCardStatus(job, today),
    candidates: job.candidates,
    advertisements: job.ads.map((ad) => toAdvertisement(ad, today)),
  }
}

function toJobCardStatus(job: Job, today: string): JobCardNewStatus {
  const tab = listingTab(job, today)
  return tab === 'draft' ? 'active' : tab
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
