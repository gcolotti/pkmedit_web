import { useState } from 'react'

import type { Translator } from '../../i18n/i18n/i18n'
import { useBoxes } from '../../query/useBoxes/useBoxes'
import { useOpenSave } from '../../query/useOpenSave/useOpenSave'
import { useParty } from '../../query/useParty/useParty'
import { useUploadSave } from '../../query/useUploadSave/useUploadSave'
import type { ApiClient } from '../../services/api/api'
import {
  readLastUploadedSave,
  storeLastUploadedSave,
} from '../../services/localDb/localDb'
import type { LegalityReport, SaveSummary } from '../../types/index/index'

type WorkspaceSessionInput = {
  api: ApiClient
  refreshSaves: () => Promise<void>
  resetDrafts: () => void
  setSelectedSlotId: (slotId: string | null) => void
  showToast: (message: string) => void
  t: Translator
}

export function useWorkspaceSession({
  api,
  refreshSaves,
  resetDrafts,
  setSelectedSlotId,
  showToast,
  t,
}: WorkspaceSessionInput) {
  const [summary, setSummary] = useState<SaveSummary | null>(null)
  const [legalityReports, setLegalityReports] = useState<LegalityReport[]>([])
  const sessionId = summary?.sessionId
  const partyQuery = useParty(api, sessionId)
  const boxesQuery = useBoxes(api, sessionId)
  const openSaveMutation = useOpenSave(api)
  const uploadSaveMutation = useUploadSave(api)

  function resetDraftsForNewSave(newSummary: SaveSummary) {
    setSummary(newSummary)
    setSelectedSlotId(null)
    resetDrafts()
    setLegalityReports([])
  }

  async function openSelectedSave(selectedSave: string) {
    if (!selectedSave) return
    const result = await openSaveMutation.mutateAsync(selectedSave)
    resetDraftsForNewSave(result.summary)
    showToast(t('writeReady'))
    void api
      .exportSave(result.summary.sessionId)
      .then((blob) => storeLastUploadedSave(result.summary.fileName, blob))
      .catch(() => undefined)
  }

  async function uploadSave(file: File) {
    const result = await uploadSaveMutation.mutateAsync(file)
    resetDraftsForNewSave(result.summary)
    await storeLastUploadedSave(file.name, file)
    await refreshSaves()
    showToast(t('writeReady'))
  }

  async function restoreLastLocalSave() {
    const stored = await readLastUploadedSave()
    if (!stored) return
    const file = new File([stored.blob], stored.fileName, {
      type: stored.blob.type || 'application/octet-stream',
    })
    const result = await uploadSaveMutation.mutateAsync(file)
    resetDraftsForNewSave(result.summary)
    showToast(t('writeReady'))
  }

  return {
    boxesQuery,
    legalityReports,
    openSelectedSave,
    partyQuery,
    restoreLastLocalSave,
    setLegalityReports,
    setSummary,
    summary,
    uploadSave,
  }
}
