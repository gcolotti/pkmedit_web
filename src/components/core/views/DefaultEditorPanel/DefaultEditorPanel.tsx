import type { Dispatch, SetStateAction } from 'react'
import { useShallow } from 'zustand/react/shallow'

import type { DatabaseBrowserState } from '../../../../core/hooks/useDatabaseBrowser/useDatabaseBrowser'
import { useWorkspace } from '../../../../core/hooks/workspaceContext/workspaceContext'
import { useUiStore } from '../../../../core/state/uiStore/uiStore'
import type { DonutPocket } from '../../../../core/types/donut/donut'
import { EditorPanel } from '../../EditorPanel/EditorPanel'

export type DonutCreatorState = {
  pocket: DonutPocket
  sessionId: string | null
} | null

export function DefaultEditorPanel({
  databaseBrowser,
  saveGameVersion,
  setDonutCreatorState,
}: {
  databaseBrowser: DatabaseBrowserState
  saveGameVersion: number
  setDonutCreatorState: Dispatch<SetStateAction<DonutCreatorState>>
}) {
  const { actions, donuts, items, state, trainer } = useWorkspace()
  const {
    pokemonEditorTab,
    setFocusedEditor,
    setPokemonEditorTab,
    setTypeChartTypeId,
  } = useUiStore(
    useShallow((s) => ({
      pokemonEditorTab: s.pokemonEditorTab,
      setFocusedEditor: s.setFocusedEditor,
      setPokemonEditorTab: s.setPokemonEditorTab,
      setTypeChartTypeId: s.setTypeChartTypeId,
    })),
  )

  return (
    <EditorPanel
      arceusResearchStatus={state.arceusResearchStatus}
      catalogs={state.catalogs}
      databaseBrowser={databaseBrowser}
      databaseView={state.databaseView}
      donutDrafts={donuts.drafts}
      draft={state.draft}
      itemBag={items.current}
      itemCatalog={state.catalogs.items}
      itemStatus={items.status}
      language={state.language}
      languageCatalog={state.catalogs.languages}
      metDateFixerDraft={state.metDateFixerDraft}
      pokedexDrafts={state.pokedexDrafts}
      pokedexStatus={state.pokedexStatus}
      pokemonClipboard={state.pokemonClipboard}
      pokemonEditorTab={pokemonEditorTab}
      saveGameVersion={saveGameVersion}
      saveTrainer={trainer.current}
      saveView={state.saveView}
      selectedLegality={state.selectedLegality}
      selectedSlotId={state.selectedSlotId}
      sessionId={state.summary?.sessionId ?? null}
      setDraft={actions.setDraft}
      t={state.t}
      trainer={trainer.current}
      trainerStatus={trainer.status}
      underground={{
        data: state.undergroundData,
        status: state.undergroundStatus,
        onChange: actions.updateUndergroundDraft,
        onLoad: (sId) => void actions.loadUndergroundItems(sId),
      }}
      view={state.view}
      onAddDonut={donuts.onAdd}
      onCheck={() => actions.checkSelectedSlot()}
      onCopyPokemon={actions.copyPokemon}
      onDatabaseViewChange={actions.setDatabaseView}
      onFormChange={(form) => void actions.setDraftForm(form)}
      onItemsChange={items.onChange}
      onLegalityGenerated={actions.updateSelectedLegality}
      onLoadDonuts={donuts.onLoad}
      onOpenArceusResearch={() => {
        actions.setView('save')
        setFocusedEditor('arceusResearch')
      }}
      onOpenDetailsAdvanced={() => setFocusedEditor('detailsAdvanced')}
      onOpenDonutCreator={(pocket) => {
        setDonutCreatorState({
          pocket,
          sessionId: state.summary?.sessionId ?? null,
        })
        actions.setView('save')
      }}
      onOpenLegalityAdvanced={() => setFocusedEditor('legalityAdvanced')}
      onOpenMovesBrowser={() => setFocusedEditor('moves')}
      onOpenRaidsEditor={() => {
        actions.setView('save')
        setFocusedEditor('raids')
      }}
      onOpenTypeChart={(typeId) => {
        setTypeChartTypeId(typeId)
        setFocusedEditor('typeChart')
      }}
      onPastePokemon={actions.pastePokemon}
      onPokedexAction={(key) => actions.applyPokedexActions(key)}
      onPokemonEditorTabChange={setPokemonEditorTab}
      onPreviewMetDateFixer={actions.previewMetDateFixer}
      onQueueMetDateFixerDraft={actions.queueMetDateFixerDraft}
      onSaveViewChange={actions.setSaveView}
      onSpeciesChange={(sp, name) => void actions.setDraftSpecies(sp, name)}
      onTrainerChange={trainer.onChange}
    />
  )
}
