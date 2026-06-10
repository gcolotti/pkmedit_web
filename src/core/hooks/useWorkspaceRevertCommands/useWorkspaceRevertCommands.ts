import { useCallback } from 'react'

import { revertWorkspaceChange } from '../../services/revertWorkspaceChange/revertWorkspaceChange'
import type { DraftChange } from '../../types/index/index'
import type { WorkspaceCommandsInput } from '../workspaceCommandTypes/workspaceCommandTypes'

export function useWorkspaceRevertCommands(input: WorkspaceCommandsInput) {
  const { baseDetails, drafts, setDrafts, setDraftViolations } =
    input.draftStore
  const { setMysteryGiftDrafts, setReplacementDrafts } = input.database.setters

  const revertChange = useCallback(
    (change: DraftChange) => {
      revertWorkspaceChange(change, baseDetails, drafts, setDrafts, {
        revertArceusResearchAction: input.arceusResearch.revertAction,
        revertArceusResearchBulk: input.arceusResearch.revertBulk,
        revertDonutDraft: input.donuts.revertDonutDraft,
        revertItemsEdit: input.sections.actions.revertItemsEdit,
        revertMetDateFixerDraft: input.metDate.revertMetDateFixerDraft,
        revertMysteryGiftEdit: input.database.revertMysteryGiftEdit,
        revertPokedexAction: input.pokedex.revertPokedexAction,
        revertRaidsDraft: input.raids.actions.revert,
        revertTrainerEdit: input.sections.actions.revertTrainerEdit,
        revertUndergroundDraft: input.sections.actions.revertUndergroundDraft,
      })
      if (!change.slotId.startsWith('__'))
        setReplacementDrafts((current) => {
          if (!(change.slotId in current)) return current
          const copy = { ...current }
          delete copy[change.slotId]
          return copy
        })
    },
    [
      baseDetails,
      drafts,
      input.arceusResearch.revertAction,
      input.arceusResearch.revertBulk,
      input.database.revertMysteryGiftEdit,
      input.donuts.revertDonutDraft,
      input.metDate.revertMetDateFixerDraft,
      input.pokedex.revertPokedexAction,
      input.raids.actions.revert,
      input.sections.actions.revertItemsEdit,
      input.sections.actions.revertTrainerEdit,
      input.sections.actions.revertUndergroundDraft,
      setDrafts,
      setReplacementDrafts,
    ],
  )

  const revertAll = useCallback(() => {
    setDrafts({})
    setReplacementDrafts({})
    setDraftViolations([])
    if (input.sections.state.trainerDraft !== null)
      input.sections.actions.revertTrainerEdit()
    if (input.sections.state.itemsDraft !== null)
      input.sections.actions.revertItemsEdit()
    setMysteryGiftDrafts([])
    input.pokedex.setPokedexDrafts([])
    input.donuts.setDonutDrafts([])
    input.metDate.setMetDateFixerDraft(null)
    input.sections.actions.revertUndergroundDraft()
    input.raids.actions.revert()
    for (const draft of input.arceusResearch.arceusResearchDrafts)
      input.arceusResearch.revertAction(draft)
    for (const bulk of input.arceusResearch.arceusResearchBulkDrafts)
      input.arceusResearch.revertBulk(bulk)
  }, [
    input.arceusResearch,
    input.donuts,
    input.metDate,
    input.pokedex,
    input.raids.actions,
    input.sections.actions,
    input.sections.state.itemsDraft,
    input.sections.state.trainerDraft,
    setDrafts,
    setDraftViolations,
    setMysteryGiftDrafts,
    setReplacementDrafts,
  ])

  return { revertAll, revertChange }
}
