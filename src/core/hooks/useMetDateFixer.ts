import { useShallow } from 'zustand/react/shallow'

import type { ApiClient } from '../services/api'
import { useDraftStore } from '../state/draftStore'
import type {
  MetDateFixerPreview,
  MetDateFixerRequest,
} from '../types/metDateFixer'

export function useMetDateFixer(api: ApiClient, sessionId: string | undefined) {
  const { metDateFixerDraft, setMetDateFixerDraft } = useDraftStore(
    useShallow((s) => ({
      metDateFixerDraft: s.metDateFixerDraft,
      setMetDateFixerDraft: s.setMetDateFixerDraft,
    })),
  )

  async function previewMetDateFixer(
    request: MetDateFixerRequest,
  ): Promise<MetDateFixerPreview | null> {
    if (!sessionId) return null
    return api.previewMetDateFixer(sessionId, request)
  }

  function queueMetDateFixerDraft(request: MetDateFixerRequest) {
    setMetDateFixerDraft(request)
  }

  function revertMetDateFixerDraft() {
    setMetDateFixerDraft(null)
  }

  return {
    metDateFixerDraft,
    setMetDateFixerDraft,
    previewMetDateFixer,
    queueMetDateFixerDraft,
    revertMetDateFixerDraft,
  }
}
