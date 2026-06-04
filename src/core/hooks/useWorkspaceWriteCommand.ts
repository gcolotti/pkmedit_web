import { useCallback } from 'react'

import { writeSave } from './useSaveWriter'
import type { WorkspaceCommandsInput } from './workspaceCommandTypes'

export function useWorkspaceWriteCommand(input: WorkspaceCommandsInput) {
  const { api, allowIllegalChanges, t } = input
  const { dirty, draftRequests } = input.derived
  const { setSummary, summary } = input.session
  const { showToast } = input.ui

  const write = useCallback(
    async (format: 'sav' | 'zip') => {
      if (!summary) return
      await writeSave(
        summary,
        api,
        dirty,
        draftRequests,
        allowIllegalChanges,
        input.sections.state.trainerDraft,
        input.sections.state.itemsDraft,
        input.sections.state.undergroundDraft,
        input.raids.state.draft,
        input.database.state.mysteryGiftDrafts,
        input.pokedex.pokedexDrafts,
        input.donuts.donutDrafts,
        input.metDate.metDateFixerDraft,
        input.arceusResearch.arceusResearchDrafts,
        input.arceusResearch.arceusResearchBulkDrafts,
        setSummary,
        showToast,
        t,
        format,
      )
    },
    [
      allowIllegalChanges,
      api,
      dirty,
      draftRequests,
      input.arceusResearch.arceusResearchBulkDrafts,
      input.arceusResearch.arceusResearchDrafts,
      input.database.state.mysteryGiftDrafts,
      input.donuts.donutDrafts,
      input.metDate.metDateFixerDraft,
      input.pokedex.pokedexDrafts,
      input.raids.state.draft,
      input.sections.state.itemsDraft,
      input.sections.state.trainerDraft,
      input.sections.state.undergroundDraft,
      setSummary,
      showToast,
      summary,
      t,
    ],
  )

  return {
    writeWorkspaceSave: useCallback(() => write('sav'), [write]),
    writeWorkspaceSaveZip: useCallback(() => write('zip'), [write]),
  }
}
