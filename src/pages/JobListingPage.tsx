import { useState } from 'react'
import {
  JobCardSimplify3,
  JobModalChooseAds,
  JobModalProlong,
  JobModalTop,
  JobModalUnpublish,
  JobsFilterV2,
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
  partitionUnpublishedByEndedAge,
  shouldGroupUnpublishedByEndedAge,
  sortJobs,
  toJobCard,
  toModalAdvertisementSections,
  toModalAdvertisements,
  toModalPlacesForAction,
  type Job,
  type JobAdAction,
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
  description: option.description,
}))

const noop = () => undefined

const jobCardNoops = {
  onEditJob: noop,
  onDuplicateJob: noop,
  onInviteColleagues: noop,
  onTransferJob: noop,
  onArchiveJob: noop,
  onAddNote: noop,
  onEditAdvertisement: noop,
  onCreateAdvertisement: noop,
  onCandidatesClick: noop,
  onExpandNote: noop,
  onViewStatisticsClick: noop,
  onPreviewAdvertisement: noop,
  onPreviewPublication: noop,
  onExtendPublication: noop,
  onCompleteAdvertisement: noop,
}

type JobModalStep = 'chooseAd' | 'places'

type JobModalState = {
  job: Job
  action: JobAdAction
  step: JobModalStep
  advertisementIds?: string[]
}

function jobsOnTab(tab: JobListingTab, filter: JobsFilterValue) {
  return jobsForTab(jobs, tab).filter((job) => jobMatchesFilter(job, filter))
}

function openAdAction(job: Job, action: JobAdAction): JobModalState | null {
  if (job.ads.length === 0) {
    return null
  }

  if (job.ads.length === 1) {
    return { job, action, step: 'places', advertisementIds: [job.ads[0].id] }
  }

  return { job, action, step: 'chooseAd' }
}

function JobCardList({
  tab,
  filter,
  sort,
  onAdAction,
}: {
  tab: JobListingTab
  filter: JobsFilterValue
  sort: JobSortKey
  onAdAction: (job: Job, action: JobAdAction) => void
}) {
  const items = sortJobs(jobsOnTab(tab, filter), sort)

  if (items.length === 0) {
    return (
      <Typography variant="body" className="tm-text-secondary-default">
        Žádné nábory v tomto filtru.
      </Typography>
    )
  }

  function renderCard(job: Job) {
    return (
      <JobCardSimplify3
        key={job.id}
        {...toJobCard(job)}
        {...jobCardNoops}
        {...(job.ads.length > 0
          ? {
              onExtendAndRepublish: () => onAdAction(job, 'prolong'),
              onEndPublication: () => onAdAction(job, 'unpublish'),
              onTopAdvertisement: () => onAdAction(job, 'top'),
            }
          : {})}
      />
    )
  }

  if (shouldGroupUnpublishedByEndedAge(tab, sort)) {
    const { recent, older } = partitionUnpublishedByEndedAge(items)

    return (
      <div className="tm-flex tm-flex-col tm-gap-6">
        {recent.length > 0 ? (
          <section className="tm-flex tm-flex-col tm-gap-4">
            <Typography as="h2" variant="h4">
              Nedávno ukončené
            </Typography>
            {recent.map(renderCard)}
          </section>
        ) : null}
        {older.length > 0 ? (
          <section className="tm-flex tm-flex-col tm-gap-4">
            <Typography as="h2" variant="h4">
              Starší než 30 dnů
            </Typography>
            {older.map(renderCard)}
          </section>
        ) : null}
      </div>
    )
  }

  return <div className="tm-flex tm-flex-col tm-gap-4">{items.map(renderCard)}</div>
}

function JobListingAdModals({
  modal,
  onClose,
  onDismissChooseAd,
  onSelectAd,
}: {
  modal: JobModalState | null
  onClose: () => void
  onDismissChooseAd: () => void
  onSelectAd: (advertisementIds: string[]) => void
}) {
  const selectedAds =
    modal?.advertisementIds?.flatMap((advertisementId) => {
      const ad = modal.job.ads.find((item) => item.id === advertisementId)
      return ad ? [ad] : []
    }) ?? []
  const advertisementSections =
    modal && selectedAds.length > 1
      ? toModalAdvertisementSections(modal.job, selectedAds, modal.action)
      : undefined
  const places = modal
    ? selectedAds.flatMap((ad) => toModalPlacesForAction(ad, modal.action))
    : []
  const placesKey = `${modal?.action ?? ''}-${modal?.advertisementIds?.join(',') ?? ''}`

  return (
    <>
      <JobModalChooseAds
        open={modal?.step === 'chooseAd'}
        advertisements={modal ? toModalAdvertisements(modal.job) : []}
        onOpenChange={(open) => {
          if (!open) {
            onDismissChooseAd()
          }
        }}
        onConfirm={onSelectAd}
      />
      <JobModalUnpublish
        key={`unpublish-${placesKey}`}
        open={modal?.step === 'places' && modal.action === 'unpublish'}
        places={places}
        advertisementSections={advertisementSections}
        onOpenChange={(open) => {
          if (!open) {
            onClose()
          }
        }}
        onConfirm={onClose}
      />
      <JobModalProlong
        key={`prolong-${placesKey}`}
        open={modal?.step === 'places' && modal.action === 'prolong'}
        places={places}
        advertisementSections={advertisementSections}
        onOpenChange={(open) => {
          if (!open) {
            onClose()
          }
        }}
        onConfirm={onClose}
      />
      <JobModalTop
        key={`top-${placesKey}`}
        open={modal?.step === 'places' && modal.action === 'top'}
        places={places}
        advertisementSections={advertisementSections}
        onOpenChange={(open) => {
          if (!open) {
            onClose()
          }
        }}
        onConfirm={onClose}
      />
    </>
  )
}

export function JobListingPage() {
  const [filter, setFilter] = useState<JobsFilterValue>(EMPTY_JOBS_FILTER)
  const [sort, setSort] = useState<JobSortKey>(DEFAULT_JOB_SORT)
  const [tab, setTab] = useState<JobListingTab>('published')
  const [modal, setModal] = useState<JobModalState | null>(null)
  const visibleCount = jobsOnTab(tab, filter).length

  function handleAdAction(job: Job, action: JobAdAction) {
    setModal(openAdAction(job, action))
  }

  function closeModal() {
    setModal(null)
  }

  function selectAdvertisement(advertisementIds: string[]) {
    setModal((current) =>
      current ? { ...current, step: 'places', advertisementIds } : null,
    )
  }

  function dismissChooseAd() {
    setModal((current) => (current?.step === 'chooseAd' ? null : current))
  }

  return (
    <>
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
            <JobsFilterV2
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
                <JobCardList
                  tab={item.value}
                  filter={filter}
                  sort={sort}
                  onAdAction={handleAdAction}
                />
              </TabsContent>
            ))}
          </div>
        </PageTemplate>
      </Tabs>
      <JobListingAdModals
        modal={modal}
        onClose={closeModal}
        onDismissChooseAd={dismissChooseAd}
        onSelectAd={selectAdvertisement}
      />
    </>
  )
}
