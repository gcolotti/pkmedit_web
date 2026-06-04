import type {
  EncounterDatabasePreview,
  MysteryGiftDatabasePreview,
  PokemonReplacement,
} from '../types/database'
import type { DonutDraft } from '../types/donut'
import type {
  ArceusResearchActionKey,
  ArceusResearchBulkAction,
  ArceusResearchStatusResponse,
  DraftLegalityViolation,
  ItemBag,
  PokedexActionKey,
  PokemonDetail,
} from '../types/index'
import type { MetDateFixerRequest } from '../types/metDateFixer'
import type { PokedexStatusResponse } from '../types/save'
import type {
  RaidListResponse,
  UndergroundItemsResponse,
} from '../types/saveFeature'
import type { TrainerInfo } from '../types/trainer'

export type Updater<T> = T | ((current: T) => T)
export type NullableUpdater<T> = T | null | ((current: T | null) => T | null)

export type DraftState = {
  pokemonDrafts: Record<string, PokemonDetail>
  baseDetails: Record<string, PokemonDetail>
  draftViolations: DraftLegalityViolation[]
  trainerDraft: TrainerInfo | null
  itemsDraft: ItemBag | null
  undergroundDraft: UndergroundItemsResponse | null
  donutDrafts: DonutDraft[]
  raidsDraft: RaidListResponse | null
  mysteryGiftDrafts: MysteryGiftDatabasePreview[]
  replacementDrafts: Record<string, PokemonReplacement>
  pokedexDrafts: PokedexActionKey[]
  pokedexStatus: PokedexStatusResponse | null
  arceusResearchStatus: ArceusResearchStatusResponse | null
  arceusResearchDrafts: ArceusResearchActionKey[]
  arceusResearchBulkDrafts: ArceusResearchBulkAction[]
  metDateFixerDraft: MetDateFixerRequest | null
  databasePreview: EncounterDatabasePreview | MysteryGiftDatabasePreview | null
  setPokemonDrafts: (updater: Updater<Record<string, PokemonDetail>>) => void
  setBaseDetails: (updater: Updater<Record<string, PokemonDetail>>) => void
  setDraft: (id: string, updater: NullableUpdater<PokemonDetail>) => void
  setBaseDetail: (id: string, detail: PokemonDetail) => void
  setDraftViolations: (updater: Updater<DraftLegalityViolation[]>) => void
  setTrainerDraft: (trainer: TrainerInfo | null) => void
  setItemsDraft: (items: ItemBag | null) => void
  setUndergroundDraft: (data: UndergroundItemsResponse | null) => void
  setRaidsDraft: (data: RaidListResponse | null) => void
  setDatabasePreview: (
    preview: EncounterDatabasePreview | MysteryGiftDatabasePreview | null,
  ) => void
  setMysteryGiftDrafts: (updater: Updater<MysteryGiftDatabasePreview[]>) => void
  addMysteryGiftDraft: (draft: MysteryGiftDatabasePreview) => void
  revertMysteryGiftDraft: (id: string) => void
  setReplacementDrafts: (
    updater: Updater<Record<string, PokemonReplacement>>,
  ) => void
  setReplacementDraft: (id: string, draft: PokemonReplacement) => void
  clearReplacementDraft: (id: string) => void
  setPokedexDrafts: (updater: Updater<PokedexActionKey[]>) => void
  setPokedexStatus: (status: PokedexStatusResponse | null) => void
  applyPokedexAction: (key: PokedexActionKey) => void
  revertPokedexAction: (key: PokedexActionKey) => void
  setArceusResearchStatus: (status: ArceusResearchStatusResponse | null) => void
  applyArceusResearchAction: (key: ArceusResearchActionKey) => void
  revertArceusResearchAction: (key: ArceusResearchActionKey) => void
  toggleArceusResearchBulk: (action: ArceusResearchBulkAction) => void
  revertArceusResearchBulk: (action: ArceusResearchBulkAction) => void
  setDonutDrafts: (updater: Updater<DonutDraft[]>) => void
  addDonutDraft: (draft: DonutDraft) => void
  revertDonutDraft: (id: string) => void
  setMetDateFixerDraft: (draft: MetDateFixerRequest | null) => void
  resetDrafts: () => void
  revertAll: () => void
}

export const emptyDraftSlices = {
  pokemonDrafts: {},
  baseDetails: {},
  draftViolations: [],
  trainerDraft: null,
  itemsDraft: null,
  undergroundDraft: null,
  donutDrafts: [],
  raidsDraft: null,
  mysteryGiftDrafts: [],
  replacementDrafts: {},
  pokedexDrafts: [],
  pokedexStatus: null,
  arceusResearchStatus: null,
  arceusResearchDrafts: [],
  arceusResearchBulkDrafts: [],
  metDateFixerDraft: null,
  databasePreview: null,
} satisfies Pick<
  DraftState,
  | 'pokemonDrafts'
  | 'baseDetails'
  | 'draftViolations'
  | 'trainerDraft'
  | 'itemsDraft'
  | 'undergroundDraft'
  | 'donutDrafts'
  | 'raidsDraft'
  | 'mysteryGiftDrafts'
  | 'replacementDrafts'
  | 'pokedexDrafts'
  | 'pokedexStatus'
  | 'arceusResearchStatus'
  | 'arceusResearchDrafts'
  | 'arceusResearchBulkDrafts'
  | 'metDateFixerDraft'
  | 'databasePreview'
>
