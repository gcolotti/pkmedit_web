import { useMemo } from 'react'

import type { Translator } from '../../../core/i18n/i18n'
import type { CatalogEntry } from '../../../core/types/index'
import {
  groupCatalogEntriesByType,
  sortCatalogEntriesByName,
} from '../../../core/utils/catalogSort'
import {
  getCatalogEntryOptionStyle,
  getCatalogEntrySelectStyle,
} from '../../../core/utils/catalogStyle'
import { getTypeIcon } from '../../../core/utils/typeData'

export function AnyCatalogSelect({
  anyValue = 0,
  entries,
  label,
  onChange,
  t,
  value,
}: {
  anyValue?: number
  entries: CatalogEntry[]
  label: string
  onChange: (value: number) => void
  t: Translator
  value: number
}) {
  const selected = entries.find((entry) => entry.id === value)
  const hasTypeGroups = entries.some((entry) => entry.typeId !== undefined)
  const sorted = useMemo(() => sortCatalogEntriesByName(entries), [entries])
  const grouped = useMemo(
    () => (hasTypeGroups ? groupCatalogEntriesByType(entries, t) : []),
    [entries, hasTypeGroups, t],
  )
  const selectedStyle =
    value === anyValue ? undefined : getCatalogEntrySelectStyle(selected)

  return (
    <label className="grid gap-1.5">
      <span className="label text-[0.65rem]">{label}</span>
      <select
        className="field"
        style={selectedStyle}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      >
        <option value={anyValue}>{t('any')}</option>
        {!selected && value !== anyValue ? (
          <option value={value}>{`#${value}`}</option>
        ) : null}
        {hasTypeGroups
          ? grouped.map((group) => (
              <optgroup key={group.key} label={group.label}>
                {group.entries.map((entry) => renderCatalogOption(entry, true))}
              </optgroup>
            ))
          : sorted.map((entry) => renderCatalogOption(entry, false))}
      </select>
    </label>
  )
}

function renderCatalogOption(entry: CatalogEntry, showTypeIcon: boolean) {
  return (
    <option
      key={entry.id}
      value={entry.id}
      style={getCatalogEntryOptionStyle(entry)}
    >
      {`${showTypeIcon ? `${getTypeIcon(entry.typeId)} ` : ''}${entry.name} (#${entry.id})`}
    </option>
  )
}
