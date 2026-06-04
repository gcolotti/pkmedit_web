import type { Dispatch, SetStateAction } from 'react'
import { useShallow } from 'zustand/react/shallow'

import type { Translator } from '../i18n/i18n'
import type { ApiClient } from '../services/api'
import { useDraftStore } from '../state/draftStore'
import type { EncounterDatabasePreview } from '../types/database'
import type {
  DraftLegalityViolation,
  PokemonDetail,
  SaveSummary,
} from '../types/index'
import { useDatabasePreview } from './useDatabasePreview'
import { useMysteryGiftDrafts } from './useMysteryGiftDrafts'

type DatabaseContext = {
  api: ApiClient
  baseDetails: Record<string, PokemonDetail>
  setBaseDetails: Dispatch<SetStateAction<Record<string, PokemonDetail>>>
  setDrafts: Dispatch<SetStateAction<Record<string, PokemonDetail>>>
  setDraftViolations: Dispatch<SetStateAction<DraftLegalityViolation[]>>
  setSelectedSlotId: (slotId: string | null) => void
  setToast: (message: string) => void
  summary: SaveSummary | null
  t: Translator
}

export function useSaveWorkspaceDatabases({
  api,
  baseDetails,
  setBaseDetails,
  setDrafts,
  setDraftViolations,
  setSelectedSlotId,
  setToast,
  summary,
  t,
}: DatabaseContext) {
  const { replacementDrafts, setReplacementDraft, setReplacementDrafts } =
    useDraftStore(
      useShallow((s) => ({
        replacementDrafts: s.replacementDrafts,
        setReplacementDraft: s.setReplacementDraft,
        setReplacementDrafts: s.setReplacementDrafts,
      })),
    )

  const preview = useDatabasePreview(api, summary)

  const mysteryGift = useMysteryGiftDrafts({
    api,
    baseDetails,
    setBaseDetails,
    setDrafts,
    setReplacementDrafts,
    setSelectedSlotId,
    setDraftViolations,
    setToast,
    summary,
    t,
  })

  async function applyEncounterPreview(
    encPreview: EncounterDatabasePreview,
    slotId: string,
  ) {
    if (!summary) return
    const base =
      baseDetails[slotId] ?? (await api.getPokemon(summary.sessionId, slotId))
    const next = structuredClone(encPreview.pokemon)
    next.summary.slotId = slotId
    setBaseDetails((current) => ({
      ...current,
      [slotId]: current[slotId] ?? base,
    }))
    setDrafts((current) => ({ ...current, [slotId]: next }))
    setReplacementDraft(slotId, encPreview.replacement)
    setSelectedSlotId(slotId)
    setDraftViolations([])
    setToast(t('encounterDraftApplied'))
  }

  async function searchEncounters(
    request: Parameters<ApiClient['searchEncounters']>[1],
  ) {
    if (!summary)
      return {
        total: 0,
        page: 1,
        pageSize: request.limit,
        pageCount: 1,
        results: [],
      }
    return api.searchEncounters(summary.sessionId, request)
  }

  async function searchMysteryGifts(
    request: Parameters<ApiClient['searchMysteryGifts']>[1],
  ) {
    if (!summary)
      return {
        total: 0,
        page: 1,
        pageSize: request.limit,
        pageCount: 1,
        storage: { supported: false, full: false, capacity: 0, used: 0 },
        legalityCounts: { legal: 0, uncertain: 0, illegal: 0 },
        results: [],
      }
    return api.searchMysteryGifts(summary.sessionId, request)
  }

  return {
    actions: {
      applyEncounterPreview,
      applyMysteryGiftPreview: mysteryGift.applyMysteryGiftPreview,
      previewEncounter: preview.previewEncounter,
      previewMysteryGift: preview.previewMysteryGift,
      searchEncounters,
      searchMysteryGifts,
    },
    setters: {
      setDatabasePreview: preview.setDatabasePreview,
      setMysteryGiftDrafts: mysteryGift.setMysteryGiftDrafts,
      setReplacementDrafts,
    },
    state: {
      databasePreview: preview.databasePreview,
      mysteryGiftDrafts: mysteryGift.mysteryGiftDrafts,
      replacementDrafts,
    },
    revertMysteryGiftEdit: mysteryGift.revertMysteryGiftEdit,
  }
}
