import { useEffect, useMemo, useState } from 'react'

import type { I18nKey, Translator } from '../../../core/i18n/i18n/i18n'
import type { RaidSelection } from '../../../core/types/raid/raid'
import type {
  RaidEntry,
  RaidListResponse,
  SevenStarRaidEntry,
} from '../../../core/types/saveFeature/saveFeature'
import type { RaidFilter, RaidHelpTopic } from '../../../core/utils/raidDisplay/raidDisplay'
import {
  getRaidSummary,
  isSevenStarRelevant,
  raidMatchesFilter,
  raidMatchesSearch,
  sevenStarMatchesFilter,
  sevenStarMatchesSearch,
} from '../../../core/utils/raidDisplay/raidDisplay'
import {
  findRaid,
  findSevenStar,
  getEffectiveSelection,
  getNormalizedGroupKey,
  updateRaid,
  updateSevenStar,
} from '../raidFocusedUtils/raidFocusedUtils'

const SEVEN_STAR_GROUP = '__seven_star__'

export function useRaidEditorState(
  data: RaidListResponse | null,
  sessionId: string | null,
  t: Translator,
  onChange: (data: RaidListResponse) => void,
  onLoad: (sessionId: string) => unknown,
) {
  const [activeGroupKey, setActiveGroupKey] = useState('')
  const [advanced, setAdvanced] = useState(false)
  const [filter, setFilter] = useState<RaidFilter>('all')
  const [helpTopic, setHelpTopic] = useState<RaidHelpTopic | null>(null)
  const [query, setQuery] = useState('')
  const [selection, setSelection] = useState<RaidSelection | null>(null)

  useEffect(() => {
    if (sessionId) void onLoad(sessionId)
  }, [onLoad, sessionId])

  const normalizedGroupKey = getNormalizedGroupKey(data, activeGroupKey)
  const activeGroup =
    data?.groups.find(
      (group: { key: string; label?: string; raids: Array<unknown> }) =>
        group.key === normalizedGroupKey,
    ) ??
    data?.groups[0] ??
    null
  const showSevenStar = normalizedGroupKey === SEVEN_STAR_GROUP
  const summary = data ? getRaidSummary(data) : null
  const visibleRaids = useMemo(
    () =>
      activeGroup?.raids
        .filter(
          (raid) =>
            raidMatchesFilter(raid, filter) &&
            raidMatchesSearch(raid, query, t),
        )
        .map((raid) => ({
          groupKey: activeGroup.key,
          groupLabel: t(activeGroup.labelKey as I18nKey),
          raid,
        })) ?? [],
    [activeGroup, filter, query, t],
  )
  const visibleSevenStar = useMemo(
    () =>
      showSevenStar
        ? (data?.sevenStar?.raids.filter(
            (raid) =>
              isSevenStarRelevant(raid) &&
              sevenStarMatchesFilter(raid, filter) &&
              sevenStarMatchesSearch(raid, query, t),
          ) ?? [])
        : [],
    [data, filter, query, showSevenStar, t],
  )

  const effectiveSelection = getEffectiveSelection(
    selection,
    showSevenStar,
    visibleRaids,
    visibleSevenStar,
  )
  const selectedRaid =
    effectiveSelection?.kind === 'raid'
      ? findRaid(data, effectiveSelection)
      : null
  const selectedSevenStar =
    effectiveSelection?.kind === 'sevenStar'
      ? findSevenStar(data, effectiveSelection.index)
      : null

  function handleUpdateRaid(patch: Partial<RaidEntry>) {
    if (!data || effectiveSelection?.kind !== 'raid') return
    onChange(updateRaid(data, effectiveSelection, patch))
  }

  function handleUpdateSevenStar(patch: Partial<SevenStarRaidEntry>) {
    if (!data?.sevenStar || effectiveSelection?.kind !== 'sevenStar') return
    onChange(updateSevenStar(data, effectiveSelection.index, patch))
  }

  return {
    advanced,
    effectiveSelection,
    filter,
    helpTopic,
    normalizedGroupKey,
    query,
    selectedRaid,
    selectedSevenStar,
    selection,
    setAdvanced,
    setActiveGroupKey,
    setFilter,
    setHelpTopic,
    setQuery,
    setSelection,
    showSevenStar,
    summary,
    updateRaid: handleUpdateRaid,
    updateSevenStar: handleUpdateSevenStar,
    visibleRaids,
    visibleSevenStar,
  }
}
