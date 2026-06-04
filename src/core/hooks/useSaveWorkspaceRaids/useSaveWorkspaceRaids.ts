import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { useRaidsBase } from '../../query/useRaidsBase/useRaidsBase'
import type { ApiClient } from '../../services/api/api'
import { isSameDraft } from '../../services/draftPayloads/draftPayloads'
import { useDraftStore } from '../../state/draftStore/draftStore'
import type { RaidListResponse } from '../../types/saveFeature/saveFeature'

type RaidsState = {
  forSessionId: string | undefined
  enabled: boolean
}

const RAIDS_RESET: RaidsState = {
  forSessionId: undefined,
  enabled: false,
}

export function useSaveWorkspaceRaids(
  api: ApiClient,
  sessionId: string | undefined,
) {
  const [raidsState, setRaidsState] = useState<RaidsState>(RAIDS_RESET)
  const { raidsDraft, setRaidsDraft } = useDraftStore(
    useShallow((s) => ({
      raidsDraft: s.raidsDraft,
      setRaidsDraft: s.setRaidsDraft,
    })),
  )

  // If sessionId changed since last update, use empty state
  const effective =
    raidsState.forSessionId === sessionId ? raidsState : RAIDS_RESET
  const hasCurrentDraft =
    sessionId !== undefined && effective.forSessionId === sessionId

  const raidsQuery = useRaidsBase(api, sessionId, effective.enabled)
  const base = raidsQuery.data ?? null

  function load(_sessionId?: string) {
    setRaidsState((s) => ({
      ...s,
      forSessionId: sessionId,
      enabled: true,
    }))
  }

  function update(next: RaidListResponse) {
    setRaidsState((s) => ({ ...s, forSessionId: sessionId }))
    setRaidsDraft(isSameDraft(base, next) ? null : next)
  }

  function revert() {
    setRaidsState((s) => ({ ...s, forSessionId: sessionId }))
    setRaidsDraft(null)
  }

  function reset() {
    setRaidsState(RAIDS_RESET)
    setRaidsDraft(null)
  }

  const status = raidsQuery.isFetching
    ? 'loading'
    : raidsQuery.isError
      ? 'error'
      : ''

  return {
    actions: { load, reset, revert, update },
    state: {
      base,
      current: (hasCurrentDraft ? raidsDraft : null) ?? base,
      draft: hasCurrentDraft ? raidsDraft : null,
      status,
    },
  }
}
