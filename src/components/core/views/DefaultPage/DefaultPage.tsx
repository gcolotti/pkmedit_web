import { useState } from 'react'

import { useDatabaseBrowser } from '../../../../core/hooks/useDatabaseBrowser/useDatabaseBrowser'
import { useLiveLegalityRecheck } from '../../../../core/hooks/useLiveLegalityRecheck/useLiveLegalityRecheck'
import { useWorkspace } from '../../../../core/hooks/workspaceContext/workspaceContext'
import { supportsHeldItem } from '../../../../core/utils/gameRules/gameRules'
import { AppShell } from '../../AppShell/AppShell'
import { ConnectedSavesPanel } from '../../ConnectedSavesPanel/ConnectedSavesPanel'
import { WorkspacePanel } from '../../WorkspacePanel/WorkspacePanel'
import {
  DefaultEditorPanel,
  type DonutCreatorState,
} from '../DefaultEditorPanel/DefaultEditorPanel'

export function DefaultPage() {
  const { actions, donuts, state } = useWorkspace()
  const [donutCreatorState, setDonutCreatorState] =
    useState<DonutCreatorState>(null)
  useLiveLegalityRecheck(
    state.legalityInputKey,
    actions.recheckSelectedLegality,
  )
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
        <DefaultEditorPanel
          databaseBrowser={databaseBrowser}
          saveGameVersion={saveGameVersion}
          setDonutCreatorState={setDonutCreatorState}
        />
      </main>
    </AppShell>
  )
}
