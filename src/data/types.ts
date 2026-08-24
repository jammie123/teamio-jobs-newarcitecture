export type JobStatus = 'open' | 'draft' | 'archive'

export type AdStatus = 'published' | 'unpublished'

export type PortalId =
  | 'jobs_cz'
  | 'prace_cz'
  | 'prace_za_rohem'
  | 'atmoskop'
  | 'career_pages'

export type PlacementStats = {
  views: number
  clicks: number
  applications: number
}

export type Placement = {
  portal: PortalId
  publishedFrom: string
  publishedTo: string
  stats: PlacementStats
}

export type Ad = {
  id: string
  title: string
  status: AdStatus
  placements: Placement[]
}

export type JobCandidates = {
  new?: number
  unassessed: number
  inProgress: number
  total: number
}

/** `0` or omitted = no branch on the card / in filters. A string is the branch name. */
export type JobDepartment = 0 | string

export type Job = {
  id: string
  title: string
  recruiter: string
  department?: JobDepartment
  hiringManagers?: string[]
  status: JobStatus
  createdAt: string
  candidates?: JobCandidates
  ads: Ad[]
}

export function visibleDepartment(department?: JobDepartment): string | undefined {
  if (department == null || department === 0) {
    return undefined
  }

  return department
}
