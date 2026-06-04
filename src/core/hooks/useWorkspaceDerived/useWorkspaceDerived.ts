import { useMemo } from 'react'

import type { Translator } from '../../i18n/i18n/i18n'
import {
  buildDraftChangeList,
  buildDraftRequests,
  mergeDraftSummary,
} from '../../services/draftChanges/draftChanges'
import { buildWorkspaceDraftChanges } from '../../services/drafts/drafts'
import { selectedDetail } from '../../services/draftSelection/draftSelection'
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
  DraftChange,
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

type WorkspaceDerivedInput = {
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
  pokedexDrafts: PokedexActionKey[]
  pokedexStatus: PokedexStatusResponse | null
  raidsDraft: RaidListResponse | null
  replacementDrafts: Record<string, PokemonReplacement>
  selectedSlotId: string | null
  t: Translator
  trainerDraft: TrainerInfo | null
  undergroundDraft: UndergroundItemsResponse | null
}

export function useWorkspaceDerived(input: WorkspaceDerivedInput) {
  const draft = selectedDetail(
    input.selectedSlotId,
    input.drafts,
    input.baseDetails,
  )
  const draftRequests = useMemo(
    () =>
      buildDraftRequests(
        input.baseDetails,
        input.drafts,
        input.replacementDrafts,
      ),
    [input.baseDetails, input.drafts, input.replacementDrafts],
  )
  const pokemonDraftChanges = useMemo(
    () => buildDraftChangeList(input.baseDetails, input.drafts, input.t),
    [input.baseDetails, input.drafts, input.t],
  )
  const draftChanges = useMemo<DraftChange[]>(
    () =>
      buildWorkspaceDraftChanges(
        pokemonDraftChanges,
        input.t,
        input.trainerDraft,
        input.itemsDraft,
        input.mysteryGiftDrafts,
        input.pokedexDrafts,
        input.pokedexStatus,
        input.donuts,
        input.metDateFixerDraft,
        input.undergroundDraft,
        input.raidsDraft,
        input.arceusResearchDrafts,
        input.arceusResearchBulkDrafts,
        input.arceusResearchStatus,
      ),
    [
      input.arceusResearchBulkDrafts,
      input.arceusResearchDrafts,
      input.arceusResearchStatus,
      input.donuts,
      input.itemsDraft,
      input.metDateFixerDraft,
      input.mysteryGiftDrafts,
      input.pokedexDrafts,
      input.pokedexStatus,
      input.raidsDraft,
      input.t,
      input.trainerDraft,
      input.undergroundDraft,
      pokemonDraftChanges,
    ],
  )
  const patchedParty = useMemo(
    () =>
      (input.party ?? []).map((slot) => mergeDraftSummary(slot, input.drafts)),
    [input.drafts, input.party],
  )
  const patchedBoxes = useMemo(
    () =>
      (input.boxes ?? []).map((box) => ({
        ...box,
        slots: box.slots.map((slot) => mergeDraftSummary(slot, input.drafts)),
      })),
    [input.drafts, input.boxes],
  )

  return {
    dirty: draftChanges.length > 0,
    draft,
    draftChanges,
    draftRequests,
    patchedBoxes,
    patchedParty,
  }
}
