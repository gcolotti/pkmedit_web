import { useShallow } from 'zustand/react/shallow'

import { useWorkspace } from '../../../core/hooks/workspaceContext'
import { useUiStore } from '../../../core/state/uiStore'
import { TypeChartFocusedEditorPage } from '../../type-chart/TypeChartFocusedEditorPage'
import { ConnectedSavesPanel } from '../ConnectedSavesPanel'
import { FocusedViewLayout } from './FocusedViewLayout'

export function FocusedTypeChartPage() {
  const { state } = useWorkspace()
  const { setFocusedEditor, setTypeChartTypeId, typeId } = useUiStore(
    useShallow((s) => ({
      setFocusedEditor: s.setFocusedEditor,
      setTypeChartTypeId: s.setTypeChartTypeId,
      typeId: s.typeChartTypeId,
    })),
  )

  if (typeId === null) return null

  return (
    <FocusedViewLayout savesPanel={<ConnectedSavesPanel />}>
      <TypeChartFocusedEditorPage
        t={state.t}
        typeId={typeId}
        onBack={() => {
          setFocusedEditor(null)
          setTypeChartTypeId(null)
        }}
      />
    </FocusedViewLayout>
  )
}
