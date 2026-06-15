import type { useArceusResearchDrafts } from '../useArceusResearchDrafts/useArceusResearchDrafts'
import type { useCopyPaste } from '../useCopyPaste/useCopyPaste'
import type { useDonutDrafts } from '../useDonutDrafts/useDonutDrafts'
import type { useMetDateFixer } from '../useMetDateFixer/useMetDateFixer'
import type { usePokedexDrafts } from '../usePokedexDrafts/usePokedexDrafts'
import type { usePokemonSelection } from '../usePokemonSelection/usePokemonSelection'
import type { useSaveWorkspaceDatabases } from '../useSaveWorkspaceDatabases/useSaveWorkspaceDatabases'
import type { useSaveWorkspaceRaids } from '../useSaveWorkspaceRaids/useSaveWorkspaceRaids'
import type { useSectionDrafts } from '../useSectionDrafts/useSectionDrafts'
import type { useWorkspaceCommands } from '../useWorkspaceCommands/useWorkspaceCommands'
import type { useWorkspaceDerived } from '../useWorkspaceDerived/useWorkspaceDerived'
import type { useWorkspaceSession } from '../useWorkspaceSession/useWorkspaceSession'
import type {
  useDraftWorkspaceSlices,
  useUiWorkspaceSlices,
} from '../useWorkspaceStoreSlices/useWorkspaceStoreSlices'

type SaveWorkspaceResultInput = {
  arceusResearch: ReturnType<typeof useArceusResearchDrafts>
  clipboard: ReturnType<typeof useCopyPaste>
  commands: ReturnType<typeof useWorkspaceCommands>
  database: ReturnType<typeof useSaveWorkspaceDatabases>
  donuts: ReturnType<typeof useDonutDrafts>
  draftStore: ReturnType<typeof useDraftWorkspaceSlices>
  derived: ReturnType<typeof useWorkspaceDerived>
  metDate: ReturnType<typeof useMetDateFixer>
  pokedex: ReturnType<typeof usePokedexDrafts>
  raids: ReturnType<typeof useSaveWorkspaceRaids>
  sections: ReturnType<typeof useSectionDrafts>
  selection: ReturnType<typeof usePokemonSelection>
  session: ReturnType<typeof useWorkspaceSession>
  ui: ReturnType<typeof useUiWorkspaceSlices>
}

export function buildSaveWorkspaceResult(input: SaveWorkspaceResultInput) {
  const { databasePreview, mysteryGiftDrafts } = input.database.state
  const summary = input.session.summary

  return {
    actions: {
      addDonutDraft: input.donuts.addDonutDraft,
      applyArceusResearchAction: input.arceusResearch.applyAction,
      applyEncounterPreview: input.database.actions.applyEncounterPreview,
      applyMysteryGiftPreview: input.database.actions.applyMysteryGiftPreview,
      applyPokedexActions: input.pokedex.applyPokedexActions,
      revertArceusResearchAction: input.arceusResearch.revertAction,
      revertArceusResearchBulk: input.arceusResearch.revertBulk,
      setPokedexStatus: input.draftStore.setPokedexStatus,
      toggleArceusResearchBulk: input.arceusResearch.toggleBulk,
      checkDraft: input.commands.checkDraft,
      copyPokemon: input.clipboard.copyPokemon,
      getDonuts: input.donuts.getDonuts,
      loadRaids: input.raids.actions.load,
      loadUndergroundItems: input.sections.actions.loadUndergroundItems,
      openSelectedSave: input.session.openSelectedSave,
      pastePokemon: input.clipboard.pastePokemon,
      previewDonut: input.donuts.previewDonut,
      previewEncounter: input.database.actions.previewEncounter,
      previewMetDateFixer: input.metDate.previewMetDateFixer,
      previewMysteryGift: input.database.actions.previewMysteryGift,
      queueMetDateFixerDraft: input.metDate.queueMetDateFixerDraft,
      recheckSelectedLegality: input.selection.recheckSelectedLegality,
      restoreLastLocalSave: input.session.restoreLastLocalSave,
      revertAll: input.commands.revertAll,
      revertChange: input.commands.revertChange,
      searchEncounters: input.database.actions.searchEncounters,
      searchMysteryGifts: input.database.actions.searchMysteryGifts,
      selectSlot: input.selection.selectSlot,
      setBoxIndex: input.ui.setBoxIndex,
      setDatabasePreview: input.database.setters.setDatabasePreview,
      setDatabaseView: input.commands.changeDatabaseView,
      setDraft: input.selection.setDraft,
      setDraftForm: input.selection.changeDraftForm,
      setDraftSpecies: input.selection.changeDraftSpecies,
      setSaveView: input.ui.setSaveView,
      setToast: input.ui.showToast,
      setView: input.commands.changeView,
      uploadSave: input.session.uploadSave,
      updateItemsDraft: input.sections.actions.updateItemsDraft,
      updateRaidsDraft: input.raids.actions.update,
      updateTrainerDraft: input.sections.actions.updateTrainerDraft,
      updateUndergroundDraft: input.sections.actions.updateUndergroundDraft,
      writeSave: input.commands.writeWorkspaceSave,
      writeSaveZip: input.commands.writeWorkspaceSaveZip,
    },
    state: {
      arceusResearchBulkDrafts: input.arceusResearch.arceusResearchBulkDrafts,
      arceusResearchDrafts: input.arceusResearch.arceusResearchDrafts,
      arceusResearchStatus: input.arceusResearch.arceusResearchStatus,
      boxes: input.derived.patchedBoxes,
      boxIndex: input.ui.boxIndex,
      currentBox: input.derived.patchedBoxes[input.ui.boxIndex],
      databasePreview,
      databaseView: input.ui.databaseView,
      dirty: input.derived.dirty,
      donutDrafts: input.donuts.donutDrafts,
      draft: input.derived.draft,
      draftChanges: input.derived.draftChanges,
      draftViolations: input.draftStore.draftViolations,
      itemsBase: input.sections.state.itemsBase,
      itemsDraft: input.sections.state.itemsDraft,
      itemsStatus: input.sections.state.itemsStatus,
      legalityReports: input.session.legalityReports,
      metDateFixerDraft: input.metDate.metDateFixerDraft,
      mysteryGiftDrafts,
      party: input.derived.patchedParty,
      pokedexDrafts: input.pokedex.pokedexDrafts,
      pokedexStatus: input.draftStore.pokedexStatus,
      pokemonClipboard: input.clipboard.pokemonClipboard,
      raidsData: input.raids.state.current,
      raidsStatus: input.raids.state.status,
      saveView: input.ui.saveView,
      selectedSlotId: input.ui.selectedSlotId,
      summary: summary
        ? { ...summary, edited: summary.edited || input.derived.dirty }
        : null,
      toast: input.ui.toast,
      trainerBase: input.sections.state.trainerBase,
      trainerDraft: input.sections.state.trainerDraft,
      trainerStatus: input.sections.state.trainerStatus,
      undergroundData:
        input.sections.state.undergroundDraft ??
        input.sections.state.undergroundBase,
      undergroundStatus: input.sections.state.undergroundStatus,
      view: input.ui.view,
    },
  }
}
