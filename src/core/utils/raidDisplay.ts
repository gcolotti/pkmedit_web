import type { I18nKey, Translator } from '../i18n/i18n'
import type { RaidFilter, RaidHelpTopic } from '../types/raidHelp'
import type {
  RaidEntry,
  RaidListResponse,
  SevenStarRaidEntry,
} from '../types/saveFeature'
import { getSevenStarEvent } from './raidEventData'
import { getRaidHelpContent } from './raidHelpContent'
export type { RaidFilter, RaidHelpTopic }

import type { SevenStarEventInfo } from './raidEventData'
export type { SevenStarEventInfo }
export { getSevenStarEvent }
export { getRaidHelpContent }

export function isSevenStarRelevant(raid: SevenStarRaidEntry) {
  return raid.identifier > 0 || raid.captured || raid.defeated
}

export function getRaidSummary(data: RaidListResponse) {
  const raids = data.groups.flatMap((group) => group.raids)
  const sevenStarUnknown =
    data.sevenStar?.raids.filter(
      (raid) =>
        isSevenStarRelevant(raid) && !getSevenStarEvent(raid.identifier),
    ).length ?? 0
  return {
    active: raids.filter(
      (raid) => raid.isActive === true || raid.isEnabled === true,
    ).length,
    event: raids.filter(
      (raid) =>
        raid.isEvent === true ||
        raid.content === 'Distribution' ||
        raid.content === 'Might7',
    ).length,
    lpPending: raids.filter((raid) => raid.isClaimedLeaguePoints === false)
      .length,
    total: raids.length,
    unknown: sevenStarUnknown,
    wish: raids.filter((raid) => raid.isWishingPiece === true).length,
  }
}

export function raidMatchesFilter(raid: RaidEntry, filter: RaidFilter) {
  if (filter === 'active')
    return raid.isActive === true || raid.isEnabled === true
  if (filter === 'event')
    return (
      raid.isEvent === true ||
      raid.content === 'Distribution' ||
      raid.content === 'Might7'
    )
  if (filter === 'lp') return raid.isClaimedLeaguePoints === false
  if (filter === 'unknown') return false
  if (filter === 'wish') return raid.isWishingPiece === true
  return true
}

export function sevenStarMatchesFilter(
  raid: SevenStarRaidEntry,
  filter: RaidFilter,
) {
  if (filter === 'event') return true
  if (filter === 'unknown') return getSevenStarEvent(raid.identifier) === null
  if (filter === 'active') return raid.defeated || raid.captured
  if (filter === 'lp' || filter === 'wish') return false
  return true
}

export function raidMatchesSearch(
  raid: RaidEntry,
  query: string,
  t: Translator,
) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [
    raid.index + 1,
    raid.hash,
    raid.seed,
    raid.scenePointName,
    raid.areaId,
    raid.lotteryGroup,
    raid.spawnPointId,
    raid.content ? getSvRaidKindLabel(raid.content, t) : null,
    raid.denType ? getSwshBeamLabel(raid, t) : null,
  ]
    .filter((value) => value !== null && value !== undefined)
    .some((value) => String(value).toLowerCase().includes(normalized))
}

export function sevenStarMatchesSearch(
  raid: SevenStarRaidEntry,
  query: string,
  t: Translator,
) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  const event = getSevenStarEvent(raid.identifier)
  return [
    raid.identifier,
    event?.pokemon,
    event ? getSevenStarLabel(raid, t) : t('raidUnknownEvent'),
    event ? t(event.teraTypeKey) : null,
    event?.firstRun,
  ]
    .filter((value) => value !== null && value !== undefined)
    .some((value) => String(value).toLowerCase().includes(normalized))
}

export function getSwshBeamLabel(raid: RaidEntry, t: Translator) {
  if (raid.isActive === false || raid.denType === 'None')
    return t('raidBeamInactive')
  if (raid.denType === 'DynamaxCrystal') return t('raidBeamCrystal')
  if (raid.isEvent === true || raid.denType === 'Event')
    return t('raidBeamEvent')
  if (
    raid.isRare === true ||
    raid.denType === 'Rare' ||
    raid.denType === 'RareWish'
  )
    return t('raidBeamRare')
  return t('raidBeamCommon')
}

export function getSvRaidKindLabel(content: string | null, t: Translator) {
  const key = `raidContentType${content ?? 'Base05'}` as I18nKey
  return t(key)
}

export function getSevenStarLabel(raid: SevenStarRaidEntry, t: Translator) {
  const event = getSevenStarEvent(raid.identifier)
  return event
    ? t('raidSevenStarKnownTitle', { pokemon: event.pokemon })
    : t('raidUnknownEvent')
}
