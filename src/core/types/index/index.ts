export type Language = 'en' | 'es' | 'ja'
export type Theme = 'light' | 'dark'
export type View = 'party' | 'boxes' | 'save' | 'database'
export type SaveView =
  | 'items'
  | 'trainer'
  | 'pokedex'
  | 'metDateFixer'
  | 'underground'
  | 'raids'
export type SaveSectionStatus = 'idle' | 'loading' | 'ready' | 'unavailable'
export type DatabaseView = 'encounters' | 'mysteryGifts'
export type EditorTab =
  | 'main'
  | 'met'
  | 'stats'
  | 'moves'
  | 'details'
  | 'legality'

// Legality: "Generate legal" preview (see PreviewLegalGenerate endpoint).
// targetShiny / targetAlpha are toggle objectives (default = current value).
export type LegalGenerateRequest = {
  targetShiny: boolean
  targetAlpha: boolean
}

export type LegalGenerateResponse = {
  draft: PokemonDetail
  legality: LegalityReport
  alphaPreserved: boolean
  warning: string | null
}

export type LegalFixSafety = 'safe' | 'risky' | 'manual'

export type LegalFix = {
  id: string
  safety: LegalFixSafety
  fields: string[]
}

export type LegalityFixesResponse = {
  fixes: LegalFix[]
}

export type LegalityFixRequest = {
  pokemon: unknown
  fixIds: string[]
}

export type LegalityFixResponse = {
  draft: PokemonDetail
  legality: LegalityReport
  fixes: LegalFix[]
  appliedFixIds: string[]
}

import type { CatalogBundle, CatalogEntry } from '../catalogs/catalogs'
export type { CatalogBundle, CatalogEntry }

import type {
  PokemonContextCatalogs,
  PokemonDetail,
  PokemonEffortKind,
} from '../pokemonDetail/pokemonDetail'
export type { PokemonContextCatalogs, PokemonDetail, PokemonEffortKind }

import type { InventoryItemEntry, ItemBag, ItemPocket } from '../items/items'
export type { InventoryItemEntry, ItemBag, ItemPocket }

import type {
  DraftChange,
  DraftLegalityResponse,
  DraftLegalityViolation,
  LegalityReport,
} from '../legality/legality'
export type {
  DraftChange,
  DraftLegalityResponse,
  DraftLegalityViolation,
  LegalityReport,
}

import type { AbilityDetail } from '../abilityDetail/abilityDetail'
import type { MoveDetail } from '../moveDetail/moveDetail'
export type { AbilityDetail, MoveDetail }

import type {
  ArceusResearchActionKey,
  ArceusResearchActionName,
  ArceusResearchBulkAction,
  ArceusResearchDexSummary,
  ArceusResearchSpeciesDetail,
  ArceusResearchSpeciesEntry,
  ArceusResearchStatusResponse,
  ArceusResearchTaskEntry,
  BoxSummary,
  PokedexActionKey,
  PokedexActionName,
  PokedexActionStatus,
  PokedexDexStatus,
  PokedexStatusResponse,
  SaveFileEntry,
  SaveSummary,
} from '../save/save'
export type {
  ArceusResearchActionKey,
  ArceusResearchActionName,
  ArceusResearchBulkAction,
  ArceusResearchDexSummary,
  ArceusResearchSpeciesDetail,
  ArceusResearchSpeciesEntry,
  ArceusResearchStatusResponse,
  ArceusResearchTaskEntry,
  BoxSummary,
  PokedexActionKey,
  PokedexActionName,
  PokedexActionStatus,
  PokedexDexStatus,
  PokedexStatusResponse,
  SaveFileEntry,
  SaveSummary,
}
