import { jobPortalLogoTypeFromChannel, type JobPreviewPublication } from '@teamio/starter/components'
import { portalLabel } from './portals'
import type { Job, PortalId } from './types'

const PREVIEW_URL_BY_PORTAL: Record<PortalId, (slug: string) => string> = {
  jobs_cz: (slug) => `https://www.jobs.cz/rpd/${slug}/?rps=202`,
  prace_cz: (slug) => `https://www.prace.cz/nabidka/${slug}/?rps=202`,
  prace_za_rohem: (slug) => `https://www.pracezarohem.cz/nabidka/${slug}/`,
  atmoskop: (slug) => `https://www.atmoskop.cz/nabidka/${slug}/`,
  career_pages: (slug) => `https://my.teamio.com/recruit/public/pd/${slug}/?rps=202`,
  referral: (slug) => `https://my.teamio.com/recruit/public/pd/${slug}/?rps=referral`,
  export: (slug) => `https://my.teamio.com/recruit/public/pd/${slug}/?rps=export`,
}

function previewSlug(jobId: string): string {
  return jobId.replace(/\D/g, '') || jobId
}

function toPreviewPublication(
  id: string,
  portal: PortalId,
  slug: string,
): JobPreviewPublication {
  const name = portalLabel(portal)
  return {
    id,
    name,
    logoType: jobPortalLogoTypeFromChannel(name),
    url: PREVIEW_URL_BY_PORTAL[portal](slug),
  }
}

/** Public advertisement URLs of a nábor, one per live placement, for JobPreviewModal. */
export function toJobPreviewPublications(job: Job): JobPreviewPublication[] {
  const slug = previewSlug(job.id)
  const seen = new Set<string>()
  const publications: JobPreviewPublication[] = []

  for (const ad of job.ads) {
    for (const placement of ad.placements) {
      if (placement.channelDisabled) {
        continue
      }

      const id = `${ad.id}-${placement.portal}`
      if (seen.has(id)) {
        continue
      }

      seen.add(id)
      publications.push(toPreviewPublication(id, placement.portal, slug))
    }
  }

  if (publications.length === 0) {
    return [toPreviewPublication(`${job.id}-career_pages`, 'career_pages', slug)]
  }

  return publications
}
