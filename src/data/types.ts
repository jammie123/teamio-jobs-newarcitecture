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

/** Portal-specific paid highlight. `top` is only valid on jobs.cz and prace.cz. */
export type HighlightType = 'jobstip' | 'supermax' | 'pzr_highlight' | 'top'

export type Highlight = {
  type: HighlightType
  publishedFrom: string
  publishedTo: string
  stats: PlacementStats
}

export type Placement = {
  portal: PortalId
  publishedFrom: string
  publishedTo: string
  stats: PlacementStats
  /** Paid highlights on this vystavení. Omitted when the ad is only published. */
  highlights?: Highlight[]
}

/** `0`, `null`, or omitted = no branch on the card / in filters. A string is the branch name. */
export type JobDepartment = 0 | string | null

export type Ad = {
  id: string
  title: string
  status: AdStatus
  placements: Placement[]
  /** Branch for this advertisement. `0`, `null`, or omitted = no branch. */
  department?: JobDepartment
}

export type JobCandidates = {
  new?: number
  /** Pink notification on Opalcovaný. */
  newOpalcovani?: number
  unassessed: number
  inProgress: number
  total: number
}

/** Recruiter note on a nábor: start date, replacement, or salary. */
export type NoteType = 'start' | 'replacement' | 'salary'

export type Note = {
  type: NoteType
  text: string
}

export type Job = {
  id: string
  title: string
  recruiter: string
  department?: JobDepartment
  hiringManagers?: string[]
  status: JobStatus
  createdAt: string
  note?: Note
  candidates?: JobCandidates
  ads: Ad[]
}

export function visibleDepartment(department?: JobDepartment): string | undefined {
  if (department == null || department === 0) {
    return undefined
  }

  return department
}

/** Unique branch names from ads first; otherwise the job-level department. */
export function departmentsOf(job: Job): string[] {
  const fromAds = [
    ...new Set(
      job.ads.flatMap((ad) => {
        const name = visibleDepartment(ad.department)
        return name ? [name] : []
      }),
    ),
  ]
  if (fromAds.length > 0) {
    return fromAds
  }

  const fromJob = visibleDepartment(job.department)
  return fromJob ? [fromJob] : []
}
