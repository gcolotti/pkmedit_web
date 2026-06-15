import { useShallow } from 'zustand/react/shallow'

import { useDraftStore } from '../../state/draftStore/draftStore'
import { useUiStore } from '../../state/uiStore/uiStore'

export function useDraftWorkspaceSlices() {
  return useDraftStore(
    useShallow((s) => ({
      baseDetails: s.baseDetails,
      draftViolations: s.draftViolations,
      drafts: s.pokemonDrafts,
      pokemonLegality: s.pokemonLegality,
      pokedexStatus: s.pokedexStatus,
      resetDrafts: s.resetDrafts,
      setBaseDetails: s.setBaseDetails,
      setDraftViolations: s.setDraftViolations,
      setDrafts: s.setPokemonDrafts,
      setPokemonLegality: s.setPokemonLegality,
      setPokedexStatus: s.setPokedexStatus,
    })),
  )
}

export function useUiWorkspaceSlices() {
  return useUiStore(
    useShallow((s) => ({
      boxIndex: s.boxIndex,
      databaseView: s.databaseView,
      saveView: s.saveView,
      selectedSlotId: s.selectedSlotId,
      setBoxIndex: s.setBoxIndex,
      setDatabaseView: s.setDatabaseView,
      setSaveView: s.setSaveView,
      setSelectedSlotId: s.setSelectedSlotId,
      setView: s.setView,
      showToast: s.showToast,
      toast: s.toast,
      view: s.view,
    })),
  )
}
