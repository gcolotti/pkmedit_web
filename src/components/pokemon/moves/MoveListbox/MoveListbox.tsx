import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import { useMemo, useState } from 'react'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { CatalogEntry } from '../../../../core/types/index/index'
import { groupCatalogEntriesByType } from '../../../../core/utils/catalogSort/catalogSort'
import { hexToRgba } from '../../../../core/utils/color/color'
import { getTypeColor } from '../../../../core/utils/typeData/typeData'
import { TypeIcon } from '../../../ui/TypeIcon/TypeIcon'
import { MoveListboxSearch } from '../MoveListboxSearch/MoveListboxSearch'
import { getMoveOptionStyle } from '../moveListboxUtils/moveListboxUtils'

export function MoveListbox({
  value,
  groups,
  moveById,
  selectedMoveIds,
  ariaLabel,
  ariaInvalid,
  className,
  t,
  onChange,
  onPreviewMoveChange,
}: {
  value: number
  groups: {
    legal: ReturnType<typeof groupCatalogEntriesByType>
    other: ReturnType<typeof groupCatalogEntriesByType>
  }
  moveById: Map<number, CatalogEntry>
  selectedMoveIds: Set<number>
  ariaLabel: string
  ariaInvalid?: boolean
  className?: string
  t: Translator
  onChange: (value: number) => void
  onPreviewMoveChange?: (value: number | null) => void
}) {
  const [query, setQuery] = useState('')
  const entry = moveById.get(value)
  const typeColor = getTypeColor(entry?.typeId)
  const buttonBg = typeColor ? hexToRgba(typeColor, 0.18) : undefined

  const filteredGroups = useMemo(() => {
    if (!query) return groups
    const q = query.toLowerCase()
    const filter = (gs: typeof groups.legal) =>
      gs
        .map((g) => ({
          ...g,
          entries: g.entries.filter((e) => e.name.toLowerCase().includes(q)),
        }))
        .filter((g) => g.entries.length > 0)
    return { legal: filter(groups.legal), other: filter(groups.other) }
  }, [query, groups])

  return (
    <Listbox
      value={value}
      onChange={(val) => {
        setQuery('')
        onPreviewMoveChange?.(val)
        onChange(val)
      }}
    >
      <ListboxButton
        aria-invalid={ariaInvalid || undefined}
        aria-label={ariaLabel}
        className={`${className ?? ''} flex min-w-0 items-center gap-1.5 text-left`}
        style={buttonBg ? { backgroundColor: buttonBg } : undefined}
        onMouseEnter={() => onPreviewMoveChange?.(value)}
      >
        <TypeIcon typeId={entry?.typeId} />
        <span className="truncate">{entry ? entry.name : `#${value}`}</span>
      </ListboxButton>

      <ListboxOptions
        anchor="bottom start"
        className="z-50 max-h-64 w-[var(--button-width)] min-w-[14rem] overflow-y-auto rounded-md border border-white/10 bg-zinc-900 py-1 shadow-xl outline-none"
      >
        <MoveListboxSearch query={query} t={t} onQueryChange={setQuery} />
        {!entry && (
          <ListboxOption
            className="cursor-pointer px-3 py-1 text-sm data-[focus]:bg-white/10"
            value={value}
          >
            #{value}
          </ListboxOption>
        )}

        {filteredGroups.legal.length > 0 && (
          <div className="px-2 pb-0.5 pt-2 text-[0.6rem] font-semibold uppercase tracking-wider text-white/40">
            {t('moveCanLearn')}
          </div>
        )}
        {filteredGroups.legal.flatMap((group) =>
          group.entries.map((ge) => (
            <ListboxOption
              key={`legal-${ge.id}`}
              className="flex cursor-pointer items-center gap-2 px-3 py-1 text-sm data-[focus]:brightness-125"
              style={getMoveOptionStyle(ge, {
                legal: true,
                selected: selectedMoveIds.has(ge.id),
              })}
              value={ge.id}
              onFocus={() => onPreviewMoveChange?.(ge.id)}
              onMouseEnter={() => onPreviewMoveChange?.(ge.id)}
            >
              <TypeIcon typeId={ge.typeId} />
              <span>{ge.name}</span>
            </ListboxOption>
          )),
        )}

        {filteredGroups.legal.length > 0 && filteredGroups.other.length > 0 && (
          <div className="my-1 border-t border-white/10" />
        )}

        {filteredGroups.other.flatMap((group) =>
          group.entries.map((ge) => (
            <ListboxOption
              key={`other-${ge.id}`}
              className="flex cursor-pointer items-center gap-2 px-3 py-1 text-sm data-[focus]:brightness-125"
              style={getMoveOptionStyle(ge, {
                legal: false,
                selected: selectedMoveIds.has(ge.id),
              })}
              value={ge.id}
              onFocus={() => onPreviewMoveChange?.(ge.id)}
              onMouseEnter={() => onPreviewMoveChange?.(ge.id)}
            >
              <TypeIcon typeId={ge.typeId} />
              <span>{ge.name}</span>
            </ListboxOption>
          )),
        )}
      </ListboxOptions>
    </Listbox>
  )
}
