import { useShallow } from 'zustand/react/shallow'

import type { ApiClient } from '../../services/api/api'
import { selectedDetail } from '../../services/draftSelection/draftSelection'
import { buildPokemonPayload } from '../../services/pokemonPayload/pokemonPayload'
import { useDraftStore } from '../../state/draftStore/draftStore'
import type { PokemonDetail } from '../../types/index/index'

export function usePokemonSelection(
  api: ApiClient,
  summary: { sessionId: string } | null,
  selectedSlotId: string | null,
  setSelectedSlotId: (id: string | null) => void,
  setToast: (message: string) => void,
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
    clearReplacementDraft(selectedSlotId)
    setDraftViolations([])

    if (!summary) return

    try {
      const preview = await api.previewPokemonUpdate(
        summary.sessionId,
        selectedSlotId,
        buildPokemonPayload(optimistic),
      )
      setDrafts((current) => {
        const latest = current[selectedSlotId]
        if (!latest || latest.summary.species !== species) return current
        return { ...current, [selectedSlotId]: preview }
      })
    } catch (error) {
      setToast(error instanceof Error ? error.message : String(error))
    }
  }

  async function changeDraftForm(form: number) {
    if (!selectedSlotId) return

    const currentDraft = selectedDetail(selectedSlotId, drafts, baseDetails)
    if (!currentDraft) return

    const optimistic = structuredClone(currentDraft)
    optimistic.summary.form = form

    setDrafts((current) => ({ ...current, [selectedSlotId]: optimistic }))
    clearReplacementDraft(selectedSlotId)
    setDraftViolations([])

    if (!summary) return

    try {
      const preview = await api.previewPokemonUpdate(
        summary.sessionId,
        selectedSlotId,
        buildPokemonPayload(optimistic),
      )
      setDrafts((current) => {
        const latest = current[selectedSlotId]
        if (!latest || latest.summary.form !== form) return current
        return { ...current, [selectedSlotId]: preview }
      })
    } catch (error) {
      setToast(error instanceof Error ? error.message : String(error))
    }
  }

  // Silent, slot-scoped legality recheck for the live debounced check (staleness
  // mix "C"). previewPokemonUpdate returns the slot's detail with a fresh
  // legality report without touching the save or toasting. Only the legality +
  // summary legal flags are merged back, so in-progress edits are preserved and
  // the party/boxes icon (reads slot.legal) stays in sync.
  async function recheckSelectedLegality() {
    if (!selectedSlotId || !summary) return
    const current = drafts[selectedSlotId] ?? baseDetails[selectedSlotId]
    if (!current) return
    try {
      const preview = await api.previewPokemonUpdate(
        summary.sessionId,
        selectedSlotId,
        buildPokemonPayload(current),
      )
      setDrafts((cur) => {
        const latest = cur[selectedSlotId]
        if (!latest) return cur
        if (
          latest.legality.legal === preview.legality.legal &&
          latest.summary.legalSeverity === preview.summary.legalSeverity
        )
          return cur
        return {
          ...cur,
          [selectedSlotId]: {
            ...latest,
            legality: preview.legality,
            summary: {
              ...latest.summary,
              legal: preview.summary.legal,
              legalSeverity: preview.summary.legalSeverity,
            },
          },
        }
      })
    } catch {
      // Background recheck: ignore failures.
    }
  }

  return {
    selectSlot,
    setDraft,
    changeDraftSpecies,
    changeDraftForm,
    recheckSelectedLegality,
  }
}
