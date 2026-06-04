import { useShallow } from 'zustand/react/shallow'

import type { ApiClient } from '../services/api'
import { useDraftStore } from '../state/draftStore'
import type { EncounterDatabaseSearchRequest } from '../types/database'

export function useDatabasePreview(
  api: ApiClient,
  summary: { sessionId: string } | null,
) {
  const { databasePreview, setDatabasePreview } = useDraftStore(
    useShallow((s) => ({
      databasePreview: s.databasePreview,
      setDatabasePreview: s.setDatabasePreview,
    })),
  )

  async function previewEncounter(
    search: EncounterDatabaseSearchRequest,
    resultId: string,
  ) {
    if (!summary) return null
    const preview = await api.previewEncounter(
      summary.sessionId,
      search,
      resultId,
    )
    const value = { ...preview, search }
    setDatabasePreview(value)
    return value
  }

  async function previewMysteryGift(resultId: string) {
    if (!summary) return null
    const preview = await api.previewMysteryGift(summary.sessionId, resultId)
    setDatabasePreview(preview)
    return preview
  }

  return {
    databasePreview,
    setDatabasePreview,
    previewEncounter,
    previewMysteryGift,
  }
}
