import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { SevenStarRaidEntry } from '../../../core/types/saveFeature/saveFeature'
import {
  getSevenStarEvent,
  getSevenStarLabel,
} from '../../../core/utils/raidDisplay/raidDisplay'
import { RaidBadge } from '../RaidBadge/RaidBadge'

export function SevenStarRow({
  raid,
  selected,
  t,
  onSelect,
}: {
  raid: SevenStarRaidEntry
  selected: boolean
  t: Translator
  onSelect: () => void
}) {
  const event = getSevenStarEvent(raid.identifier)
  return (
    <button
      className={`w-full rounded-md border p-3 text-left transition ${selected ? 'border-lagoon bg-lagoon/15' : 'border-black/10 bg-white/50 hover:border-lagoon/70 dark:border-white/10 dark:bg-white/5'}`}
      type="button"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold">
            {getSevenStarLabel(raid, t)}
          </h3>
          <p className="mt-0.5 truncate text-xs text-stone-500 dark:text-stone-400">
            {event
              ? t('raidEventFirstRun', { date: event.firstRun })
              : t('raidIdentifierValue', { id: raid.identifier })}
          </p>
        </div>
        <RaidBadge>{t('raidSevenStar')}</RaidBadge>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <RaidBadge>
          {event
            ? t('raidEventPokemon', { pokemon: event.pokemon })
            : t('raidUnknownEvent')}
        </RaidBadge>
        {event && (
          <RaidBadge>
            {t('raidEventTeraType', { type: t(event.teraTypeKey) })}
          </RaidBadge>
        )}
        {raid.captured && <RaidBadge>{t('raidCaptured')}</RaidBadge>}
        {raid.defeated && <RaidBadge>{t('raidDefeated')}</RaidBadge>}
      </div>
    </button>
  )
}
