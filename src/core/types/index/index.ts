import type {
  PokemonCosmetic,
  PokemonHyperTrain,
  PokemonMain,
  PokemonMoves,
  PokemonOrigin,
  PokemonPlusMoves,
  PokemonStats,
  PokemonSummary,
  PokemonTrainer,
} from '../pokemon/pokemon'

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
  | 'cosmetic'
  | 'otMisc'

export type PokemonContextCatalogs = {
  forms: CatalogEntry[]
  abilities: CatalogEntry[]
  heldItems: CatalogEntry[]
  metLocations: CatalogEntry[]
  eggLocations: CatalogEntry[]
  languages: CatalogEntry[]
  battleVersions: CatalogEntry[]
  balls: CatalogEntry[]
  legalMoves: number[]
  moveBasePp?: Array<{ id: number; basePp: number }>
}

export type PokemonEffortKind = 'ev' | 'av' | 'gv' | 'statExp'

export type PokemonDetail = {
  summary: PokemonSummary
  main: PokemonMain
  ivs: PokemonStats
  evs: PokemonStats
  baseStats: PokemonStats
  calculatedStats: PokemonStats
  moves: PokemonMoves
  origin: PokemonOrigin
  trainer: PokemonTrainer
  cosmetic: PokemonCosmetic
  contextCatalogs: PokemonContextCatalogs
  legality: LegalityReport
  effortKind: PokemonEffortKind
  maxEv: number
  maxTotalEv: number
  hyperTrainedIvs: PokemonHyperTrain
  hyperTrainingAvailable: boolean
  growthRate: number
  type1: number
  type2: number
  teraType: number
  teraTypeOriginal: number
  teraTypeOverride: number
  plusMoves: PokemonPlusMoves | null
}

import type { CatalogBundle, CatalogEntry } from '../catalogs/catalogs'
export type { CatalogBundle, CatalogEntry }

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
