export type MetDateFixerRequest = {
  preset: string
  startDate?: string | null
  storyEndDate?: string | null
  postGameEndDate?: string | null
  rewriteAll: boolean
  includeParty: boolean
  updateTrainerDates: boolean
}

export type MetDateFixerSuggestion = {
  slotId: string
  label: string
  species: number
  speciesName: string
  metLocation: number
  metLevel: number
  gameVersion: string
  currentDate: string | null
  proposedDate: string
  windowStart: string
  windowEnd: string
  phase: string
  reason: string
  confidence: number
  shouldApply: boolean
}

export type MetDateFixerTrainerTimeline = {
  field: string
  label: string
  current: string | null
  proposed: string | null
  supported: boolean
  shouldApply: boolean
  reason: string
}

export type MetDateFixerPreview = {
  preset: string
  displayName: string
  startDate: string
  storyEndDate: string
  postGameEndDate: string
  timelineBasis: string
  changedCount: number
  trainerChangedCount: number
  suggestions: MetDateFixerSuggestion[]
  trainerTimeline: MetDateFixerTrainerTimeline[]
}
