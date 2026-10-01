import type { JobsFilterOption, JobsFilterValue } from '@teamio/starter/components'
import { computeAdStatus, todayIso } from './adStatus'
import { departmentsOf, type Job } from './types'

export const EMPTY_JOBS_FILTER: JobsFilterValue = {
  query: '',
  recruiterId: '',
  managerId: '',
  departmentId: '',
  employmentType: '',
  advertisementStatus: '',
}

function uniqueSortedOptions(labels: string[]): JobsFilterOption[] {
  return [...new Set(labels)]
    .sort((a, b) => a.localeCompare(b, 'cs'))
    .map((label) => ({ value: label, label }))
}

export function filterOptionsFromJobs(jobs: Job[]) {
  return {
    recruiters: uniqueSortedOptions(jobs.map((job) => job.recruiter)),
    managers: uniqueSortedOptions(jobs.flatMap((job) => job.hiringManagers ?? [])),
    departments: uniqueSortedOptions(jobs.flatMap((job) => departmentsOf(job))),
  }
}

function isPartTime(job: Job) {
  return /zkrácený úvazek/i.test(job.title)
}

function hasActiveAdvertisement(job: Job, today: string) {
  return job.ads.some((ad) => computeAdStatus(ad, today) === 'published')
}

export function jobMatchesFilter(
  job: Job,
  filter: JobsFilterValue,
  today = todayIso(),
): boolean {
  const query = filter.query.trim().toLowerCase()
  if (query && !job.title.toLowerCase().includes(query)) {
    return false
  }

  if (filter.recruiterId && job.recruiter !== filter.recruiterId) {
    return false
  }

  if (filter.managerId && !(job.hiringManagers ?? []).includes(filter.managerId)) {
    return false
  }

  if (filter.departmentId && !departmentsOf(job).includes(filter.departmentId)) {
    return false
  }

  if (filter.employmentType === 'partTime' && !isPartTime(job)) {
    return false
  }

  if (filter.employmentType === 'fullTime' && isPartTime(job)) {
    return false
  }

  if (filter.advertisementStatus === 'active' && !hasActiveAdvertisement(job, today)) {
    return false
  }

  if (filter.advertisementStatus === 'ended' && hasActiveAdvertisement(job, today)) {
    return false
  }

  return true
}
