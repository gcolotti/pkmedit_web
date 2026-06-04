import type { PokemonSummary } from './pokemon'

export type SaveFileEntry = {
  name: string
  relativePath: string
  size: number
  lastWriteTime: string
}

export type SaveSummary = {
  sessionId: string
  fileName: string
  game: string
  gameVersion: number
  context: string
  generation: number
  trainer: string
  trainerId: number
  secretId: number
  money: number
  language: number
  partyCount: number
  boxCount: number
  boxSlotCount: number
  checksumsValid: boolean
  exportable: boolean
  edited: boolean
  saveExtension: string
  usesZipContainer: boolean
}

export type BoxSummary = {
  boxIndex: number
  name: string
  slots: PokemonSummary[]
}

export type PokedexActionName =
  | 'seen'
  | 'caught'
  | 'shinySeen'
  | 'shinyCaught'
  | 'formsSeen'
  | 'formsCaught'
  | 'complete'

export type PokedexActionKey = {
  dexId: string
  action: PokedexActionName
}

export type PokedexActionStatus = {
  action: PokedexActionName
  count: number
  total: number
  complete: boolean
}

export type PokedexDexStatus = {
  id: string
  label: string
  scope: string
  totalSpecies: number
  supportedActions: PokedexActionName[]
  actions: PokedexActionStatus[]
}

export type PokedexStatusResponse = {
  game: string
  gameVersion: number
  context: string
  generation: number
  dexes: PokedexDexStatus[]
}

export type ArceusResearchActionName =
  | 'completeTask'
  | 'completeSpecies'
  | 'perfectSpecies'

export type ArceusResearchActionKey = {
  species: number
  action: ArceusResearchActionName
  taskIndex?: number | null
}

export type ArceusResearchBulkAction = 'markAllPerfect' | 'markAllComplete'

export type ArceusResearchDexSummary = {
  id: string
  label: string
  totalSpecies: number
  completed: number
  perfect: number
  dexCompleted: boolean
  dexPerfect: boolean
}

export type ArceusResearchSpeciesEntry = {
  species: number
  speciesName: string
  displayForm: number
  researchRate: number
  complete: boolean
  perfect: boolean
  completedTasks: number
  totalTasks: number
  requiredTasks: number
  completedRequiredTasks: number
  obtainedCount: number
  dexIds: string[]
}

export type ArceusResearchTaskEntry = {
  index: number
  type: string
  label: string
  currentValue: number
  reportedLevel: number
  maxLevel: number
  thresholds: number[]
  required: boolean
  pointsSingle: number
  pointsBonus: number
  editable: boolean
}

export type ArceusResearchStatusResponse = {
  totalResearchPoints: number
  maxResearchPoints: number
  currentRank: number
  maxRank: number
  pointsForCurrentRank: number
  pointsForNextRank: number
  dexes: ArceusResearchDexSummary[]
  species: ArceusResearchSpeciesEntry[]
}

export type ArceusResearchSpeciesDetail = {
  summary: ArceusResearchSpeciesEntry
  tasks: ArceusResearchTaskEntry[]
}
