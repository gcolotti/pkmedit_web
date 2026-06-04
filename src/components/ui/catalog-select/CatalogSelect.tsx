import type { ReactNode } from 'react'
import { useMemo } from 'react'

import type { CatalogEntry } from '../../../core/types/index'
import { sortCatalogEntriesByName } from '../../../core/utils/catalogSort'
import {
  getCatalogEntryOptionStyle,
  getCatalogEntrySelectStyle,
} from '../../../core/utils/catalogStyle'
import { useFieldIssue } from '../../core/forms/FieldIssueContext'

type Props = {
  id: string
  label: string
  suffix?: string
  value: number
  entries: CatalogEntry[]
  prefix?: ReactNode
  validationPath?: string
  formatOptionLabel?: (entry: CatalogEntry) => string
  preserveOrder?: boolean
  onChange: (value: number) => void
}

export function CatalogSelect({
  entries,
  formatOptionLabel,
  id,
  label,
  onChange,
  prefix,
  preserveOrder,
  suffix,
  validationPath,
  value,
}: Props) {
  const issue = useFieldIssue(validationPath)
  const selected = entries.find((entry) => entry.id === value)
  const hasCurrentValue = !selected
  const sorted = useMemo(
    () => (preserveOrder ? entries : sortCatalogEntriesByName(entries)),
    [entries, preserveOrder],
  )
  const selectedStyle = getCatalogEntrySelectStyle(selected)

  const select = (
    <select
      aria-invalid={issue.invalid || undefined}
      className={`field${issue.fieldClassName}`}
      id={id}
      value={value}
      style={selectedStyle}
      onChange={(event) => onChange(Number(event.currentTarget.value))}
    >
      {hasCurrentValue && <option value={value}>{`#${value}`}</option>}
      {sorted.map((entry) => {
        return (
          <option
            key={entry.id}
            value={entry.id}
            style={getCatalogEntryOptionStyle(entry)}
          >
            {formatOptionLabel
              ? formatOptionLabel(entry)
              : `${entry.name} (#${entry.id})`}
          </option>
        )
      })}
    </select>
  )

  return (
    <label className="grid gap-1.5">
      <span className={`label${issue.labelClassName} text-[0.65rem]`}>
        {label}
        {suffix && (
          <span className="ml-1 text-[0.5rem] opacity-70">{suffix}</span>
        )}
      </span>
      {prefix ? (
        <span className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-2">
          {prefix}
          {select}
        </span>
      ) : (
        select
      )}
    </label>
  )
}
