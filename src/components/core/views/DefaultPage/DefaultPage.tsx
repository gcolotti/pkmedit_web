import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { useDatabaseBrowser } from '../../../../core/hooks/useDatabaseBrowser/useDatabaseBrowser'
import { useWorkspace } from '../../../../core/hooks/workspaceContext/workspaceContext'
import { useUiStore } from '../../../../core/state/uiStore/uiStore'
import type { DonutPocket } from '../../../../core/types/donut/donut'
import { supportsHeldItem } from '../../../../core/utils/gameRules/gameRules'
import { AppShell } from '../../AppShell/AppShell'
import { ConnectedSavesPanel } from '../../ConnectedSavesPanel/ConnectedSavesPanel'
import { EditorPanel } from '../../EditorPanel/EditorPanel'
import { WorkspacePanel } from '../../WorkspacePanel/WorkspacePanel'

export function DefaultPage() {
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
  const [donutCreatorState, setDonutCreatorState] = useState<{
    pocket: DonutPocket
    sessionId: string | null
  } | null>(null)

  const saveGameVersion = state.summary?.gameVersion ?? 0
  const heldItemsSupported = supportsHeldItem(saveGameVersion)
  const databaseBrowser = useDatabaseBrowser({
    onSearchEncounters: actions.searchEncounters,
    onSearchMysteryGifts: actions.searchMysteryGifts,
    saveGameVersion,
    saveGeneration: state.summary?.generation ?? 0,
  })
  const donutCreatorPocket =
    donutCreatorState?.sessionId === state.summary?.sessionId &&
    donutCreatorState
      ? donutCreatorState.pocket
      : null

  return (
    <AppShell>
      <main className="mx-auto grid w-full max-w-shell items-start gap-4 p-4 xl:min-h-0 xl:grid-cols-shell xl:items-stretch xl:overflow-hidden xl:pb-5">
        <ConnectedSavesPanel />
        <WorkspacePanel
          boxIndex={state.boxIndex}
          boxes={state.boxes}
          currentBox={state.currentBox}
          databaseBrowser={databaseBrowser}
          databasePreview={state.databasePreview}
          databaseView={state.databaseView}
          donutCreatorPocket={donutCreatorPocket}
          heldItemsSupported={heldItemsSupported}
          itemCatalog={state.catalogs.items}
          party={state.party}
          selectedSlotId={state.selectedSlotId}
          t={state.t}
          view={state.view}
          onAddDonut={donuts.onAdd}
          onApplyEncounter={actions.applyEncounterPreview}
          onApplyMysteryGift={actions.applyMysteryGiftPreview}
          onBoxChange={actions.setBoxIndex}
          onClearPreview={() => actions.setDatabasePreview(null)}
          onEncounterPreview={(s, rId) => void actions.previewEncounter(s, rId)}
          onMysteryGiftPreview={(rId) => void actions.previewMysteryGift(rId)}
          onCloseDonutCreator={() => setDonutCreatorState(null)}
          onPreviewDonut={donuts.onPreview}
          onSelectSlot={(sId) => void actions.selectSlot(sId)}
          onViewChange={actions.setView}
        />
        <EditorPanel
          arceusResearchStatus={state.arceusResearchStatus}
          catalogs={state.catalogs}
          databaseBrowser={databaseBrowser}
          language={state.language}
          databaseView={state.databaseView}
          draft={state.draft}
          itemBag={items.current}
          itemStatus={items.status}
          itemCatalog={state.catalogs.items}
          languageCatalog={state.catalogs.languages}
          donutDrafts={donuts.drafts}
          sessionId={state.summary?.sessionId ?? null}
          saveView={state.saveView}
          selectedSlotId={state.selectedSlotId}
          setDraft={actions.setDraft}
          t={state.t}
          onCheck={() => actions.checkSelectedSlot()}
          onDatabaseViewChange={actions.setDatabaseView}
          onAddDonut={donuts.onAdd}
          onItemsChange={items.onChange}
          onLoadDonuts={donuts.onLoad}
          underground={{
            data: state.undergroundData,
            status: state.undergroundStatus,
            onChange: actions.updateUndergroundDraft,
            onLoad: (sId) => void actions.loadUndergroundItems(sId),
          }}
          onOpenDonutCreator={(pocket) => {
            setDonutCreatorState({
              pocket,
              sessionId: state.summary?.sessionId ?? null,
            })
            actions.setView('save')
          }}
          onOpenMovesBrowser={() => setFocusedEditor('moves')}
          onOpenTypeChart={(typeId) => {
            setTypeChartTypeId(typeId)
            setFocusedEditor('typeChart')
          }}
          onOpenRaidsEditor={() => {
            actions.setView('save')
            setFocusedEditor('raids')
          }}
          onOpenArceusResearch={() => {
            actions.setView('save')
            setFocusedEditor('arceusResearch')
          }}
          onPokedexAction={(key) => actions.applyPokedexActions(key)}
          onPreviewMetDateFixer={actions.previewMetDateFixer}
          onQueueMetDateFixerDraft={actions.queueMetDateFixerDraft}
          pokedexDrafts={state.pokedexDrafts}
          pokedexStatus={state.pokedexStatus}
          metDateFixerDraft={state.metDateFixerDraft}
          pokemonEditorTab={pokemonEditorTab}
          onSaveViewChange={actions.setSaveView}
          onCopyPokemon={actions.copyPokemon}
          onPastePokemon={actions.pastePokemon}
          onPokemonEditorTabChange={setPokemonEditorTab}
          pokemonClipboard={state.pokemonClipboard}
          saveGameVersion={saveGameVersion}
          onSpeciesChange={(sp, name) => void actions.setDraftSpecies(sp, name)}
          onFormChange={(form) => void actions.setDraftForm(form)}
          onTrainerChange={trainer.onChange}
          trainer={trainer.current}
          trainerStatus={trainer.status}
          view={state.view}
        />
      </main>
    </AppShell>
  )
}
