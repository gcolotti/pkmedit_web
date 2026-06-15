import { useShallow } from 'zustand/react/shallow'

import type { ApiClient } from '../../services/api/api'
import { selectedDetail } from '../../services/draftSelection/draftSelection'
import { buildPokemonLegalityInputKey } from '../../services/pokemonPayload/pokemonPayload'
import { useDraftStore } from '../../state/draftStore/draftStore'
import type { DraftState } from '../../state/draftStoreTypes/draftStoreTypes'
import type { PokemonDetail } from '../../types/index/index'
import {
  previewAndApplyDraft,
  recheckSelectedLegality as recheckSelectedLegalityForSlot,
} from './pokemonSelectionLegality'
import {
  initializeSelectedLegality,
  markSelectedLegalityStale,
  writeSelectedLegality,
} from './pokemonSelectionLegalityCache'

export function usePokemonSelection(
  api: ApiClient,
  summary: { sessionId: string } | null,
  selectedSlotId: string | null,
  setSelectedSlotId: (id: string | null) => void,
  setToast: (message: string) => void,
  setPokemonLegality: DraftState['setPokemonLegality'],
) {
  const {
    baseDetails,
    clearReplacementDraft,
    drafts,
    setBaseDetails,
    setDatabasePreview,
    setDraftViolations,
    setDrafts,
  } = useDraftStore(
    useShallow((s) => ({
      baseDetails: s.baseDetails,
      clearReplacementDraft: s.clearReplacementDraft,
      drafts: s.pokemonDrafts,
      setBaseDetails: s.setBaseDetails,
      setDatabasePreview: s.setDatabasePreview,
      setDraftViolations: s.setDraftViolations,
      setDrafts: s.setPokemonDrafts,
    })),
  )

  async function selectSlot(slotId: string) {
    if (!summary) return
    const detail = await api.getPokemon(summary.sessionId, slotId)
    setDatabasePreview(null)
    setSelectedSlotId(slotId)
    setBaseDetails((current) => ({ ...current, [slotId]: detail }))
    setDrafts((current) => ({
      ...current,
      [slotId]: current[slotId] ?? structuredClone(detail),
    }))
    initializeSelectedLegality(slotId, detail, setPokemonLegality)
  }

  const setDraft: React.Dispatch<React.SetStateAction<PokemonDetail | null>> = (
    value,
  ) => {
    if (!selectedSlotId) return
    setDrafts((current) => {
      const previous =
        current[selectedSlotId] ?? baseDetails[selectedSlotId] ?? null
      const next = typeof value === 'function' ? value(previous) : value
      return next ? { ...current, [selectedSlotId]: next } : current
    })
    markSelectedLegalityStale(selectedSlotId, setPokemonLegality)
    clearReplacementDraft(selectedSlotId)
    setDraftViolations([])
  }

  async function changeDraftSpecies(species: number, speciesName: string) {
    if (!selectedSlotId) return

    const currentDraft = selectedDetail(selectedSlotId, drafts, baseDetails)
    if (!currentDraft) return

    const optimistic = structuredClone(currentDraft)
    optimistic.summary.species = species
    optimistic.summary.speciesName = speciesName || species.toString()
    optimistic.summary.form = 0

    setDrafts((current) => ({ ...current, [selectedSlotId]: optimistic }))
    markSelectedLegalityStale(selectedSlotId, setPokemonLegality)
    clearReplacementDraft(selectedSlotId)
    setDraftViolations([])

    await previewAndApplyDraft({
      api,
      isCurrent: (latest) => latest.summary.species === species,
      optimistic,
      selectedSlotId,
      setDrafts,
      setPokemonLegality,
      setToast,
      summary,
    })
  }

  async function changeDraftForm(form: number) {
    if (!selectedSlotId) return

    const currentDraft = selectedDetail(selectedSlotId, drafts, baseDetails)
    if (!currentDraft) return

    const optimistic = structuredClone(currentDraft)
    optimistic.summary.form = form

    setDrafts((current) => ({ ...current, [selectedSlotId]: optimistic }))
    markSelectedLegalityStale(selectedSlotId, setPokemonLegality)
    clearReplacementDraft(selectedSlotId)
    setDraftViolations([])

    await previewAndApplyDraft({
      api,
      isCurrent: (latest) => latest.summary.form === form,
      optimistic,
      selectedSlotId,
      setDrafts,
      setPokemonLegality,
      setToast,
      summary,
    })
  }

  // Silent, slot-scoped legality recheck for the live debounced check (staleness
  // mix "C"). previewPokemonUpdate returns the slot's detail with a fresh
  // legality report without touching the save or toasting. Only the legality +
  // summary legal flags are merged back, so in-progress edits are preserved and
  // the party/boxes icon (reads slot.legal) stays in sync.
  async function recheckSelectedLegality() {
    await recheckSelectedLegalityForSlot({
      api,
      baseDetails,
      drafts,
      selectedSlotId,
      setDrafts,
      setPokemonLegality,
      summary,
    })
  }

  function updateSelectedLegality(detail: PokemonDetail) {
    if (!selectedSlotId) return
    writeSelectedLegality(
      selectedSlotId,
      detail,
      buildPokemonLegalityInputKey(detail),
      setPokemonLegality,
    )
  }

  return {
    selectSlot,
    setDraft,
    changeDraftSpecies,
    changeDraftForm,
    recheckSelectedLegality,
    updateSelectedLegality,
  }
}
