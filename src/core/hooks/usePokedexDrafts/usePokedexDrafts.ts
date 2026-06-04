import { useShallow } from 'zustand/react/shallow'

import { useDraftStore } from '../../state/draftStore/draftStore'
import type { PokedexActionKey } from '../../types/index/index'

export function usePokedexDrafts() {
  const {
    applyPokedexAction,
    pokedexDrafts,
    revertPokedexAction,
    setPokedexDrafts,
  } = useDraftStore(
    useShallow((s) => ({
      applyPokedexAction: s.applyPokedexAction,
      pokedexDrafts: s.pokedexDrafts,
      revertPokedexAction: s.revertPokedexAction,
      setPokedexDrafts: s.setPokedexDrafts,
    })),
  )

  function applyPokedexActions(key: PokedexActionKey) {
    applyPokedexAction(key)
  }

  return {
    pokedexDrafts,
    setPokedexDrafts,
    applyPokedexActions,
    revertPokedexAction,
  }
}
