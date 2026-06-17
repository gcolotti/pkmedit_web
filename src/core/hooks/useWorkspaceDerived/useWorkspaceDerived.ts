import { useMemo } from 'react'

import {
  buildDraftChangeList,
  buildDraftRequests,
  mergeDraftSummary,
} from '../../services/draftChanges/draftChanges'
import { buildWorkspaceDraftChanges } from '../../services/drafts/drafts'
import { selectedDetail } from '../../services/draftSelection/draftSelection'
import { buildPokemonLegalityInputKey } from '../../services/pokemonPayload/pokemonPayload'
import type { DraftChange } from '../../types/index/index'
import type { WorkspaceDerivedInput } from './useWorkspaceDerivedTypes'

export function useWorkspaceDerived(input: WorkspaceDerivedInput) {
  const saveTrainerLanguage =
    (input.trainerDraft ?? input.trainerBase)?.language ?? null
  const draft = selectedDetail(
    input.selectedSlotId,
    input.drafts,
    input.baseDetails,
  )
  const selectedLegality = input.selectedSlotId
    ? (input.pokemonLegality[input.selectedSlotId] ?? null)
    : null
  const legalityInputKey = draft
    ? buildPokemonLegalityInputKey(draft, saveTrainerLanguage)
    : null
  const draftRequests = useMemo(
    () =>
      buildDraftRequests(
        input.baseDetails,
        input.drafts,
        input.replacementDrafts,
        saveTrainerLanguage,
      ),
    [
      input.baseDetails,
      input.drafts,
      input.replacementDrafts,
      saveTrainerLanguage,
    ],
  )
  const pokemonDraftChanges = useMemo(
    () =>
      buildDraftChangeList(
        input.baseDetails,
        input.drafts,
        input.t,
        saveTrainerLanguage,
      ),
    [input.baseDetails, input.drafts, input.t, saveTrainerLanguage],
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
    legalityInputKey,
    patchedBoxes,
    patchedParty,
    selectedLegality,
  }
}
