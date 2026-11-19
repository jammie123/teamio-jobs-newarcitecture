/** Default run length for live open placements (days from today). */
export const DEFAULT_PUBLISHED_RUN_DAYS = 90

/** How far back publishedFrom sits for live open placements. */
export const DEFAULT_PUBLISHED_START_OFFSET_DAYS = -45

/** Days until end for „brzy končí“ nábory. */
export const ENDING_SOON_DAYS_FROM_TODAY = 5

export {
  RECENTLY_EXPIRED_END_OFFSET_DAYS as EXPIRED_RECENT_END_OFFSET_DAYS,
  RECENTLY_EXPIRED_START_OFFSET_DAYS as EXPIRED_RECENT_START_OFFSET_DAYS,
} from '../adStatus'

/** Older ended open nábory (unpublished „Starší než 30 dnů“). */
export const EXPIRED_OLD_END_OFFSET_DAYS = -45
export const EXPIRED_OLD_START_OFFSET_DAYS = -150

/** Archive nábory — placements ended this many days ago. */
export const ARCHIVE_END_OFFSET_DAYS = -30
export const ARCHIVE_START_OFFSET_DAYS = -120
