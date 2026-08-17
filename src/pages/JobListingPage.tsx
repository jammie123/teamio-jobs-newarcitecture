import {
  PageTemplate,
  Typography,
  type LeftMenuItemData,
} from '@teamio/starter/components'

const leftMenuItems: LeftMenuItemData[] = [
  { id: 'prehled', label: 'Přehled', icon: 'home', href: '#prehled' },
  { id: 'nabory', label: 'Nábory', icon: 'file-text', href: '#nabory' },
  { id: 'uchazeci', label: 'Uchazeči', icon: 'user', href: '#uchazeci' },
  { id: 'reporty', label: 'Reporty', icon: 'bar-chart', href: '#reporty' },
]

export function JobListingPage() {
  return (
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
    >
      <Typography as="h1" variant="h3">
        Job listing
      </Typography>
      <Typography variant="body" className="tm-mt-2 tm-text-secondary-default">
        Scaffold placeholder — výpis náboru přijde v další iteraci. Komponenty a
        tokeny jdou z teamio-prototype-starter.
      </Typography>
    </PageTemplate>
  )
}
