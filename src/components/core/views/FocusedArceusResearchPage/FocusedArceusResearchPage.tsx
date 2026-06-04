import { useWorkspace } from '../../../../core/hooks/workspaceContext/workspaceContext'
import { useUiStore } from '../../../../core/state/uiStore/uiStore'
import { ArceusResearchFocusedEditorPage } from '../../../pokemon/pokedex/arceus-research/ArceusResearchFocusedEditorPage/ArceusResearchFocusedEditorPage'
import { ConnectedSavesPanel } from '../../ConnectedSavesPanel/ConnectedSavesPanel'
import { FocusedViewLayout } from '../FocusedViewLayout/FocusedViewLayout'

export function FocusedArceusResearchPage() {
  const { actions, api, state } = useWorkspace()
  const setFocusedEditor = useUiStore((s) => s.setFocusedEditor)

  return (
    <FocusedViewLayout savesPanel={<ConnectedSavesPanel />}>
      <ArceusResearchFocusedEditorPage
        api={api}
        bulkDrafts={state.arceusResearchBulkDrafts}
        drafts={state.arceusResearchDrafts}
        language={state.language}
        sessionId={state.summary?.sessionId ?? null}
        status={state.arceusResearchStatus}
        t={state.t}
        onApplyAction={actions.applyArceusResearchAction}
        onBack={() => setFocusedEditor(null)}
        onToggleBulk={actions.toggleArceusResearchBulk}
      />
    </FocusedViewLayout>
  )
}
