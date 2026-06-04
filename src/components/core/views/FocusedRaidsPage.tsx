import { useWorkspace } from '../../../core/hooks/workspaceContext'
import { useUiStore } from '../../../core/state/uiStore'
import { RaidFocusedEditorPage } from '../../raids/RaidFocusedEditorPage'
import { ConnectedSavesPanel } from '../ConnectedSavesPanel'
import { FocusedViewLayout } from './FocusedViewLayout'

export function FocusedRaidsPage() {
  const { raids, state } = useWorkspace()
  const setFocusedEditor = useUiStore((s) => s.setFocusedEditor)

  return (
    <FocusedViewLayout savesPanel={<ConnectedSavesPanel />}>
      <RaidFocusedEditorPage
        data={raids.data}
        sessionId={state.summary?.sessionId ?? null}
        status={raids.status}
        t={state.t}
        onBack={() => setFocusedEditor(null)}
        onChange={raids.onChange}
        onLoad={raids.onLoad}
      />
    </FocusedViewLayout>
  )
}
