import { useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Breadcrumbs,
  CANDIDATE_DEFAULT_COLUMNS,
  CandidateColumnsDrawer,
  CandidateListPanel,
  CandidateTable,
  PageHeader,
  PageTemplate,
  Tabs,
  TabsList,
  TabsTrigger,
  type CandidateActionId,
  type CandidateColumnState,
  type LeftMenuItemData,
} from '@teamio/starter/components'
import {
  CANDIDATE_MOVE_TO_OPTIONS,
  CANDIDATE_STATUS_OPTIONS,
  candidates,
  jobs,
  matchesCandidateSearch,
  matchesPipelineStatus,
  newPipelineCounts,
  pipelineCounts,
  pipelineStatusFromSearch,
  toCandidateItem,
  type CandidateStatus,
} from '../data'

const leftMenuItems: LeftMenuItemData[] = [
  { id: 'prehled', label: 'Přehled', icon: 'home', href: '#prehled' },
  { id: 'nabory', label: 'Nábory', icon: 'file-text', href: '/' },
  { id: 'uchazeci', label: 'Uchazeči', icon: 'user', href: '#uchazeci' },
  { id: 'reporty', label: 'Reporty', icon: 'bar-chart', href: '#reporty' },
]

/** Sections of a nábor. Only "Výpis uchazečů" has a page so far, so it is always the active tab. */
const JOB_SECTION_TABS = [
  { value: 'prehled', label: 'Přehled' },
  { value: 'uchazeci', label: 'Výpis uchazečů' },
  { value: 'detail', label: 'Detail náboru' },
]

export function CandidatePerPositionPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [statusFilter, setStatusFilter] = useState<string | undefined>(() =>
    pipelineStatusFromSearch(searchParams),
  )
  const [search, setSearch] = useState('')
  const [columns, setColumns] = useState<CandidateColumnState[]>(CANDIDATE_DEFAULT_COLUMNS)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  /** Status changes made by row and bulk actions; the fixtures themselves stay untouched. */
  const [statusOverrides, setStatusOverrides] = useState<Record<string, CandidateStatus>>({})

  const job = jobs.find((item) => item.id === jobId)

  if (!job) {
    return <Navigate to="/" replace />
  }

  const jobCandidates = candidates
    .filter((candidate) => candidate.jobId === job.id)
    .map((candidate) => {
      const override = statusOverrides[candidate.id]

      // A candidate the recruiter has just moved is no longer new.
      return override ? { ...candidate, status: override, isNew: false } : candidate
    })
  const visibleCandidates = jobCandidates.filter(
    (candidate) =>
      matchesPipelineStatus(candidate, statusFilter) && matchesCandidateSearch(candidate, search),
  )
  // Only candidates in the current view count as selected, so filtering never leaves a hidden selection.
  const visibleSelectedIds = visibleCandidates
    .filter((candidate) => selectedIds.includes(candidate.id))
    .map((candidate) => candidate.id)

  const changeStatus = (ids: string[], status: CandidateStatus) => {
    setStatusOverrides((current) => ({
      ...current,
      ...Object.fromEntries(ids.map((id) => [id, status])),
    }))
    setSelectedIds((current) => current.filter((id) => !ids.includes(id)))
  }

  const handleRowAction = (
    candidate: { id: string },
    actionId: CandidateActionId,
    statusId?: string,
  ) => {
    if (actionId === 'reject') changeStatus([candidate.id], 'rejected')
    if (actionId === 'move' && statusId) changeStatus([candidate.id], statusId as CandidateStatus)
  }

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
          breadcrumbs={
            <Breadcrumbs
              items={[{ label: 'Nábory', onClick: () => navigate('/') }, { label: job.title }]}
            />
          }
          tabs={
            <Tabs value="uchazeci">
              <TabsList aria-label="Sekce náboru">
                {JOB_SECTION_TABS.map((item) => (
                  <TabsTrigger key={item.value} value={item.value}>
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          }
        />
      }
    >
      <CandidateListPanel
        statusCounts={pipelineCounts(jobCandidates)}
        newCounts={newPipelineCounts(jobCandidates)}
        statusValue={statusFilter}
        onStatusChange={setStatusFilter}
        searchValue={search}
        onSearchChange={setSearch}
        onColumnsClick={() => setColumnsOpen(true)}
        selectedCount={visibleSelectedIds.length}
        bulkActions={{
          moveToOptions: CANDIDATE_MOVE_TO_OPTIONS,
          onMoveTo: (statusId) => changeStatus(visibleSelectedIds, statusId as CandidateStatus),
          onReject: () => changeStatus(visibleSelectedIds, 'rejected'),
          onClear: () => setSelectedIds([]),
        }}
      >
        <CandidateTable
          candidates={visibleCandidates.map(toCandidateItem)}
          columns={columns}
          statusOptions={CANDIDATE_STATUS_OPTIONS}
          moveToOptions={CANDIDATE_MOVE_TO_OPTIONS}
          selectedIds={visibleSelectedIds}
          onSelectionChange={setSelectedIds}
          onAction={handleRowAction}
        />
      </CandidateListPanel>
      <CandidateColumnsDrawer
        open={columnsOpen}
        onOpenChange={setColumnsOpen}
        columns={columns}
        onApply={setColumns}
      />
    </PageTemplate>
  )
}
