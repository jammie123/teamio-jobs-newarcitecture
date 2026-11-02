export type JobStatus = 'open' | 'draft' | 'archive'

export type AdStatus = 'published' | 'unpublished'

export type PortalId =
  | 'jobs_cz'
  | 'prace_cz'
  | 'prace_za_rohem'
  | 'atmoskop'
  | 'career_pages'
  | 'referral'
  | 'export'

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
  /** Consciously turned-off channel (JobCardSimplify17). */
  channelDisabled?: boolean
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
  /** User stopped advertising on this nábor (JobCardSimplify17). */
  notAdvertising?: boolean
  /** ISO date when advertising was declined; shown in card meta. */
  advertisingDeclinedAt?: string
}

/** Recruiter note on a nábor: start date, replacement, or salary. */
export type NoteType = 'start' | 'replacement' | 'salary'

export type Note = {
  type: NoteType
  text: string
}

export type CandidateStatus =
  | 'unassessed'
  | 'preselected'
  | 'round1'
  | 'round2'
  | 'offer'
  | 'rejected'
  | 'hired'

export type CandidateSource = Extract<PortalId, 'jobs_cz' | 'prace_cz' | 'career_pages'>

export type Candidate = {
  id: string
  /** References `Job.id` in jobsMeta / built jobs. */
  jobId: string
  fullName: string
  phone: string
  /** Star rating 0–5 (0 = not rated). */
  stars: number
  status: CandidateStatus
  /** ISO date `YYYY-MM-DD`, or `null` when there was no contact yet. */
  lastContact: string | null
  source: CandidateSource
  note?: string
  /**
   * Not yet seen by the recruiter. Counts as "Nový" on the job card when `unassessed`, and as the
   * pink "new Opalcovaný" notification when in `offer`.
   */
  isNew?: boolean
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
