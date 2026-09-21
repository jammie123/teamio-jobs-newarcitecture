import { useState } from 'react'
import {
  JobCardSyntezaAds,
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
  DEFAULT_JOB_SORT,
  EMPTY_JOBS_FILTER,
  JOB_SORT_OPTIONS,
  filterOptionsFromJobs,
  jobMatchesFilter,
  jobs,
  jobsForTab,
  sortJobs,
  toJobCard,
  type JobListingTab,
  type JobSortKey,
} from '../data'

const leftMenuItems: LeftMenuItemData[] = [
  { id: 'prehled', label: 'Přehled', icon: 'home', href: '#prehled' },
  { id: 'nabory', label: 'Nábory', icon: 'file-text', href: '#nabory' },
  { id: 'uchazeci', label: 'Uchazeči', icon: 'user', href: '#uchazeci' },
  { id: 'reporty', label: 'Reporty', icon: 'bar-chart', href: '#reporty' },
]

const TABS: Array<{ value: JobListingTab; label: string; info?: string }> = [
  {
    value: 'open',
    label: 'Otevřený',
    info: 'Otevřený nábor, který může i nemusí mít inzeráty',
  },
  {
    value: 'published',
    label: 'Zveřejněný',
    info: 'Otevřený nábor, na kterém běží vystavená inzerce',
  },
  {
    value: 'unpublished',
    label: 'Nezveřejněný',
    info: 'Otevřený nábor s ukončenou nebo vypršelou inzercí',
  },
  {
    value: 'endingSoon',
    label: 'Brzy končí',
    info: 'Otevřený nábor s inzercí, která končí do 7 dní',
  },
  { value: 'draft', label: 'Rozpracovaný' },
  { value: 'archived', label: 'Archivní' },
]

const filterOptions = filterOptionsFromJobs(jobs)
const sortOptions = JOB_SORT_OPTIONS.map((option) => ({
  value: option.key,
  label: option.label,
}))

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
  onActivityClick: noop,
  onExpandNote: noop,
  onViewStatisticsClick: noop,
  onPreviewAdvertisement: noop,
  onPreviewPublication: noop,
  onExtendPublication: noop,
  onCompleteAdvertisement: noop,
}

function jobsOnTab(tab: JobListingTab, filter: JobsFilterValue) {
  return jobsForTab(jobs, tab).filter((job) => jobMatchesFilter(job, filter))
}

function JobCardList({
  tab,
  filter,
  sort,
}: {
  tab: JobListingTab
  filter: JobsFilterValue
  sort: JobSortKey
}) {
  const items = sortJobs(jobsOnTab(tab, filter), sort)

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
        <JobCardSyntezaAds key={job.id} {...toJobCard(job)} {...jobCardNoops} />
      ))}
    </div>
  )
}

export function JobListingPage() {
  const [filter, setFilter] = useState<JobsFilterValue>(EMPTY_JOBS_FILTER)
  const [sort, setSort] = useState<JobSortKey>(DEFAULT_JOB_SORT)
  const [tab, setTab] = useState<JobListingTab>('published')
  const visibleCount = jobsOnTab(tab, filter).length

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value as JobListingTab)}
      className="tm-contents"
    >
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
            title={
              <>
                Nábory{' '}
                <span className="tm-font-normal tm-text-secondary-default">({visibleCount})</span>
              </>
            }
            aria-label="Nábory"
            tabs={
              <TabsList aria-label="Filtry náborů">
                {TABS.map((item) => (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    count={jobsOnTab(item.value, filter).length}
                    info={item.info}
                  >
                    {item.label}
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
        <div className="tm--mx-6 tm--mt-6 tm-border-0 tm-border-b tm-border-solid tm-border-secondary tm-bg-basic tm-px-6 tm-py-4">
          <JobsFilter
            value={filter}
            onChange={setFilter}
            recruiters={filterOptions.recruiters}
            managers={filterOptions.managers}
            departments={filterOptions.departments}
            sortValue={sort}
            sortOptions={sortOptions}
            onSortChange={(next) => setSort(next as JobSortKey)}
          />
        </div>
        <div className="tm-flex tm-w-full tm-flex-col tm-gap-4 tm-pt-6">
          {TABS.map((item) => (
            <TabsContent key={item.value} value={item.value} className="tm-mt-0">
              <JobCardList tab={item.value} filter={filter} sort={sort} />
            </TabsContent>
          ))}
        </div>
      </PageTemplate>
    </Tabs>
  )
}
