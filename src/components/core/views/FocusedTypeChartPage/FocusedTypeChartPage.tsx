import { useShallow } from 'zustand/react/shallow'

import { useWorkspace } from '../../../../core/hooks/workspaceContext/workspaceContext'
import { useUiStore } from '../../../../core/state/uiStore/uiStore'
import { TypeChartFocusedEditorPage } from '../../../type-chart/TypeChartFocusedEditorPage/TypeChartFocusedEditorPage'
import { ConnectedSavesPanel } from '../../ConnectedSavesPanel/ConnectedSavesPanel'
import { FocusedViewLayout } from '../FocusedViewLayout/FocusedViewLayout'

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
