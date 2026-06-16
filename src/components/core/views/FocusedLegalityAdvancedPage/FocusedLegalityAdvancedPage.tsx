import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { useWorkspace } from '../../../../core/hooks/workspaceContext/workspaceContext'
import {
  buildPokemonLegalityInputKey,
  buildPokemonPayload,
} from '../../../../core/services/pokemonPayload/pokemonPayload'
import { useUiStore } from '../../../../core/state/uiStore/uiStore'
import type { LegalityFixesResponse } from '../../../../core/types/index/index'
import { LegalityAdvanced } from '../../../pokemon/legality/LegalityAdvanced/LegalityAdvanced'
import { ConnectedSavesPanel } from '../../ConnectedSavesPanel/ConnectedSavesPanel'
import { FocusedViewLayout } from '../FocusedViewLayout/FocusedViewLayout'

const toErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error)

export function FocusedLegalityAdvancedPage() {
  const { actions, api, state } = useWorkspace()
  const queryClient = useQueryClient()
  const [applyingFixId, setApplyingFixId] = useState<string | null>(null)
  const [applyingAll, setApplyingAll] = useState(false)
  const { setFocusedEditor, setPokemonEditorTab } = useUiStore(
    useShallow((s) => ({
      setFocusedEditor: s.setFocusedEditor,
      setPokemonEditorTab: s.setPokemonEditorTab,
    })),
  )
  const draft = state.draft
  const legality = state.selectedLegality?.report ?? draft?.legality ?? null
  const sessionId = state.summary?.sessionId ?? null
  const selectedSlotId = state.selectedSlotId
  const fixesQueryKey = [
    'pokemon-legality-fixes',
    sessionId,
    selectedSlotId,
    state.legalityInputKey,
  ] as const
  const fixesQuery = useQuery({
    enabled: Boolean(
      draft && legality && sessionId && selectedSlotId && !legality.legal,
    ),
    queryKey: fixesQueryKey,
    queryFn: () =>
      api.pokemon.getLegalityFixes(
        sessionId!,
        selectedSlotId!,
        buildPokemonPayload(draft!),
      ),
  })

  useEffect(() => {
    if (!draft) setFocusedEditor(null)
  }, [draft, setFocusedEditor])

  if (!draft) return null
  if (!legality) return null

  async function applyFixes(fixIds: string[]) {
    if (!draft || !sessionId || !selectedSlotId) return
    try {
      const response = await api.pokemon.applyLegalityFixes(
        sessionId,
        selectedSlotId,
        {
          fixIds,
          pokemon: buildPokemonPayload(draft),
        },
      )
      actions.setDraft(response.draft)
      actions.updateSelectedLegality(response.draft)
      // setDraft changes legalityInputKey, so the live query will read a new key. Seed that
      // key with the fixes the apply call already returned, instead of writing to the stale
      // key and forcing a redundant getLegalityFixes refetch.
      queryClient.setQueryData<LegalityFixesResponse>(
        [
          'pokemon-legality-fixes',
          sessionId,
          selectedSlotId,
          buildPokemonLegalityInputKey(response.draft),
        ],
        { fixes: response.fixes },
      )
      actions.setToast(state.t('applyFixSuccess'))
    } catch (error) {
      actions.setToast(toErrorMessage(error))
    }
  }

  async function applyFix(fixId: string) {
    setApplyingFixId(fixId)
    try {
      await applyFixes([fixId])
    } finally {
      setApplyingFixId(null)
    }
  }

  async function applyAllSafeFixes(fixIds: string[]) {
    setApplyingAll(true)
    try {
      await applyFixes(fixIds)
    } finally {
      setApplyingAll(false)
    }
  }

  const fixes = legality.legal ? [] : (fixesQuery.data?.fixes ?? [])
  const fixesError = fixesQuery.error ? toErrorMessage(fixesQuery.error) : null
  const safeFixIds = fixes
    .filter((fix) => fix.safety === 'safe')
    .map((fix) => fix.id)

  return (
    <FocusedViewLayout savesPanel={<ConnectedSavesPanel />}>
      <LegalityAdvanced
        applyingAll={applyingAll}
        applyingFixId={applyingFixId}
        fixes={fixes}
        fixesError={fixesError}
        fixesLoading={fixesQuery.isFetching}
        legality={legality}
        t={state.t}
        onApplyAllSafeFixes={() => void applyAllSafeFixes(safeFixIds)}
        onApplyFix={(fixId) => void applyFix(fixId)}
        onBack={() => {
          setPokemonEditorTab('legality')
          setFocusedEditor(null)
        }}
      />
    </FocusedViewLayout>
  )
}
