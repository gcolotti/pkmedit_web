import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { useWorkspace } from '../../../../core/hooks/workspaceContext/workspaceContext'
import { useUiStore } from '../../../../core/state/uiStore/uiStore'
import { LegalityAdvanced } from '../../../pokemon/legality/LegalityAdvanced/LegalityAdvanced'
import { ConnectedSavesPanel } from '../../ConnectedSavesPanel/ConnectedSavesPanel'
import { FocusedViewLayout } from '../FocusedViewLayout/FocusedViewLayout'

export function FocusedLegalityAdvancedPage() {
  const { state } = useWorkspace()
  const { setFocusedEditor, setPokemonEditorTab } = useUiStore(
    useShallow((s) => ({
      setFocusedEditor: s.setFocusedEditor,
      setPokemonEditorTab: s.setPokemonEditorTab,
    })),
  )
  const draft = state.draft

  useEffect(() => {
    if (!draft) setFocusedEditor(null)
  }, [draft, setFocusedEditor])

  if (!draft) return null

  return (
    <FocusedViewLayout savesPanel={<ConnectedSavesPanel />}>
      <LegalityAdvanced
        draft={draft}
        t={state.t}
        onBack={() => {
          setPokemonEditorTab('legality')
          setFocusedEditor(null)
        }}
      />
    </FocusedViewLayout>
  )
}
