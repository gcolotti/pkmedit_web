import type { PokemonDetail } from '../index/index'

export type DatabaseMoveFilters = {
  move1: number
  move2: number
  move3: number
  move4: number
}

export type PokemonReplacement = {
  dataBase64: string
}

export type PokemonDraftChange = {
  slotId: string
  pokemon?: unknown
  replacement?: PokemonReplacement
}

export type EncounterDatabaseCriteria = {
  nature: number
  gender: number
  ability: number
  levelMin: number
  levelMax: number
  ivHp: number
  ivAtk: number
  ivDef: number
  ivSpa: number
  ivSpd: number
  ivSpe: number
}

export type EncounterDatabaseSearchRequest = {
  species: number
  form: number
  version: number
  shiny: boolean | null
  egg: boolean | null
  moves: DatabaseMoveFilters
  types: string[]
  criteria: EncounterDatabaseCriteria
  batchInstructions: string
  limit: number
  page: number
}

export type EncounterDatabaseEntry = {
  id: string
  species: number
  speciesName: string
  form: number
  levelMin: number
  levelMax: number
  version: number
  versionName: string
  generation: number
  context: string
  type: string
  egg: boolean
  shiny: boolean
  location: number
  locationName: string
  ball: number
  heldItem: number
  moves: number[]
}

export type EncounterDatabaseSearchResponse = {
  total: number
  page: number
  pageSize: number
  pageCount: number
  results: EncounterDatabaseEntry[]
}

export type EncounterDatabasePreview = {
  entry: EncounterDatabaseEntry
  pokemon: PokemonDetail
  replacement: PokemonReplacement
  search: EncounterDatabaseSearchRequest
}

export type MysteryGiftDatabaseSearchRequest = {
  species: number
  heldItem: number
  format: number
  formatComparator: string
  shiny: boolean | null
  egg: boolean | null
  includeLegal: boolean
  includeUncertain: boolean
  includeIllegal: boolean
  moves: DatabaseMoveFilters
  batchInstructions: string
  limit: number
  page: number
}

export type MysteryGiftStorageStatus = {
  supported: boolean
  full: boolean
  capacity: number
  used: number
}

export type MysteryGiftLegalityCounts = {
  legal: number
  uncertain: number
  illegal: number
}

export type MysteryGiftDatabaseEntry = {
  id: string
  cardId: number
  title: string
  fileName: string
  extension: string
  species: number
  speciesName: string
  form: number
  level: number
  generation: number
  version: number
  versionName: string
  egg: boolean
  shiny: boolean
  item: boolean
  itemId: number
  quantity: number
  heldItem: number
  moves: number[]
  compatible: boolean
  saveLegality: 'legal' | 'uncertain' | 'illegal'
  saveLegalityReason: string
}

export type MysteryGiftDatabaseSearchResponse = {
  total: number
  page: number
  pageSize: number
  pageCount: number
  storage: MysteryGiftStorageStatus
  legalityCounts: MysteryGiftLegalityCounts
  results: MysteryGiftDatabaseEntry[]
}

export type MysteryGiftDraftChange = {
  giftDataBase64: string
  extension: string
}

export type MysteryGiftDatabasePreview = {
  entry: MysteryGiftDatabaseEntry
  pokemon: PokemonDetail | null
  draft: MysteryGiftDraftChange
  replacement: PokemonReplacement | null
  storage: MysteryGiftStorageStatus
}
