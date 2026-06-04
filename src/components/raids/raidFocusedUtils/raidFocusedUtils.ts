import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { RaidSelection } from '../../../core/types/raid/raid'
import type {
  RaidEntry,
  RaidListResponse,
  SevenStarRaidEntry,
} from '../../../core/types/saveFeature/saveFeature'
import { type RaidFilter } from '../../../core/utils/raidDisplay/raidDisplay'

const SEVEN_STAR_GROUP = '__seven_star__'

export function getFilterOptions(saveKind: 'sv' | 'swsh', t: Translator) {
  return [
    { label: t('all'), value: 'all' },
    { label: t('raidFilterActive'), value: 'active' },
    { label: t('raidFilterEvent'), value: 'event' },
    {
      label: saveKind === 'swsh' ? t('raidFilterWish') : t('raidFilterLp'),
      value: saveKind === 'swsh' ? 'wish' : 'lp',
    },
    { label: t('raidFilterUnknown'), value: 'unknown' },
  ] satisfies Array<{ label: string; value: RaidFilter }>
}

export function getNormalizedGroupKey(
  data: RaidListResponse | null,
  groupKey: string,
) {
  if (!data) return ''
  if (groupKey === SEVEN_STAR_GROUP && data.sevenStar?.raids.length)
    return groupKey
  return data.groups.some((group) => group.key === groupKey)
    ? groupKey
    : (data.groups[0]?.key ?? '')
}

export function findRaid(
  data: RaidListResponse | null,
  selection: Extract<RaidSelection, { kind: 'raid' }>,
) {
  return (
    data?.groups
      .find((group) => group.key === selection.groupKey)
      ?.raids.find((raid) => raid.index === selection.index) ?? null
  )
}

export function findSevenStar(data: RaidListResponse | null, index: number) {
  return data?.sevenStar?.raids.find((raid) => raid.index === index) ?? null
}

export function getEffectiveSelection(
  selection: RaidSelection | null,
  showSevenStar: boolean,
  visibleRaids: Array<{
    groupKey: string
    groupLabel: string
    raid: RaidEntry
  }>,
  visibleSevenStar: SevenStarRaidEntry[],
): RaidSelection | null {
  if (showSevenStar) {
    if (
      selection?.kind === 'sevenStar' &&
      visibleSevenStar.some((raid) => raid.index === selection.index)
    )
      return selection
    return visibleSevenStar[0]
      ? { index: visibleSevenStar[0].index, kind: 'sevenStar' }
      : null
  }
  if (
    selection?.kind === 'raid' &&
    visibleRaids.some(
      ({ groupKey, raid }) =>
        groupKey === selection.groupKey && raid.index === selection.index,
    )
  )
    return selection
  const first = visibleRaids[0]
  return first
    ? { groupKey: first.groupKey, index: first.raid.index, kind: 'raid' }
    : null
}

export function updateRaid(
  data: RaidListResponse,
  selection: Extract<RaidSelection, { kind: 'raid' }>,
  patch: Partial<RaidEntry>,
): RaidListResponse {
  return {
    ...data,
    groups: data.groups.map((group) =>
      group.key === selection.groupKey
        ? {
            ...group,
            raids: group.raids.map((raid) =>
              raid.index === selection.index ? { ...raid, ...patch } : raid,
            ),
          }
        : group,
    ),
  }
}

export function updateSevenStar(
  data: RaidListResponse,
  index: number,
  patch: Partial<SevenStarRaidEntry>,
): RaidListResponse {
  if (!data.sevenStar) return data
  return {
    ...data,
    sevenStar: {
      raids: data.sevenStar.raids.map((raid) =>
        raid.index === index ? { ...raid, ...patch } : raid,
      ),
    },
  }
}
