import { useShallow } from 'zustand/react/shallow'

import type { ApiClient } from '../../services/api/api'
import { selectedDetail } from '../../services/draftSelection/draftSelection'
import {
  buildPokemonLegalityInputKey,
  buildPokemonPayload,
} from '../../services/pokemonPayload/pokemonPayload'
import { useDraftStore } from '../../state/draftStore/draftStore'
import type { DraftState } from '../../state/draftStoreTypes/draftStoreTypes'
import type { PokemonDetail } from '../../types/index/index'

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
    const inputKey = buildPokemonLegalityInputKey(detail)
    setDatabasePreview(null)
    setSelectedSlotId(slotId)
    setBaseDetails((current) => ({ ...current, [slotId]: detail }))
    setDrafts((current) => ({
      ...current,
      [slotId]: current[slotId] ?? structuredClone(detail),
    }))
    setPokemonLegality((current) => ({
      ...current,
      [slotId]: current[slotId] ?? {
        report: detail.legality,
        checkedAt: Date.now(),
        inputKey,
        status: 'fresh',
        error: null,
      },
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

    if (!summary) return

    try {
      const preview = await api.previewPokemonUpdate(
        summary.sessionId,
        selectedSlotId,
        buildPokemonPayload(optimistic),
      )
      let applied = false
      setDrafts((current) => {
        const latest = current[selectedSlotId]
        if (!latest || latest.summary.species !== species) return current
        applied = true
        return { ...current, [selectedSlotId]: preview }
      })
      if (applied)
        writeSelectedLegality(
          selectedSlotId,
          preview,
          buildPokemonLegalityInputKey(preview),
          setPokemonLegality,
        )
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
    markSelectedLegalityStale(selectedSlotId, setPokemonLegality)
    clearReplacementDraft(selectedSlotId)
    setDraftViolations([])

    if (!summary) return

    try {
      const preview = await api.previewPokemonUpdate(
        summary.sessionId,
        selectedSlotId,
        buildPokemonPayload(optimistic),
      )
      let applied = false
      setDrafts((current) => {
        const latest = current[selectedSlotId]
        if (!latest || latest.summary.form !== form) return current
        applied = true
        return { ...current, [selectedSlotId]: preview }
      })
      if (applied)
        writeSelectedLegality(
          selectedSlotId,
          preview,
          buildPokemonLegalityInputKey(preview),
          setPokemonLegality,
        )
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
    const inputKey = buildPokemonLegalityInputKey(current)
    setPokemonLegality((legality) => ({
      ...legality,
      [selectedSlotId]: {
        report: legality[selectedSlotId]?.report ?? current.legality,
        checkedAt: legality[selectedSlotId]?.checkedAt ?? null,
        inputKey,
        status: 'checking',
        error: null,
      },
    }))
    try {
      const preview = await api.previewPokemonUpdate(
        summary.sessionId,
        selectedSlotId,
        buildPokemonPayload(current),
      )
      const latestStore = useDraftStore.getState()
      const latest =
        latestStore.pokemonDrafts[selectedSlotId] ??
        latestStore.baseDetails[selectedSlotId]
      if (!latest || buildPokemonLegalityInputKey(latest) !== inputKey) return

      setDrafts((cur) => {
        const latest = cur[selectedSlotId]
        if (!latest) return cur
        return {
          ...cur,
          [selectedSlotId]: {
            ...latest,
            summary: {
              ...latest.summary,
              legal: preview.summary.legal,
              legalSeverity: preview.summary.legalSeverity,
            },
          },
        }
      })
      writeSelectedLegality(
        selectedSlotId,
        preview,
        inputKey,
        setPokemonLegality,
      )
    } catch (error) {
      setPokemonLegality((legality) => {
        const previous = legality[selectedSlotId]
        return {
          ...legality,
          [selectedSlotId]: {
            report: previous?.report ?? current.legality,
            checkedAt: previous?.checkedAt ?? null,
            inputKey,
            status: 'error',
            error: error instanceof Error ? error.message : String(error),
          },
        }
      })
    }
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

function markSelectedLegalityStale(
  selectedSlotId: string,
  setPokemonLegality: DraftState['setPokemonLegality'],
) {
  setPokemonLegality((legality) => {
    const previous = legality[selectedSlotId]
    if (!previous || previous.status === 'stale') return legality
    return {
      ...legality,
      [selectedSlotId]: {
        ...previous,
        status: 'stale',
      },
    }
  })
}

function writeSelectedLegality(
  selectedSlotId: string,
  detail: PokemonDetail,
  inputKey: string,
  setPokemonLegality: DraftState['setPokemonLegality'],
) {
  setPokemonLegality((legality) => ({
    ...legality,
    [selectedSlotId]: {
      report: detail.legality,
      checkedAt: Date.now(),
      inputKey,
      status: 'fresh',
      error: null,
    },
  }))
}
