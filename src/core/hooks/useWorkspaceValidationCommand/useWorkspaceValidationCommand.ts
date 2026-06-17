import { useCallback } from 'react'

import { checkWorkspaceDraft } from '../../services/legality/legality'
import type { WorkspaceCommandsInput } from '../workspaceCommandTypes/workspaceCommandTypes'

export function useWorkspaceValidationCommand(input: WorkspaceCommandsInput) {
  const { api, allowIllegalChanges, t } = input
  const {
    baseDetails,
    drafts,
    setDrafts,
    setDraftViolations,
    setPokemonLegality,
  } = input.draftStore
  const { draftRequests } = input.derived
  const saveTrainerLanguage =
    (input.sections.state.trainerDraft ?? input.sections.state.trainerBase)
      ?.language ?? null
  const { selectedSlotId, showToast } = input.ui
  const { setLegalityReports, summary } = input.session

  return useCallback(
    (selectedOnly = false) =>
      checkWorkspaceDraft(
        {
          allowIllegalChanges,
          api,
          baseDetails,
          draftRequests,
          drafts,
          selectedSlotId,
          setDrafts,
          setDraftViolations,
          setPokemonLegality,
          setLegalityReports,
          setToast: showToast,
          saveTrainerLanguage,
          summary,
          t,
        },
        selectedOnly,
      ),
    [
      allowIllegalChanges,
      api,
      baseDetails,
      draftRequests,
      drafts,
      selectedSlotId,
      setDrafts,
      setDraftViolations,
      setPokemonLegality,
      setLegalityReports,
      saveTrainerLanguage,
      showToast,
      summary,
      t,
    ],
  )
}
