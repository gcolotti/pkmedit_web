import { useShallow } from 'zustand/react/shallow'

import type { ApiClient } from '../services/api'
import { useDraftStore } from '../state/draftStore'
import type { DonutDraft, DonutPocket, DonutPreview } from '../types/donut'

export function useDonutDrafts(api: ApiClient, sessionId: string | undefined) {
  const { addDonut, donutDrafts, revertDonut, setDonutDrafts } = useDraftStore(
    useShallow((s) => ({
      addDonut: s.addDonutDraft,
      donutDrafts: s.donutDrafts,
      revertDonut: s.revertDonutDraft,
      setDonutDrafts: s.setDonutDrafts,
    })),
  )

  function addDonutDraft(draft: DonutDraft) {
    addDonut(draft)
  }

  function revertDonutDraft(id: string) {
    revertDonut(id)
  }

  async function previewDonut(
    berries: number[],
    berryName: number,
  ): Promise<DonutPreview | null> {
    if (!sessionId) return null
    return api.previewDonut(sessionId, berries, berryName)
  }

  async function getDonuts(sessionId: string): Promise<DonutPocket> {
    return api.getDonuts(sessionId)
  }

  return {
    donutDrafts,
    setDonutDrafts,
    addDonutDraft,
    revertDonutDraft,
    previewDonut,
    getDonuts,
  }
}
