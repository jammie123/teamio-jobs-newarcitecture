import { todayIso } from './adStatus'
import type { Job } from './types'

export type JobSortKey = 'latestAd' | 'newestJob' | 'endingSoon' | 'mostCandidates' | 'titleAz'

export type JobSortOption = {
  key: JobSortKey
  label: string
  description?: string
}

export const DEFAULT_JOB_SORT: JobSortKey = 'latestAd'

export const JOB_SORT_OPTIONS: JobSortOption[] = [
  {
    key: 'latestAd',
    label: 'Nejnověji vystavený inzerát',
    description: 'Vystavení inzerátu, topování a zvýraznění',
  },
  { key: 'newestJob', label: 'Nejnovější nábor' },
  { key: 'endingSoon', label: 'Nejdřív končí inzerát' },
  { key: 'mostCandidates', label: 'Nejvíc uchazečů' },
  { key: 'titleAz', label: 'Název A–Z' },
]

const countFormat = new Intl.NumberFormat('cs-CZ')

export function formatJobCount(count: number): string {
  const formatted = countFormat.format(count)
  const absolute = Math.abs(count)
  const mod10 = absolute % 10
  const mod100 = absolute % 100

  if (mod10 === 1 && mod100 !== 11) {
    return `${formatted} nábor`
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${formatted} nábory`
  }

  return `${formatted} náborů`
}

export function jobSortLabel(key: JobSortKey): string {
  return JOB_SORT_OPTIONS.find((option) => option.key === key)?.label ?? JOB_SORT_OPTIONS[0].label
}

function maxIso(dates: string[]): string | null {
  if (dates.length === 0) {
    return null
  }

  return dates.reduce((latest, date) => (date > latest ? date : latest))
}

function minIso(dates: string[]): string | null {
  if (dates.length === 0) {
    return null
  }

  return dates.reduce((soonest, date) => (date < soonest ? date : soonest))
}

function latestAdDate(job: Job): string | null {
  return maxIso(
    job.ads.flatMap((ad) =>
      ad.placements.flatMap((placement) => [
        placement.publishedFrom,
        ...(placement.highlights ?? []).map((highlight) => highlight.publishedFrom),
      ]),
    ),
  )
}

function soonestLiveAdEnd(job: Job, today: string): string | null {
  return minIso(
    job.ads.flatMap((ad) =>
      ad.placements
        .filter((placement) => placement.publishedTo >= today)
        .map((placement) => placement.publishedTo),
    ),
  )
}

function compareDesc(a: string | number | null, b: string | number | null): number {
  if (a == null && b == null) {
    return 0
  }

  if (a == null) {
    return 1
  }

  if (b == null) {
    return -1
  }

  if (a === b) {
    return 0
  }

  return a < b ? 1 : -1
}

function compareAsc(a: string | number | null, b: string | number | null): number {
  if (a == null && b == null) {
    return 0
  }

  if (a == null) {
    return 1
  }

  if (b == null) {
    return -1
  }

  if (a === b) {
    return 0
  }

  return a < b ? -1 : 1
}

function compareTieBreak(a: Job, b: Job): number {
  const byCreated = compareDesc(a.createdAt, b.createdAt)
  if (byCreated !== 0) {
    return byCreated
  }

  return a.title.localeCompare(b.title, 'cs')
}

export function sortJobs(jobs: Job[], key: JobSortKey, today = todayIso()): Job[] {
  return [...jobs].sort((a, b) => {
    let primary = 0

    switch (key) {
      case 'latestAd':
        primary = compareDesc(latestAdDate(a), latestAdDate(b))
        break
      case 'newestJob':
        primary = compareDesc(a.createdAt, b.createdAt)
        break
      case 'endingSoon':
        primary = compareAsc(soonestLiveAdEnd(a, today), soonestLiveAdEnd(b, today))
        break
      case 'mostCandidates':
        primary = compareDesc(a.candidates?.total ?? 0, b.candidates?.total ?? 0)
        break
      case 'titleAz':
        primary = a.title.localeCompare(b.title, 'cs')
        break
    }

    return primary !== 0 ? primary : compareTieBreak(a, b)
  })
}
