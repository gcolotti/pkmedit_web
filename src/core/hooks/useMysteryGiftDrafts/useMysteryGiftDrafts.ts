import type { Dispatch, SetStateAction } from 'react'
import { useShallow } from 'zustand/react/shallow'

import type { Translator } from '../../i18n/i18n/i18n'
import type { ApiClient } from '../../services/api/api'
import { useDraftStore } from '../../state/draftStore/draftStore'
import type {
  MysteryGiftDatabasePreview,
  PokemonReplacement,
} from '../../types/database/database'
import type { DraftLegalityViolation, PokemonDetail } from '../../types/index/index'

type Context = {
  api: ApiClient
  baseDetails: Record<string, PokemonDetail>
  setBaseDetails: Dispatch<SetStateAction<Record<string, PokemonDetail>>>
  setDrafts: Dispatch<SetStateAction<Record<string, PokemonDetail>>>
  setReplacementDrafts: Dispatch<
    SetStateAction<Record<string, PokemonReplacement>>
  >
  setSelectedSlotId: (slotId: string | null) => void
  setDraftViolations: Dispatch<SetStateAction<DraftLegalityViolation[]>>
  setToast: (message: string) => void
  summary: { sessionId: string } | null
  t: Translator
}

export function useMysteryGiftDrafts({
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
}: Context) {
  const {
    addMysteryGiftDraft,
    mysteryGiftDrafts,
    revertMysteryGiftDraft,
    setMysteryGiftDrafts,
  } = useDraftStore(
    useShallow((s) => ({
      addMysteryGiftDraft: s.addMysteryGiftDraft,
      mysteryGiftDrafts: s.mysteryGiftDrafts,
      revertMysteryGiftDraft: s.revertMysteryGiftDraft,
      setMysteryGiftDrafts: s.setMysteryGiftDrafts,
    })),
  )

  function revertMysteryGiftEdit(id: string) {
    revertMysteryGiftDraft(id)
  }

  async function applyMysteryGiftPreview(
    preview: MysteryGiftDatabasePreview,
    slotId?: string,
  ) {
    const replacement = preview.replacement
    const pokemon = preview.pokemon
    if (slotId && pokemon && replacement && summary) {
      const base =
        baseDetails[slotId] ?? (await api.getPokemon(summary.sessionId, slotId))
      const next = structuredClone(pokemon)
      next.summary.slotId = slotId
      setBaseDetails((current) => ({
        ...current,
        [slotId]: current[slotId] ?? base,
      }))
      setDrafts((current) => ({ ...current, [slotId]: next }))
      setReplacementDrafts((current) => ({ ...current, [slotId]: replacement }))
      setSelectedSlotId(slotId)
      setDraftViolations([])
      setToast(t('mysteryGiftSlotDraftApplied'))
      return
    }

    addMysteryGiftDraft(preview)
    setToast(t('mysteryGiftDraftApplied'))
  }

  return {
    mysteryGiftDrafts,
    setMysteryGiftDrafts,
    revertMysteryGiftEdit,
    applyMysteryGiftPreview,
  }
}
