import type { Translator } from '../../core/i18n/i18n'
import type { RaidEntry } from '../../core/types/saveFeature'
import {
  getSvRaidKindLabel,
  getSwshBeamLabel,
} from '../../core/utils/raidDisplay'
import { RaidBadge } from './RaidBadge'

export function RaidRow({
  groupLabel,
  raid,
  saveKind,
  selected,
  t,
  onSelect,
}: {
  groupLabel: string
  raid: RaidEntry
  saveKind: 'sv' | 'swsh'
  selected: boolean
  t: Translator
  onSelect: () => void
}) {
  const title =
    saveKind === 'swsh'
      ? t('raidDenTitle', { id: raid.index + 1 })
      : t('raidCrystalTitle', { id: raid.index + 1 })
  const primary =
    saveKind === 'swsh'
      ? getSwshBeamLabel(raid, t)
      : getSvRaidKindLabel(raid.content, t)
  const secondary =
    saveKind === 'swsh'
      ? groupLabel
      : (raid.scenePointName ?? t('raidUnknownLocation'))
  const active = raid.isActive === true || raid.isEnabled === true

  return (
    <button
      className={`w-full rounded-md border p-3 text-left transition ${selected ? 'border-lagoon bg-lagoon/15' : 'border-black/10 bg-white/50 hover:border-lagoon/70 dark:border-white/10 dark:bg-white/5'}`}
      type="button"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold">{title}</h3>
          <p className="mt-0.5 truncate text-xs text-stone-500 dark:text-stone-400">
            {secondary}
          </p>
        </div>
        <RaidBadge>
          {active ? t('raidActive') : t('raidBeamInactive')}
        </RaidBadge>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <RaidBadge>{primary}</RaidBadge>
        {saveKind === 'swsh' && raid.stars !== null && (
          <RaidBadge>
            {t('raidStarsValue', { stars: raid.stars + 1 })}
          </RaidBadge>
        )}
        {raid.isWishingPiece && <RaidBadge>{t('raidWishingPiece')}</RaidBadge>}
        {raid.isEvent && <RaidBadge>{t('raidEvent')}</RaidBadge>}
        {raid.isClaimedLeaguePoints === false && (
          <RaidBadge>{t('raidLpPending')}</RaidBadge>
        )}
      </div>
    </button>
  )
}
