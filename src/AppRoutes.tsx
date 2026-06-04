import { useShallow } from 'zustand/react/shallow'

import { DefaultPage } from './components/core/views/DefaultPage'
import { FocusedArceusResearchPage } from './components/core/views/FocusedArceusResearchPage'
import { FocusedMovesPage } from './components/core/views/FocusedMovesPage'
import { FocusedRaidsPage } from './components/core/views/FocusedRaidsPage'
import { FocusedTypeChartPage } from './components/core/views/FocusedTypeChartPage'
import { useUiStore } from './core/state/uiStore'

export function AppRoutes() {
  const { focusedEditor, typeChartTypeId } = useUiStore(
    useShallow((s) => ({
      focusedEditor: s.focusedEditor,
      typeChartTypeId: s.typeChartTypeId,
    })),
  )

  if (focusedEditor === 'raids') return <FocusedRaidsPage />
  if (focusedEditor === 'typeChart' && typeChartTypeId !== null)
    return <FocusedTypeChartPage />
  if (focusedEditor === 'moves') return <FocusedMovesPage />
  if (focusedEditor === 'arceusResearch') return <FocusedArceusResearchPage />
  return <DefaultPage />
}
