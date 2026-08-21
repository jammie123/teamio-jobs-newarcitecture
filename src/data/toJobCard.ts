import type { JobAdvertisement, JobPublication } from '@teamio/starter/components'
import { formatCzechDate, listingTab, todayIso } from './adStatus'
import { portalLabel } from './portals'
import type { Ad, Job, Placement } from './types'

export function toJobCard(job: Job, today = todayIso()) {
  return {
    title: job.title,
    owner: job.recruiter,
    hiringManagers: job.hiringManagers,
    status: listingTab(job, today),
    candidates: job.candidates,
    advertisements: job.ads.map((ad) => toAdvertisement(ad, today)),
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
  }

  if (placement.publishedTo < today) {
    publication.status = 'expired'
  }

  return publication
}
