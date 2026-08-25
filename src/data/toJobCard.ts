import type { JobAdvertisement, JobPublication, JobPublicationHighlight } from '@teamio/starter/components'
import { formatCzechDate, listingTab, todayIso } from './adStatus'
import { highlightLabel, portalLabel } from './portals'
import type { Ad, Highlight, Job, Placement } from './types'

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

function toHighlight(adId: string, portal: Placement['portal'], highlight: Highlight, today: string): JobPublicationHighlight {
  const mapped: JobPublicationHighlight = {
    id: `${adId}-${portal}-${highlight.type}-${highlight.publishedFrom}`,
    name: highlightLabel(highlight.type),
    startDate: formatCzechDate(highlight.publishedFrom),
    endDate: formatCzechDate(highlight.publishedTo),
    viewCount: highlight.stats.views,
    reactionCount: highlight.stats.applications,
  }

  if (highlight.publishedTo < today) {
    mapped.status = 'expired'
  }

  return mapped
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

  if (placement.highlights?.length) {
    publication.highlights = placement.highlights.map((highlight) =>
      toHighlight(adId, placement.portal, highlight, today),
    )
  }

  if (placement.publishedTo < today) {
    publication.status = 'expired'
  }

  return publication
}
