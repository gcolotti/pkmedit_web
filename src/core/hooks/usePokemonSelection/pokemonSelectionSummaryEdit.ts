import type { ApiClient } from '../../services/api/api'
import { selectedDetail } from '../../services/draftSelection/draftSelection'
import type { DraftState } from '../../state/draftStoreTypes/draftStoreTypes'
import type { PokemonDetail } from '../../types/index/index'
import { previewAndApplyDraft } from './pokemonSelectionLegality'
import { markSelectedLegalityStale } from './pokemonSelectionLegalityCache'

export async function previewSummaryEdit(input: {
  api: ApiClient
  baseDetails: Record<string, PokemonDetail>
  clearReplacementDraft: (id: string) => void
  drafts: Record<string, PokemonDetail>
  isCurrent: (latest: PokemonDetail) => boolean
  mutate: (draft: PokemonDetail) => void
  saveTrainerLanguage?: number | null
  selectedSlotId: string | null
  setDrafts: DraftState['setPokemonDrafts']
  setDraftViolations: DraftState['setDraftViolations']
  setPokemonLegality: DraftState['setPokemonLegality']
  setToast: (message: string) => void
  summary: { sessionId: string } | null
}) {
  if (!input.selectedSlotId) return

  const currentDraft = selectedDetail(
    input.selectedSlotId,
    input.drafts,
    input.baseDetails,
  )
  if (!currentDraft) return

  const optimistic = structuredClone(currentDraft)
  input.mutate(optimistic)

  input.setDrafts((current) => ({
    ...current,
    [input.selectedSlotId!]: optimistic,
  }))
  markSelectedLegalityStale(input.selectedSlotId, input.setPokemonLegality)
  input.clearReplacementDraft(input.selectedSlotId)
  input.setDraftViolations([])

  await previewAndApplyDraft({
    api: input.api,
    isCurrent: input.isCurrent,
    optimistic,
    saveTrainerLanguage: input.saveTrainerLanguage,
    selectedSlotId: input.selectedSlotId,
    setDrafts: input.setDrafts,
    setPokemonLegality: input.setPokemonLegality,
    setToast: input.setToast,
    summary: input.summary,
  })
}
