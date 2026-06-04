import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import type { Translator } from '../../i18n/i18n/i18n'
import { mapQueryToSectionStatus } from '../../query/sectionStatus/sectionStatus'
import { useItemsBase } from '../../query/useItemsBase/useItemsBase'
import { useTrainerBase } from '../../query/useTrainerBase/useTrainerBase'
import { useUndergroundBase } from '../../query/useUndergroundBase/useUndergroundBase'
import type { ApiClient } from '../../services/api/api'
import { isSameDraft } from '../../services/draftPayloads/draftPayloads'
import { useDraftStore } from '../../state/draftStore/draftStore'
import type { ItemBag } from '../../types/index/index'
import type { UndergroundItemsResponse } from '../../types/saveFeature/saveFeature'
import type { TrainerInfo } from '../../types/trainer/trainer'

type SectionDraftState = {
  forSessionId: string | undefined
  undergroundEnabled: boolean
}

const SECTIONS_RESET: SectionDraftState = {
  forSessionId: undefined,
  undergroundEnabled: false,
}

export function useSectionDrafts(
  api: ApiClient,
  sessionId: string | undefined,
  t: Translator,
) {
  const trainerQuery = useTrainerBase(api, sessionId)
  const itemsQuery = useItemsBase(api, sessionId)
  const [draftState, setDraftState] =
    useState<SectionDraftState>(SECTIONS_RESET)
  const {
    itemsDraft,
    setItemsDraft,
    setTrainerDraft,
    setUndergroundDraft,
    trainerDraft,
    undergroundDraft,
  } = useDraftStore(
    useShallow((s) => ({
      itemsDraft: s.itemsDraft,
      setItemsDraft: s.setItemsDraft,
      setTrainerDraft: s.setTrainerDraft,
      setUndergroundDraft: s.setUndergroundDraft,
      trainerDraft: s.trainerDraft,
      undergroundDraft: s.undergroundDraft,
    })),
  )

  // If sessionId changed since last update, use empty state
  const effective =
    draftState.forSessionId === sessionId ? draftState : SECTIONS_RESET
  const hasCurrentDrafts =
    sessionId !== undefined && effective.forSessionId === sessionId

  const undergroundQuery = useUndergroundBase(
    api,
    sessionId,
    effective.undergroundEnabled,
  )

  const trainerBase = trainerQuery.data ?? null
  const trainerStatus = mapQueryToSectionStatus(trainerQuery)
  const itemsBase = itemsQuery.data ?? null
  const itemsStatus = mapQueryToSectionStatus(itemsQuery)
  const undergroundBase = undergroundQuery.data ?? null
  const undergroundStatus = undergroundQuery.isFetching
    ? t('saveSectionLoading')
    : undergroundQuery.isError
      ? t('saveFeatureUnavailable')
      : ''

  function updateTrainerDraft(trainer: TrainerInfo) {
    setDraftState((s) => ({ ...s, forSessionId: sessionId }))
    setTrainerDraft(isSameDraft(trainerBase, trainer) ? null : trainer)
  }

  function revertTrainerEdit() {
    setDraftState((s) => ({ ...s, forSessionId: sessionId }))
    setTrainerDraft(null)
  }

  function updateItemsDraft(bag: ItemBag) {
    setDraftState((s) => ({ ...s, forSessionId: sessionId }))
    setItemsDraft(isSameDraft(itemsBase, bag) ? null : bag)
  }

  function revertItemsEdit() {
    setDraftState((s) => ({ ...s, forSessionId: sessionId }))
    setItemsDraft(null)
  }

  function loadUndergroundItems(_sessionId?: string) {
    setDraftState((s) => ({
      ...s,
      forSessionId: sessionId,
      undergroundEnabled: true,
    }))
  }

  function updateUndergroundDraft(data: UndergroundItemsResponse) {
    setDraftState((s) => ({ ...s, forSessionId: sessionId }))
    setUndergroundDraft(isSameDraft(undergroundBase, data) ? null : data)
  }

  function revertUndergroundDraft() {
    setDraftState((s) => ({ ...s, forSessionId: sessionId }))
    setUndergroundDraft(null)
  }

  return {
    state: {
      trainerBase,
      trainerDraft: hasCurrentDrafts ? trainerDraft : null,
      itemsBase,
      itemsDraft: hasCurrentDrafts ? itemsDraft : null,
      undergroundBase,
      undergroundDraft: hasCurrentDrafts ? undergroundDraft : null,
      undergroundStatus,
      trainerStatus,
      itemsStatus,
    },
    actions: {
      updateTrainerDraft,
      revertTrainerEdit,
      updateItemsDraft,
      revertItemsEdit,
      loadUndergroundItems,
      updateUndergroundDraft,
      revertUndergroundDraft,
    },
  }
}
