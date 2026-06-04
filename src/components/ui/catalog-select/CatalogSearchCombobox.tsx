import { Combobox } from '@headlessui/react'
import { useMemo, useState } from 'react'

import type { Translator } from '../../../core/i18n/i18n'
import type { CatalogEntry } from '../../../core/types/index'
import { getCatalogSearchResults } from '../../../core/utils/catalogSearch'
import { useFieldIssue } from '../../core/forms/FieldIssueContext'
import { CatalogSearchComboboxInput } from './CatalogSearchComboboxInput'
import { CatalogSearchOptions } from './CatalogSearchOptions'

type Props = {
  id: string
  label: string
  value: number
  entries: CatalogEntry[]
  t: Translator
  clearValue?: number
  emptyLabel?: string
  getImageUrl?: (id: number) => string | undefined
  selectedEntry?: CatalogEntry
  validationPath?: string
  onChange: (value: number) => void
}

function formatCatalogEntry(entry: CatalogEntry): string {
  return `${entry.name} (#${entry.id})`
}

function compareCatalogEntries(a: CatalogEntry | null, b: CatalogEntry | null) {
  return a?.id === b?.id
}

export function CatalogSearchCombobox({
  clearValue,
  emptyLabel,
  entries,
  getImageUrl,
  id,
  label,
  onChange,
  selectedEntry: selectedEntryFallback,
  t,
  validationPath,
  value,
}: Props) {
  const issue = useFieldIssue(validationPath)
  const selected = entries.find((entry) => entry.id === value)
  const selectedEntry =
    clearValue !== undefined && value === clearValue
      ? null
      : (selected ??
        (selectedEntryFallback?.id === value
          ? selectedEntryFallback
          : { id: value, name: `#${value}` }))
  const selectedDisplay = selectedEntry ? formatCatalogEntry(selectedEntry) : ''
  const [searchText, setSearchText] = useState<string | null>(null)
  const inputText = searchText ?? selectedDisplay
  const results = useMemo(
    () => getCatalogSearchResults(entries, searchText ?? '', selected?.id),
    [entries, searchText, selected?.id],
  )
  const isFiltering = Boolean(searchText?.trim())
  const selectedImageUrl = selectedEntry
    ? getImageUrl?.(selectedEntry.id)
    : null
  const canClear = clearValue !== undefined && value !== clearValue

  function handleInputChange(value: string) {
    setSearchText(value)
  }

  function handleChange(entry: CatalogEntry | null) {
    if (!entry) return
    setSearchText(null)
    onChange(entry.id)
  }

  function handleClear() {
    if (clearValue === undefined) return
    setSearchText(null)
    onChange(clearValue)
  }

  return (
    <label className="grid gap-1.5" htmlFor={id}>
      <span className={`label${issue.labelClassName} text-[0.65rem]`}>
        {label}
      </span>
      <Combobox
        immediate
        by={compareCatalogEntries}
        invalid={issue.invalid}
        value={selectedEntry}
        onChange={handleChange}
        onClose={() => setSearchText(null)}
      >
        <CatalogSearchComboboxInput
          canClear={canClear}
          emptyLabel={emptyLabel}
          fieldClassName={issue.fieldClassName}
          id={id}
          inputText={inputText}
          selectedImageUrl={selectedImageUrl}
          t={t}
          onClear={handleClear}
          onFocus={() => {
            setSearchText('')
          }}
          onInputChange={handleInputChange}
        />
        <CatalogSearchOptions
          getImageUrl={getImageUrl}
          isFiltering={isFiltering}
          results={results}
          t={t}
        />
      </Combobox>
    </label>
  )
}
