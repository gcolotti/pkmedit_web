import type { Dispatch, SetStateAction } from 'react'

import type { Translator } from '../i18n/i18n'
import type {
  DraftLegalityViolation,
  PokemonDetail,
  SaveSummary,
} from '../types/index'
import type { ApiClient } from './api'

export type DatabaseContext = {
  api: ApiClient
  baseDetails: Map<number, PokemonDetail> | null
  setBaseDetails: Dispatch<SetStateAction<Map<number, PokemonDetail> | null>>
  setDrafts: Dispatch<SetStateAction<Map<number, PokemonDetail>>>
  setDraftViolations: Dispatch<SetStateAction<DraftLegalityViolation[] | null>>
  setSelectedSlotId: Dispatch<SetStateAction<string | null>>
  setToast: (message: string) => void
  summary: SaveSummary | null
  t: Translator
}
