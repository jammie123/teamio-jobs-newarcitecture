import type { HighlightType, PortalId } from './types'

export const PORTAL_LABELS: Record<PortalId, string> = {
  jobs_cz: 'jobs.cz',
  prace_cz: 'prace.cz',
  prace_za_rohem: 'Práce za rohem',
  atmoskop: 'Atmoskop',
  career_pages: 'Kariérní stránky',
}

export const HIGHLIGHT_LABELS: Record<HighlightType, string> = {
  jobstip: 'Jobstip',
  supermax: 'Supermax',
  pzr_highlight: 'Zvýraznění inzerátu na Práce za rohem',
  top: 'Topováno',
}

export const HIGHLIGHTS_BY_PORTAL: Record<PortalId, readonly HighlightType[]> = {
  jobs_cz: ['jobstip', 'top'],
  prace_cz: ['supermax', 'top'],
  prace_za_rohem: ['pzr_highlight'],
  atmoskop: [],
  career_pages: [],
}

export function portalLabel(portal: PortalId): string {
  return PORTAL_LABELS[portal]
}

export function highlightLabel(type: HighlightType): string {
  return HIGHLIGHT_LABELS[type]
}

export function highlightDisplayName(type: HighlightType, portal: PortalId): string {
  if (type === 'top') {
    return `Topováno na ${portalLabel(portal)}`
  }

  return highlightLabel(type)
}
