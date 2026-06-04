import type { Translator } from '../../../core/i18n/i18n'
import type {
  MetDateFixerPreview,
  MetDateFixerRequest,
} from '../../../core/types/metDateFixer'

export interface MetDateFixerPanelProps {
  queuedDraft: MetDateFixerRequest | null
  sessionId: string | null
  t: Translator
  onPreview: (
    request: MetDateFixerRequest,
  ) => Promise<MetDateFixerPreview | null>
  onQueue: (request: MetDateFixerRequest) => void
}

export const MET_DATE_PRESETS = [
  { value: 'auto', label: 'Auto' },
  { value: 'none', label: 'None' },
  { value: 'hgss', label: 'HGSS' },
  { value: 'bw', label: 'Black/White' },
  { value: 'b2w2', label: 'Black 2/White 2' },
  { value: 'xy', label: 'X/Y' },
  { value: 'oras', label: 'ORAS' },
  { value: 'sm', label: 'Sun/Moon' },
  { value: 'usum', label: 'USUM' },
]

export type MetDateFormState = {
  preset: string
  startDate: string
  storyEndDate: string
  postGameEndDate: string
  rewriteAll: boolean
  includeParty: boolean
  updateTrainerDates: boolean
}

export const MET_DATE_INITIAL_FORM: MetDateFormState = {
  preset: 'auto',
  startDate: '',
  storyEndDate: '',
  postGameEndDate: '',
  rewriteAll: false,
  includeParty: true,
  updateTrainerDates: false,
}

export function buildMetDateRequest(
  form: MetDateFormState,
): MetDateFixerRequest {
  return {
    preset: form.preset,
    startDate: form.startDate || null,
    storyEndDate: form.storyEndDate || null,
    postGameEndDate: form.postGameEndDate || null,
    rewriteAll: form.rewriteAll,
    includeParty: form.includeParty,
    updateTrainerDates: form.updateTrainerDates,
  }
}
