import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import {
  CandidateTable,
  JobsPipeline,
  PageHeader,
  PageTemplate,
  type LeftMenuItemData,
} from '@teamio/starter/components'
import {
  CANDIDATE_STATUS_OPTIONS,
  candidates,
  jobs,
  matchesPipelineStatus,
  pipelineCounts,
  toCandidateItem,
} from '../data'

const leftMenuItems: LeftMenuItemData[] = [
  { id: 'prehled', label: 'Přehled', icon: 'home', href: '#prehled' },
  { id: 'nabory', label: 'Nábory', icon: 'file-text', href: '/' },
  { id: 'uchazeci', label: 'Uchazeči', icon: 'user', href: '#uchazeci' },
  { id: 'reporty', label: 'Reporty', icon: 'bar-chart', href: '#reporty' },
]

export function CandidatePerPositionPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)

  const job = jobs.find((item) => item.id === jobId)

  if (!job) {
    return <Navigate to="/" replace />
  }

  const jobCandidates = candidates.filter((candidate) => candidate.jobId === job.id)
  const visibleCandidates = jobCandidates.filter((candidate) =>
    matchesPipelineStatus(candidate, statusFilter),
  )

  return (
    <PageTemplate
      leftMenu={{
        items: leftMenuItems,
        activeItemId: 'uchazeci',
      }}
      headerTop={{
        user: {
          name: 'Jan Fuxa',
          company: 'LMCTEST_Teamio s.r.o.',
        },
      }}
      pageHeader={
        <PageHeader
          title={
            <>
              {job.title}{' '}
              <span className="tm-font-normal tm-text-secondary-default">
                ({jobCandidates.length})
              </span>
            </>
          }
          aria-label={job.title}
        />
      }
    >
      <div className="tm-flex tm-w-full tm-flex-col tm-gap-4">
        <JobsPipeline
          statusCounts={pipelineCounts(jobCandidates)}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <CandidateTable
          candidates={visibleCandidates.map(toCandidateItem)}
          statusOptions={CANDIDATE_STATUS_OPTIONS}
        />
      </div>
    </PageTemplate>
  )
}
