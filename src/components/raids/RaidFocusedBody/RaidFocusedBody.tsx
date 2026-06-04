import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { RaidSelection } from '../../../core/types/raid/raid'
import type {
  RaidEntry,
  RaidListResponse,
  SevenStarRaidEntry,
} from '../../../core/types/saveFeature/saveFeature'
import { RaidHelpTopic } from '../../../core/utils/raidDisplay/raidDisplay'
import { RaidDetailPanel } from '../RaidDetailPanel/RaidDetailPanel'
import { RaidListPanel } from '../RaidListPanel/RaidListPanel'

export function RaidFocusedBody({
  advanced,
  data,
  status,
  t,
  visibleRaids,
  visibleSevenStar,
  selection,
  selectedRaid,
  selectedSevenStar,
  onRaidChange,
  onSelect,
  onSevenStarChange,
  onHelp,
}: {
  advanced: boolean
  data: RaidListResponse | null
  status: string
  t: Translator
  visibleRaids: Array<{ groupKey: string; groupLabel: string; raid: RaidEntry }>
  visibleSevenStar: SevenStarRaidEntry[]
  selection: RaidSelection | null
  selectedRaid: RaidEntry | null
  selectedSevenStar: SevenStarRaidEntry | null
  onRaidChange: (patch: Partial<RaidEntry>) => void
  onSelect: (selection: RaidSelection) => void
  onSevenStarChange: (patch: Partial<SevenStarRaidEntry>) => void
  onHelp: (topic: RaidHelpTopic) => void
}) {
  if (!data)
    return (
      <div className="p-8 text-center text-sm text-stone-500">
        {status === 'loading'
          ? t('saveSectionLoading')
          : t('saveFeatureUnavailable')}
      </div>
    )
  const empty = visibleRaids.length === 0 && visibleSevenStar.length === 0
  return (
    <div className="grid min-h-0 gap-4 p-4 lg:h-full lg:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)]">
      <aside className="min-h-0 rounded-md border border-black/10 bg-white/30 p-3 dark:border-white/10 dark:bg-white/[0.03] lg:overflow-y-auto">
        {empty ? (
          <div className="rounded-md border border-dashed border-black/10 p-6 text-center text-sm text-stone-500 dark:border-white/10">
            {t('raidNoMatches')}
          </div>
        ) : (
          <RaidListPanel
            raids={visibleRaids}
            saveKind={data.saveKind}
            selected={selection}
            sevenStarRaids={visibleSevenStar}
            t={t}
            onSelect={onSelect}
          />
        )}
      </aside>
      <section className="min-h-0 rounded-md border border-black/10 bg-white/40 p-4 dark:border-white/10 dark:bg-white/[0.04] lg:overflow-y-auto">
        <RaidDetailPanel
          advanced={advanced}
          raid={selectedRaid}
          saveKind={data.saveKind}
          sevenStar={selectedSevenStar}
          t={t}
          onRaidChange={onRaidChange}
          onSevenStarChange={onSevenStarChange}
          onHelp={onHelp}
        />
      </section>
    </div>
  )
}
