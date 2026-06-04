import type { Dispatch, SetStateAction } from 'react'

import type { Translator } from '../../../core/i18n/i18n/i18n'
import type {
  CatalogBundle,
  EditorTab,
  Language,
  LegalityReport,
  PokemonDetail,
} from '../../../core/types/index/index'

export type PokemonEditorProps = {
  activeTab: EditorTab
  catalogs: CatalogBundle
  draft: PokemonDetail | null
  language: Language
  legalityReport: LegalityReport | null
  onFormChange: (form: number) => void
  onOpenMovesBrowser?: () => void
  onOpenTypeChart?: (typeId: number) => void
  onSpeciesChange: (species: number, speciesName: string) => void
  saveGameVersion: number
  selectedSlotId: string | null
  sessionId: string | null
  setDraft: Dispatch<SetStateAction<PokemonDetail | null>>
  t: Translator
}
