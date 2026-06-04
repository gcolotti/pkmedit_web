import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { useWorkspace } from '../../../../core/hooks/workspaceContext/workspaceContext'
import { useUiStore } from '../../../../core/state/uiStore/uiStore'
import { restrictMovesToLegal } from '../../../../core/utils/gameRules/gameRules'
import { MoveFocusedEditorPage } from '../../../pokemon-detail/MoveFocusedEditorPage/MoveFocusedEditorPage'
import { ConnectedSavesPanel } from '../../ConnectedSavesPanel/ConnectedSavesPanel'
import { FocusedViewLayout } from '../FocusedViewLayout/FocusedViewLayout'

export function FocusedMovesPage() {
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
      <MoveFocusedEditorPage
        language={state.language}
        legalMoveIds={draft.contextCatalogs.legalMoves}
        legalOnly={restrictMovesToLegal(state.summary?.gameVersion ?? 0)}
        moveBasePp={draft.contextCatalogs.moveBasePp ?? []}
        moveCatalog={state.catalogs.moves}
        moves={draft.moves}
        plusMoves={draft.plusMoves}
        pokemonName={draft.summary.speciesName}
        t={state.t}
        onBack={() => {
          setPokemonEditorTab('moves')
          setFocusedEditor(null)
        }}
        onMovesChange={(moves) =>
          actions.setDraft((current) => {
            if (!current) return current
            const copy = structuredClone(current)
            copy.moves = moves
            return copy
          })
        }
        onPlusMovesChange={(plusMoves) =>
          actions.setDraft((current) => {
            if (!current) return current
            const copy = structuredClone(current)
            copy.plusMoves = plusMoves
            return copy
          })
        }
      />
    </FocusedViewLayout>
  )
}
