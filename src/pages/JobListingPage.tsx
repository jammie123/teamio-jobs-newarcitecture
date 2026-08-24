import { useState } from 'react'
import {
  Dropdown,
  DropdownBody,
  DropdownToggle,
  JobCard,
  JobsFilter,
  Option,
  OptionList,
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
  formatJobCount,
  jobMatchesFilter,
  jobSortLabel,
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

const TABS: Array<{ value: JobListingTab; label: string }> = [
  { value: 'active', label: 'Aktivní' },
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

function jobsOnTab(tab: JobListingTab, filter: JobsFilterValue) {
  return jobsForTab(jobs, tab).filter((job) => jobMatchesFilter(job, filter))
}

function JobListToolbar({
  count,
  sort,
  onSortChange,
}: {
  count: number
  sort: JobSortKey
  onSortChange: (sort: JobSortKey) => void
}) {
  return (
    <div className="tm-flex tm-items-center tm-justify-between tm-gap-4">
      <Typography variant="body" className="tm-my-0 tm-text-secondary-default">
        {formatJobCount(count)}
      </Typography>
      <Dropdown placement="bottom-end">
        <DropdownToggle
          variant="custom"
          showIndicator
          aria-label={`Řazení: ${jobSortLabel(sort)}`}
          className="tm-text-action-link-default hover:tm-text-action-link-hover hover:tm-underline focus:tm-text-action-link-hover focus:tm-underline active:tm-text-action-link-active"
        >
          {jobSortLabel(sort)}
        </DropdownToggle>
        <DropdownBody>
          <OptionList aria-label="Řazení">
            {JOB_SORT_OPTIONS.map((option) => (
              <Option
                key={option.key}
                isSelected={option.key === sort}
                onClick={() => onSortChange(option.key)}
              >
                {option.label}
              </Option>
            ))}
          </OptionList>
        </DropdownBody>
      </Dropdown>
    </div>
  )
}

function JobCardList({
  tab,
  filter,
  sort,
  onSortChange,
}: {
  tab: JobListingTab
  filter: JobsFilterValue
  sort: JobSortKey
  onSortChange: (sort: JobSortKey) => void
}) {
  const items = sortJobs(jobsOnTab(tab, filter), sort)

  return (
    <div className="tm-flex tm-flex-col">
      <JobListToolbar count={items.length} sort={sort} onSortChange={onSortChange} />
      <div className="tm-mt-2 tm-flex tm-flex-col tm-gap-4">
        {items.length === 0 ? (
          <Typography variant="body" className="tm-text-secondary-default">
            Žádné nábory v tomto filtru.
          </Typography>
        ) : (
          items.map((job) => <JobCard key={job.id} {...toJobCard(job)} {...jobCardNoops} />)
        )}
      </div>
    </div>
  )
}

export function JobListingPage() {
  const [filter, setFilter] = useState<JobsFilterValue>(EMPTY_JOBS_FILTER)
  const [sort, setSort] = useState<JobSortKey>(DEFAULT_JOB_SORT)

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
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    count={jobsOnTab(tab.value, filter).length}
                  >
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
        <div className="tm--mx-6 tm--mt-6 tm-border-0 tm-border-b tm-border-solid tm-border-secondary tm-bg-basic tm-px-6 tm-py-4">
          <div className="tm-mx-auto tm-w-full tm-max-w-[1200px]">
            <JobsFilter
              value={filter}
              onChange={setFilter}
              recruiters={filterOptions.recruiters}
              managers={filterOptions.managers}
              departments={filterOptions.departments}
            />
          </div>
        </div>
        <div className="tm-mx-auto tm-flex tm-w-full tm-max-w-[1200px] tm-flex-col tm-gap-4 tm-pt-6">
          {TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="tm-mt-0">
              <JobCardList tab={tab.value} filter={filter} sort={sort} onSortChange={setSort} />
            </TabsContent>
          ))}
        </div>
      </PageTemplate>
    </Tabs>
  )
}
