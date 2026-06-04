import { useMemo } from 'react'

import type { Translator } from '../../core/i18n/i18n'
import type { CatalogEntry } from '../../core/types/index'
import { groupCatalogEntriesByType } from '../../core/utils/catalogSort'
import { hexToRgba } from '../../core/utils/color'
import { getTypeColor } from '../../core/utils/typeData'
import { TypeIcon } from '../ui/TypeIcon'

type Groups = {
  legal: ReturnType<typeof groupCatalogEntriesByType>
  other: ReturnType<typeof groupCatalogEntriesByType>
}

function rowStyle(
  entry: CatalogEntry,
  options: { legal: boolean; selected: boolean; active: boolean },
) {
  if (options.active) {
    const color = getTypeColor(entry.typeId)
    return color ? { backgroundColor: hexToRgba(color, 0.35) } : undefined
  }
  if (options.selected) {
    const color = getTypeColor(entry.typeId)
    return color ? { backgroundColor: hexToRgba(color, 0.2) } : undefined
  }
  if (options.legal) {
    return { backgroundColor: 'rgba(34, 197, 94, 0.12)' }
  }
  return undefined
}

export function MoveBrowseList({
  activeMoveId,
  groups,
  query,
  selectedMoveIds,
  t,
  onSelect,
}: {
  activeMoveId: number | null
  groups: Groups
  query: string
  selectedMoveIds: Set<number>
  t: Translator
  onSelect: (id: number) => void
}) {
  const filtered = useMemo(() => {
    if (!query) return groups
    const q = query.toLowerCase()
    const filter = (gs: Groups['legal']) =>
      gs
        .map((g) => ({
          ...g,
          entries: g.entries.filter((e) => e.name.toLowerCase().includes(q)),
        }))
        .filter((g) => g.entries.length > 0)
    return { legal: filter(groups.legal), other: filter(groups.other) }
  }, [query, groups])

  const empty = filtered.legal.length === 0 && filtered.other.length === 0

  if (empty) {
    return (
      <div className="px-3 py-6 text-center text-sm italic text-stone-500 dark:text-stone-400">
        {t('moveBrowseEmpty')}
      </div>
    )
  }

  return (
    <div className="grid">
      {filtered.legal.length > 0 && (
        <div className="px-2 pb-0.5 pt-2 text-[0.6rem] font-semibold uppercase tracking-wider text-stone-500 dark:text-white/40">
          {t('moveCanLearn')}
        </div>
      )}
      {renderEntries(
        filtered.legal,
        true,
        activeMoveId,
        selectedMoveIds,
        onSelect,
      )}
      {filtered.legal.length > 0 && filtered.other.length > 0 && (
        <div className="my-1 border-t border-black/10 dark:border-white/10" />
      )}
      {renderEntries(
        filtered.other,
        false,
        activeMoveId,
        selectedMoveIds,
        onSelect,
      )}
    </div>
  )
}

function renderEntries(
  section: Groups['legal'],
  legal: boolean,
  activeMoveId: number | null,
  selectedMoveIds: Set<number>,
  onSelect: (id: number) => void,
) {
  return section.flatMap((group) =>
    group.entries.map((ge) => (
      <button
        key={`${legal ? 'legal' : 'other'}-${ge.id}`}
        className="flex cursor-pointer items-center gap-2 px-3 py-1 text-left text-sm hover:brightness-110"
        style={rowStyle(ge, {
          legal,
          selected: selectedMoveIds.has(ge.id),
          active: activeMoveId === ge.id,
        })}
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onSelect(ge.id)}
      >
        <TypeIcon typeId={ge.typeId} />
        <span>{ge.name}</span>
      </button>
    )),
  )
}
