import type { Translator } from '../../core/i18n/i18n'
import type { RaidSelection } from '../../core/types/raid'
import type {
  RaidEntry,
  SevenStarRaidEntry,
} from '../../core/types/saveFeature'
import { RaidRow } from './RaidRow'
import { SevenStarRow } from './SevenStarRow'

export function RaidListPanel({
  raids,
  saveKind,
  selected,
  sevenStarRaids,
  t,
  onSelect,
}: {
  raids: Array<{ groupKey: string; groupLabel: string; raid: RaidEntry }>
  saveKind: 'sv' | 'swsh'
  selected: RaidSelection | null
  sevenStarRaids: SevenStarRaidEntry[]
  t: Translator
  onSelect: (selection: RaidSelection) => void
}) {
  if (sevenStarRaids.length > 0) {
    return (
      <div className="grid gap-2">
        {sevenStarRaids.map((raid) => (
          <SevenStarRow
            key={raid.index}
            raid={raid}
            selected={
              selected?.kind === 'sevenStar' && selected.index === raid.index
            }
            t={t}
            onSelect={() => onSelect({ kind: 'sevenStar', index: raid.index })}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      {raids.map(({ groupKey, groupLabel, raid }) => (
        <RaidRow
          key={`${groupKey}:${raid.index}`}
          groupLabel={groupLabel}
          raid={raid}
          saveKind={saveKind}
          selected={
            selected?.kind === 'raid' &&
            selected.groupKey === groupKey &&
            selected.index === raid.index
          }
          t={t}
          onSelect={() =>
            onSelect({ groupKey, kind: 'raid', index: raid.index })
          }
        />
      ))}
    </div>
  )
}
