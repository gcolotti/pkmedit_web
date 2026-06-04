import { useShallow } from 'zustand/react/shallow'

import { selectedDetail } from '../../services/draftSelection/draftSelection'
import { useDraftStore } from '../../state/draftStore/draftStore'
import { useUiStore } from '../../state/uiStore/uiStore'

export function useCopyPaste(selectedSlotId: string | null) {
  const { baseDetails, drafts, setDraftViolations, setDrafts } = useDraftStore(
    useShallow((s) => ({
      baseDetails: s.baseDetails,
      drafts: s.pokemonDrafts,
      setDraftViolations: s.setDraftViolations,
      setDrafts: s.setPokemonDrafts,
    })),
  )
  const { pokemonClipboard, setPokemonClipboard } = useUiStore(
    useShallow((s) => ({
      pokemonClipboard: s.pokemonClipboard,
      setPokemonClipboard: s.setPokemonClipboard,
    })),
  )

  function copyPokemon() {
    if (!selectedSlotId) return
    const detail = selectedDetail(selectedSlotId, drafts, baseDetails)
    if (detail) setPokemonClipboard(structuredClone(detail))
  }

  function pastePokemon() {
    if (!selectedSlotId || !pokemonClipboard) return
    const pasted = structuredClone(pokemonClipboard)
    pasted.summary.slotId = selectedSlotId
    setDrafts((current) => ({ ...current, [selectedSlotId]: pasted }))
    setDraftViolations([])
  }

  return { copyPokemon, pastePokemon, pokemonClipboard }
}
