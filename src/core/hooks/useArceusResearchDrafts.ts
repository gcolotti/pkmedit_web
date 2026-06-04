import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

import type { ApiClient } from '../services/api'
import { useDraftStore } from '../state/draftStore'
import type {
  ArceusResearchActionKey,
  ArceusResearchBulkAction,
} from '../types/index'

export function useArceusResearchDrafts(
  api: ApiClient,
  sessionId: string | null,
  saveView: string,
  saveKind: string | null,
) {
  const {
    applyArceusResearchAction,
    arceusResearchBulkDrafts,
    arceusResearchDrafts,
    arceusResearchStatus,
    revertArceusResearchAction,
    revertArceusResearchBulk,
    setArceusResearchStatus,
    toggleArceusResearchBulk,
  } = useDraftStore(
    useShallow((s) => ({
      applyArceusResearchAction: s.applyArceusResearchAction,
      arceusResearchBulkDrafts: s.arceusResearchBulkDrafts,
      arceusResearchDrafts: s.arceusResearchDrafts,
      arceusResearchStatus: s.arceusResearchStatus,
      revertArceusResearchAction: s.revertArceusResearchAction,
      revertArceusResearchBulk: s.revertArceusResearchBulk,
      setArceusResearchStatus: s.setArceusResearchStatus,
      toggleArceusResearchBulk: s.toggleArceusResearchBulk,
    })),
  )

  useEffect(() => {
    if (saveView !== 'pokedex' || !sessionId || saveKind !== 'pla') {
      return
    }
    setArceusResearchStatus(null)
    api.save
      .getArceusResearchStatus(sessionId)
      .then(setArceusResearchStatus)
      .catch(() => setArceusResearchStatus(null))
  }, [api, sessionId, saveView, saveKind, setArceusResearchStatus])

  function applyAction(key: ArceusResearchActionKey) {
    applyArceusResearchAction(key)
  }

  function revertAction(key: ArceusResearchActionKey) {
    revertArceusResearchAction(key)
  }

  function toggleBulk(action: ArceusResearchBulkAction) {
    toggleArceusResearchBulk(action)
  }

  function revertBulk(action: ArceusResearchBulkAction) {
    revertArceusResearchBulk(action)
  }

  return {
    arceusResearchStatus,
    arceusResearchDrafts,
    arceusResearchBulkDrafts,
    applyAction,
    revertAction,
    toggleBulk,
    revertBulk,
  }
}
