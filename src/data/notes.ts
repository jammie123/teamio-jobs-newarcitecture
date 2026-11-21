import type { NoteType } from './types'

export const NOTE_LABELS: Record<NoteType, string> = {
  start: 'Nástup',
  replacement: 'Náhrada',
  salary: 'Plat',
}

export function noteLabel(type: NoteType): string {
  return NOTE_LABELS[type]
}
