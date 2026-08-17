export type JobStatus = 'open' | 'closed'

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
  placements: Placement[]
}

export type Job = {
  id: string
  title: string
  recruiter: string
  status: JobStatus
  ads: Ad[]
}
