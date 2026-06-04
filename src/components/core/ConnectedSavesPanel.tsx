import { useWorkspace } from '../../core/hooks/workspaceContext'
import { SavesPanel } from './SavesPanel'

export function ConnectedSavesPanel() {
  const { actions, state } = useWorkspace()

  return (
    <SavesPanel
      allowIllegalChanges={state.allowIllegalChanges}
      changes={state.draftChanges}
      saves={state.saves}
      selectedSave={state.selectedSave}
      summary={state.summary}
      t={state.t}
      violations={state.draftViolations}
      onAllowIllegalChangesChange={actions.setAllowIllegalChanges}
      onCheckDraft={() => void actions.checkDraft()}
      onOpenSelectedSave={() => void actions.openSelectedSave()}
      onRevertAll={actions.revertAll}
      onRevertChange={actions.revertChange}
      onSelectedSaveChange={actions.setSelectedSave}
      onUploadFile={(file) => void actions.uploadSave(file)}
      onWrite={() => void actions.writeSave()}
      onWriteZip={() => void actions.writeSaveZip()}
    />
  )
}
