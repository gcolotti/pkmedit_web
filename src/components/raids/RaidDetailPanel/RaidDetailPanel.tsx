import type { Translator } from '../../../core/i18n/i18n/i18n'
import type {
  RaidEntry,
  SevenStarRaidEntry,
} from '../../../core/types/saveFeature/saveFeature'
import type { RaidHelpTopic } from '../../../core/utils/raidDisplay/raidDisplay'
import { SevenStarDetail } from '../SevenStarDetail/SevenStarDetail'
import { SvRaidDetail } from '../SvRaidDetail/SvRaidDetail'
import { SwshRaidDetail } from '../SwshRaidDetail/SwshRaidDetail'

export function RaidDetailPanel({
  advanced,
  raid,
  saveKind,
  sevenStar,
  t,
  onRaidChange,
  onSevenStarChange,
  onHelp,
}: {
  advanced: boolean
  raid: RaidEntry | null
  saveKind: 'sv' | 'swsh'
  sevenStar: SevenStarRaidEntry | null
  t: Translator
  onRaidChange: (patch: Partial<RaidEntry>) => void
  onSevenStarChange: (patch: Partial<SevenStarRaidEntry>) => void
  onHelp: (topic: RaidHelpTopic) => void
}) {
  if (sevenStar)
    return (
      <SevenStarDetail
        advanced={advanced}
        raid={sevenStar}
        t={t}
        onChange={onSevenStarChange}
        onHelp={onHelp}
      />
    )
  if (!raid)
    return (
      <div className="rounded-md border border-dashed border-black/10 p-6 text-center text-sm text-stone-500 dark:border-white/10">
        {t('raidSelectPrompt')}
      </div>
    )
  return saveKind === 'swsh' ? (
    <SwshRaidDetail
      advanced={advanced}
      raid={raid}
      t={t}
      onChange={onRaidChange}
      onHelp={onHelp}
    />
  ) : (
    <SvRaidDetail
      advanced={advanced}
      raid={raid}
      t={t}
      onChange={onRaidChange}
      onHelp={onHelp}
    />
  )
}
