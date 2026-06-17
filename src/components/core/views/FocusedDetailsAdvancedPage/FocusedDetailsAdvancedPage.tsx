import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { useWorkspace } from '../../../../core/hooks/workspaceContext/workspaceContext'
import { useUiStore } from '../../../../core/state/uiStore/uiStore'
import { DetailsAdvanced } from '../../../pokemon/details/DetailsAdvanced/DetailsAdvanced'
import { ConnectedSavesPanel } from '../../ConnectedSavesPanel/ConnectedSavesPanel'
import { FocusedViewLayout } from '../FocusedViewLayout/FocusedViewLayout'

export function FocusedDetailsAdvancedPage() {
  const { actions, state } = useWorkspace()
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
      <DetailsAdvanced
        cosmetic={draft.cosmetic}
        main={draft.main}
        t={state.t}
        trainer={draft.trainer}
        onBack={() => {
          setPokemonEditorTab('details')
          setFocusedEditor(null)
        }}
        onCosmeticChange={(cosmetic) =>
          actions.setDraft((current) => {
            if (!current) return current
            const copy = structuredClone(current)
            copy.cosmetic = cosmetic
            return copy
          })
        }
        onTrainerChange={(trainer) =>
          actions.setDraft((current) => {
            if (!current) return current
            const copy = structuredClone(current)
            copy.trainer = trainer
            return copy
          })
        }
      />
    </FocusedViewLayout>
  )
}
