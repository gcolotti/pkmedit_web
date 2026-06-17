import { useShallow } from 'zustand/react/shallow'

import type { ApiClient } from '../../services/api/api'
import { syncPokemonHandlingTrainerLanguage } from '../../services/handlingTrainerLanguage/handlingTrainerLanguage'
import { buildPokemonLegalityInputKey } from '../../services/pokemonPayload/pokemonPayload'
import { useDraftStore } from '../../state/draftStore/draftStore'
import type { DraftState } from '../../state/draftStoreTypes/draftStoreTypes'
import type { PokemonDetail } from '../../types/index/index'
import { recheckSelectedLegality as recheckSelectedLegalityForSlot } from './pokemonSelectionLegality'
import {
  initializeSelectedLegality,
  markSelectedLegalityStale,
  writeSelectedLegality,
} from './pokemonSelectionLegalityCache'
import { previewSummaryEdit } from './pokemonSelectionSummaryEdit'

export function usePokemonSelection(
  api: ApiClient,
  summary: { sessionId: string } | null,
  selectedSlotId: string | null,
  setSelectedSlotId: (id: string | null) => void,
  setToast: (message: string) => void,
  setPokemonLegality: DraftState['setPokemonLegality'],
  saveTrainerLanguage?: number | null,
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
    const initialDraft = syncPokemonHandlingTrainerLanguage(
      detail,
      saveTrainerLanguage,
    )
    setDatabasePreview(null)
    setSelectedSlotId(slotId)
    setBaseDetails((current) => ({ ...current, [slotId]: detail }))
    setDrafts((current) => ({
      ...current,
      [slotId]: current[slotId] ?? structuredClone(initialDraft),
    }))
    initializeSelectedLegality(
      slotId,
      detail,
      setPokemonLegality,
      saveTrainerLanguage,
    )
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

  const summaryEditBase = () => ({
    api,
    baseDetails,
    clearReplacementDraft,
    drafts,
    saveTrainerLanguage,
    selectedSlotId,
    setDrafts,
    setDraftViolations,
    setPokemonLegality,
    setToast,
    summary,
  })

  async function changeDraftSpecies(species: number, speciesName: string) {
    await previewSummaryEdit({
      ...summaryEditBase(),
      isCurrent: (latest) => latest.summary.species === species,
      mutate: (optimistic) => {
        optimistic.summary.species = species
        optimistic.summary.speciesName = speciesName || species.toString()
        optimistic.summary.form = 0
      },
    })
  }

  async function changeDraftForm(form: number) {
    await previewSummaryEdit({
      ...summaryEditBase(),
      isCurrent: (latest) => latest.summary.form === form,
      mutate: (optimistic) => {
        optimistic.summary.form = form
      },
    })
  }

  async function recheckSelectedLegality() {
    await recheckSelectedLegalityForSlot({
      api,
      baseDetails,
      drafts,
      saveTrainerLanguage,
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
      buildPokemonLegalityInputKey(detail, saveTrainerLanguage),
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
