import { useState } from 'react'
import {
  JobCard,
  JobsFilter,
  Option,
  PageHeader,
  PageTemplate,
  SplitButton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Typography,
  type JobsFilterValue,
  type LeftMenuItemData,
} from '@teamio/starter/components'
import {
  EMPTY_JOBS_FILTER,
  filterOptionsFromJobs,
  jobMatchesFilter,
  jobs,
  jobsForTab,
  toJobCard,
  type JobListingTab,
} from '../data'

const leftMenuItems: LeftMenuItemData[] = [
  { id: 'prehled', label: 'Přehled', icon: 'home', href: '#prehled' },
  { id: 'nabory', label: 'Nábory', icon: 'file-text', href: '#nabory' },
  { id: 'uchazeci', label: 'Uchazeči', icon: 'user', href: '#uchazeci' },
  { id: 'reporty', label: 'Reporty', icon: 'bar-chart', href: '#reporty' },
]

const TABS: Array<{ value: JobListingTab; label: string }> = [
  { value: 'published', label: 'Zveřejněný' },
  { value: 'unpublished', label: 'Nezveřejněný' },
  { value: 'draft', label: 'Rozpracovaný' },
  { value: 'archived', label: 'Archivní' },
]

const filterOptions = filterOptionsFromJobs(jobs)

const noop = () => undefined

const jobCardNoops = {
  onEditJob: noop,
  onDuplicateJob: noop,
  onInviteColleagues: noop,
  onTransferJob: noop,
  onArchiveJob: noop,
  onEditAdvertisement: noop,
  onExtendAndRepublish: noop,
  onEndPublication: noop,
  onCreateAdvertisement: noop,
  onCandidatesClick: noop,
  onStatusChange: noop,
  onCompleteDraft: noop,
  onGoToPublish: noop,
  onRestoreFromArchive: noop,
}

function JobCardList({ tab, filter }: { tab: JobListingTab; filter: JobsFilterValue }) {
  const items = jobsForTab(jobs, tab).filter((job) => jobMatchesFilter(job, filter))

  if (items.length === 0) {
    return (
      <Typography variant="body" className="tm-text-secondary-default">
        Žádné nábory v tomto filtru.
      </Typography>
    )
  }

  return (
    <div className="tm-flex tm-flex-col tm-gap-4">
      {items.map((job) => (
        <JobCard key={job.id} {...toJobCard(job)} {...jobCardNoops} />
      ))}
    </div>
  )
}

export function JobListingPage() {
  const [filter, setFilter] = useState<JobsFilterValue>(EMPTY_JOBS_FILTER)

  return (
    <Tabs defaultValue="published" className="tm-contents">
      <PageTemplate
        leftMenu={{
          items: leftMenuItems,
          activeItemId: 'nabory',
        }}
        headerTop={{
          user: {
            name: 'Jan Fuxa',
            company: 'LMCTEST_Teamio s.r.o.',
          },
        }}
        pageHeader={
          <PageHeader
            title="Nábory"
            tabs={
              <TabsList aria-label="Filtry náborů">
                {TABS.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            }
            actions={
              <SplitButton label="Přidat nábor" menuLabel="Další možnosti přidání">
                <Option>Přidat brigádu</Option>
              </SplitButton>
            }
          />
        }
      >
        <div className="tm-mx-auto tm-flex tm-w-full tm-max-w-[1200px] tm-flex-col tm-gap-4">
          <JobsFilter
            value={filter}
            onChange={setFilter}
            recruiters={filterOptions.recruiters}
            managers={filterOptions.managers}
            departments={filterOptions.departments}
          />
          {TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="tm-mt-0">
              <JobCardList tab={tab.value} filter={filter} />
            </TabsContent>
          ))}
        </div>
      </PageTemplate>
    </Tabs>
  )
}
