import jobsJson from './jobs.json'
import type { Job } from './types'

export const jobs = jobsJson as Job[]

export type {
  Ad,
  Job,
  JobStatus,
  Placement,
  PlacementStats,
  PortalId,
} from './types'

export {
  statsForAd,
  statsForJob,
  sumPlacementStats,
  sumStats,
} from './aggregateStats'

export { PORTAL_LABELS, portalLabel } from './portals'
