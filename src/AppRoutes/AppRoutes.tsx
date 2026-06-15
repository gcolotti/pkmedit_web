import { useShallow } from 'zustand/react/shallow'

import { DefaultPage } from '../components/core/views/DefaultPage/DefaultPage'
import { FocusedArceusResearchPage } from '../components/core/views/FocusedArceusResearchPage/FocusedArceusResearchPage'
import { FocusedDetailsAdvancedPage } from '../components/core/views/FocusedDetailsAdvancedPage/FocusedDetailsAdvancedPage'
import { FocusedLegalityAdvancedPage } from '../components/core/views/FocusedLegalityAdvancedPage/FocusedLegalityAdvancedPage'
import { FocusedMovesPage } from '../components/core/views/FocusedMovesPage/FocusedMovesPage'
import { FocusedRaidsPage } from '../components/core/views/FocusedRaidsPage/FocusedRaidsPage'
import { FocusedTypeChartPage } from '../components/core/views/FocusedTypeChartPage/FocusedTypeChartPage'
import { useUiStore } from '../core/state/uiStore/uiStore'

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
  if (focusedEditor === 'detailsAdvanced') return <FocusedDetailsAdvancedPage />
  if (focusedEditor === 'legalityAdvanced')
    return <FocusedLegalityAdvancedPage />
  return <DefaultPage />
}
