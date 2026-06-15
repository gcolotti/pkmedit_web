import type { CatalogEntry } from '../catalogs/catalogs'
import type { LegalityReport } from '../legality/legality'
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
