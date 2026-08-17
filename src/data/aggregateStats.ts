import type { Ad, Job, Placement, PlacementStats } from './types'

export function sumStats(statsList: PlacementStats[]): PlacementStats {
  return statsList.reduce(
    (acc, stats) => ({
      views: acc.views + stats.views,
      clicks: acc.clicks + stats.clicks,
      applications: acc.applications + stats.applications,
    }),
    { views: 0, clicks: 0, applications: 0 },
  )
}

export function sumPlacementStats(placements: Placement[]): PlacementStats {
  return sumStats(placements.map((placement) => placement.stats))
}

export function statsForAd(ad: Ad): PlacementStats {
  return sumPlacementStats(ad.placements)
}

export function statsForJob(job: Job): PlacementStats {
  return sumStats(job.ads.flatMap((ad) => ad.placements.map((p) => p.stats)))
}
