import type { ApiClient } from '../../services/api/api'
import {
  buildPokemonLegalityInputKey,
  buildPokemonPayload,
} from '../../services/pokemonPayload/pokemonPayload'
import { useDraftStore } from '../../state/draftStore/draftStore'
import type { DraftState } from '../../state/draftStoreTypes/draftStoreTypes'
import type { PokemonDetail } from '../../types/index/index'
import {
  markSelectedLegalityError,
  writeSelectedLegality,
} from './pokemonSelectionLegalityCache'

type SummaryRef = { sessionId: string } | null

export async function previewAndApplyDraft(input: {
  api: ApiClient
  isCurrent: (latest: PokemonDetail) => boolean
  optimistic: PokemonDetail
  saveTrainerLanguage?: number | null
  selectedSlotId: string
  setDrafts: DraftState['setPokemonDrafts']
  setPokemonLegality: DraftState['setPokemonLegality']
  setToast: (message: string) => void
  summary: SummaryRef
}) {
  if (!input.summary) return
  try {
    const preview = await input.api.previewPokemonUpdate(
      input.summary.sessionId,
      input.selectedSlotId,
      buildPokemonPayload(input.optimistic, input.saveTrainerLanguage),
    )
    let applied = false
    input.setDrafts((current) => {
      const latest = current[input.selectedSlotId]
      if (!latest || !input.isCurrent(latest)) return current
      applied = true
      return { ...current, [input.selectedSlotId]: preview }
    })
    if (applied)
      writeSelectedLegality(
        input.selectedSlotId,
        preview,
        buildPokemonLegalityInputKey(preview, input.saveTrainerLanguage),
        input.setPokemonLegality,
      )
  } catch (error) {
    input.setToast(error instanceof Error ? error.message : String(error))
  }
}

export async function recheckSelectedLegality(input: {
  api: ApiClient
  baseDetails: Record<string, PokemonDetail>
  drafts: Record<string, PokemonDetail>
  saveTrainerLanguage?: number | null
  selectedSlotId: string | null
  setDrafts: DraftState['setPokemonDrafts']
  setPokemonLegality: DraftState['setPokemonLegality']
  summary: SummaryRef
}) {
  if (!input.selectedSlotId || !input.summary) return
  const current =
    input.drafts[input.selectedSlotId] ??
    input.baseDetails[input.selectedSlotId]
  if (!current) return

  const inputKey = buildPokemonLegalityInputKey(
    current,
    input.saveTrainerLanguage,
  )
  input.setPokemonLegality((legality) => ({
    ...legality,
    [input.selectedSlotId!]: {
      report: legality[input.selectedSlotId!]?.report ?? current.legality,
      checkedAt: legality[input.selectedSlotId!]?.checkedAt ?? null,
      inputKey,
      status: 'checking',
      error: null,
    },
  }))

  try {
    const preview = await input.api.previewPokemonUpdate(
      input.summary.sessionId,
      input.selectedSlotId,
      buildPokemonPayload(current, input.saveTrainerLanguage),
    )
    if (
      !isLatestInput(input.selectedSlotId, inputKey, input.saveTrainerLanguage)
    )
      return
    input.setDrafts((cur) =>
      mergePreviewSummary(cur, input.selectedSlotId!, preview),
    )
    writeSelectedLegality(
      input.selectedSlotId,
      preview,
      inputKey,
      input.setPokemonLegality,
    )
  } catch (error) {
    markSelectedLegalityError(
      input.selectedSlotId,
      current,
      inputKey,
      error,
      input.setPokemonLegality,
    )
  }
}

function isLatestInput(
  selectedSlotId: string,
  inputKey: string,
  saveTrainerLanguage?: number | null,
) {
  const latestStore = useDraftStore.getState()
  const latest =
    latestStore.pokemonDrafts[selectedSlotId] ??
    latestStore.baseDetails[selectedSlotId]
  return (
    !!latest &&
    buildPokemonLegalityInputKey(latest, saveTrainerLanguage) === inputKey
  )
}

function mergePreviewSummary(
  current: Record<string, PokemonDetail>,
  selectedSlotId: string,
  preview: PokemonDetail,
) {
  const latest = current[selectedSlotId]
  if (!latest) return current
  return {
    ...current,
    [selectedSlotId]: {
      ...latest,
      summary: {
        ...latest.summary,
        legal: preview.summary.legal,
        legalSeverity: preview.summary.legalSeverity,
      },
    },
  }
}
