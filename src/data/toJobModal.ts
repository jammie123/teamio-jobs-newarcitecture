import {
  jobPortalLogoTypeFromChannel,
  type JobModalAdvertisement,
  type JobModalAdvertisementSection,
  type JobModalPublicationPlace,
} from '@teamio/starter/components'
import { formatCzechDate } from './adStatus'
import { HIGHLIGHTS_BY_PORTAL, portalLabel } from './portals'
import type { Ad, Job, Placement } from './types'

export type JobAdAction = 'unpublish' | 'prolong' | 'top'

export function toModalAdvertisements(job: Job): JobModalAdvertisement[] {
  const createdAt = formatCzechDate(job.createdAt)
  return job.ads.map((ad) => ({
    id: ad.id,
    title: ad.title,
    createdAt,
  }))
}

export function toModalPlaces(ad: Ad): JobModalPublicationPlace[] {
  return ad.placements.map((placement) => toModalPlace(ad.id, placement))
}

export function toTopPlaces(ad: Ad): JobModalPublicationPlace[] {
  const topPlacements = ad.placements.filter((placement) =>
    HIGHLIGHTS_BY_PORTAL[placement.portal].includes('top'),
  )

  return (topPlacements.length > 0 ? topPlacements : ad.placements).map((placement) =>
    toModalPlace(ad.id, placement),
  )
}

export function toModalPlacesForAction(ad: Ad, action: JobAdAction): JobModalPublicationPlace[] {
  return action === 'top' ? toTopPlaces(ad) : toModalPlaces(ad)
}

export function toModalAdvertisementSections(
  job: Job,
  ads: Ad[],
  action: JobAdAction,
): JobModalAdvertisementSection[] {
  const createdAt = formatCzechDate(job.createdAt)
  return ads.map((ad) => ({
    advertisement: {
      id: ad.id,
      title: ad.title,
      createdAt,
    },
    places: toModalPlacesForAction(ad, action),
  }))
}

function toModalPlace(adId: string, placement: Placement): JobModalPublicationPlace {
  const name = portalLabel(placement.portal)
  return {
    id: `${adId}-${placement.portal}`,
    name,
    startDate: formatCzechDate(placement.publishedFrom),
    endDate: formatCzechDate(placement.publishedTo),
    logoType: jobPortalLogoTypeFromChannel(name),
  }
}
