import type { Translator } from '../i18n/i18n'
import type { ApiClient } from '../services/api'
import { buildSaveWorkspaceResult } from './saveWorkspaceResult'
import { useArceusResearchDrafts } from './useArceusResearchDrafts'
import { useCopyPaste } from './useCopyPaste'
import { useDonutDrafts } from './useDonutDrafts'
import { useMetDateFixer } from './useMetDateFixer'
import { usePokedexDrafts } from './usePokedexDrafts'
import { usePokedexStatus } from './usePokedexStatus'
import { usePokemonSelection } from './usePokemonSelection'
import { useSaveWorkspaceDatabases } from './useSaveWorkspaceDatabases'
import { useSaveWorkspaceRaids } from './useSaveWorkspaceRaids'
import { useSectionDrafts } from './useSectionDrafts'
import { useWorkspaceCommands } from './useWorkspaceCommands'
import { useWorkspaceDerived } from './useWorkspaceDerived'
import { useWorkspaceSession } from './useWorkspaceSession'
import {
  useDraftWorkspaceSlices,
  useUiWorkspaceSlices,
} from './useWorkspaceStoreSlices'

export function useSaveWorkspace(
  api: ApiClient,
  t: Translator,
  allowIllegalChanges: boolean,
  refreshSaves: () => Promise<void>,
) {
  const draftStore = useDraftWorkspaceSlices()
  const ui = useUiWorkspaceSlices()

  const session = useWorkspaceSession({
    api,
    refreshSaves,
    resetDrafts: draftStore.resetDrafts,
    setSelectedSlotId: ui.setSelectedSlotId,
    showToast: ui.showToast,
    t,
  })
  const { summary } = session
  const sessionId = summary?.sessionId

  const sections = useSectionDrafts(api, sessionId, t)
  const raids = useSaveWorkspaceRaids(api, sessionId)
  const database = useSaveWorkspaceDatabases({
    api,
    baseDetails: draftStore.baseDetails,
    setBaseDetails: draftStore.setBaseDetails,
    setDrafts: draftStore.setDrafts,
    setDraftViolations: draftStore.setDraftViolations,
    setSelectedSlotId: ui.setSelectedSlotId,
    setToast: ui.showToast,
    summary,
    t,
  })
  const pokedex = usePokedexDrafts()
  usePokedexStatus(api, sessionId ?? null, ui.saveView)
  const arceusResearch = useArceusResearchDrafts(
    api,
    sessionId ?? null,
    ui.saveView,
    sections.state.trainerBase?.saveKind ?? null,
  )
  const donuts = useDonutDrafts(api, sessionId)
  const metDate = useMetDateFixer(api, sessionId)
  const selection = usePokemonSelection(
    api,
    summary,
    ui.selectedSlotId,
    ui.setSelectedSlotId,
    ui.showToast,
  )
  const clipboard = useCopyPaste(ui.selectedSlotId)
  const { mysteryGiftDrafts, replacementDrafts } = database.state

  const derived = useWorkspaceDerived({
    arceusResearchBulkDrafts: arceusResearch.arceusResearchBulkDrafts,
    arceusResearchDrafts: arceusResearch.arceusResearchDrafts,
    arceusResearchStatus: arceusResearch.arceusResearchStatus,
    baseDetails: draftStore.baseDetails,
    boxes: session.boxesQuery.data?.boxes,
    donuts: donuts.donutDrafts,
    drafts: draftStore.drafts,
    itemsDraft: sections.state.itemsDraft,
    metDateFixerDraft: metDate.metDateFixerDraft,
    mysteryGiftDrafts,
    party: session.partyQuery.data?.slots,
    pokedexDrafts: pokedex.pokedexDrafts,
    pokedexStatus: draftStore.pokedexStatus,
    raidsDraft: raids.state.draft,
    replacementDrafts,
    selectedSlotId: ui.selectedSlotId,
    t,
    trainerDraft: sections.state.trainerDraft,
    undergroundDraft: sections.state.undergroundDraft,
  })

  const commands = useWorkspaceCommands({
    api,
    allowIllegalChanges,
    arceusResearch,
    database,
    donuts,
    draftStore,
    derived,
    metDate,
    pokedex,
    raids,
    sections,
    session,
    t,
    ui,
  })

  return buildSaveWorkspaceResult({
    arceusResearch,
    clipboard,
    commands,
    database,
    donuts,
    draftStore,
    derived,
    metDate,
    pokedex,
    raids,
    sections,
    selection,
    session,
    ui,
  })
}
