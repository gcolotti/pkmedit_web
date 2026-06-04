import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

import type { ApiClient } from '../services/api'
import { useDraftStore } from '../state/draftStore'

export function usePokedexStatus(
  api: ApiClient,
  sessionId: string | null,
  saveView: string,
) {
  const { pokedexStatus, setPokedexStatus } = useDraftStore(
    useShallow((s) => ({
      pokedexStatus: s.pokedexStatus,
      setPokedexStatus: s.setPokedexStatus,
    })),
  )

  useEffect(() => {
    if (saveView !== 'pokedex' || !sessionId) return
    setPokedexStatus(null)
    api.save
      .getPokedexStatus(sessionId)
      .then(setPokedexStatus)
      .catch(() => setPokedexStatus(null))
  }, [api, sessionId, saveView, setPokedexStatus])

  return { pokedexStatus, setPokedexStatus }
}
