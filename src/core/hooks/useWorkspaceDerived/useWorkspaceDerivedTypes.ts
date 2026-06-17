import type { Translator } from '../../i18n/i18n/i18n'
import type { SlotLegalityState } from '../../state/draftStoreTypes/draftStoreTypes'
import type {
  MysteryGiftDatabasePreview,
  PokemonReplacement,
} from '../../types/database/database'
import type { DonutDraft } from '../../types/donut/donut'
import type {
  ArceusResearchActionKey,
  ArceusResearchBulkAction,
  ArceusResearchStatusResponse,
  BoxSummary,
  ItemBag,
  PokedexActionKey,
  PokedexStatusResponse,
  PokemonDetail,
} from '../../types/index/index'
import type { MetDateFixerRequest } from '../../types/metDateFixer/metDateFixer'
import type { PokemonSummary } from '../../types/pokemon/pokemon'
import type {
  RaidListResponse,
  UndergroundItemsResponse,
} from '../../types/saveFeature/saveFeature'
import type { TrainerInfo } from '../../types/trainer/trainer'

export type WorkspaceDerivedInput = {
  arceusResearchBulkDrafts: ArceusResearchBulkAction[]
  arceusResearchDrafts: ArceusResearchActionKey[]
  arceusResearchStatus: ArceusResearchStatusResponse | null
  baseDetails: Record<string, PokemonDetail>
  boxes: BoxSummary[] | undefined
  donuts: DonutDraft[]
  drafts: Record<string, PokemonDetail>
  itemsDraft: ItemBag | null
  metDateFixerDraft: MetDateFixerRequest | null
  mysteryGiftDrafts: MysteryGiftDatabasePreview[]
  party: PokemonSummary[] | undefined
  pokemonLegality: Record<string, SlotLegalityState>
  pokedexDrafts: PokedexActionKey[]
  pokedexStatus: PokedexStatusResponse | null
  raidsDraft: RaidListResponse | null
  replacementDrafts: Record<string, PokemonReplacement>
  selectedSlotId: string | null
  t: Translator
  trainerBase: TrainerInfo | null
  trainerDraft: TrainerInfo | null
  undergroundDraft: UndergroundItemsResponse | null
}
