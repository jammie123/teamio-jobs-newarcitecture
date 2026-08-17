import type { PortalId } from './types'

export const PORTAL_LABELS: Record<PortalId, string> = {
  jobs_cz: 'jobs.cz',
  prace_cz: 'prace.cz',
  prace_za_rohem: 'Práce za rohem',
  atmoskop: 'Atmoskop',
  career_pages: 'Kariérní stránky',
}

export function portalLabel(portal: PortalId): string {
  return PORTAL_LABELS[portal]
}
