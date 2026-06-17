import type { Dispatch, SetStateAction } from 'react'

import type { Translator } from '../../i18n/i18n/i18n'
import type { SlotLegalityState } from '../../state/draftStoreTypes/draftStoreTypes'
import type {
  CatalogBundle,
  EditorTab,
  Language,
  LegalityReport,
  PokemonDetail,
} from '../index/index'
import type { TrainerInfo } from '../trainer/trainer'

export type PokemonEditorPanelProps = {
  activeTab: EditorTab
  catalogs: CatalogBundle
  draft: PokemonDetail | null
  language: Language
  onCheck: () => Promise<LegalityReport | null>
  onLegalityGenerated: (detail: PokemonDetail) => void
  onActiveTabChange: (tab: EditorTab) => void
  onCopyPokemon: () => void
  onFormChange: (form: number) => void
  onOpenDetailsAdvanced: () => void
  onOpenLegalityAdvanced: () => void
  onOpenMovesBrowser?: () => void
  onOpenTypeChart?: (typeId: number) => void
  onPastePokemon: () => void
  onSpeciesChange: (species: number, speciesName: string) => void
  pokemonClipboard: PokemonDetail | null
  saveGameVersion: number
  saveTrainer: TrainerInfo | null
  selectedSlotId: string | null
  selectedLegality: SlotLegalityState | null
  sessionId: string | null
  setDraft: Dispatch<SetStateAction<PokemonDetail | null>>
  t: Translator
}
