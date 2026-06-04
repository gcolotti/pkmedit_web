import { useId, useState } from 'react'

import type { Translator } from '../../../core/i18n/i18n'
import type { CatalogEntry } from '../../../core/types/index'

const ID_PATTERN = /#(\d+)\)$/

function formatEntry(entry: CatalogEntry): string {
  return `${entry.name} (#${entry.id})`
}

export function SearchableAnyCatalogSelect({
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
  const listId = useId()
  const selected = entries.find((entry) => entry.id === value)
  const [inputText, setInputText] = useState(() =>
    selected ? formatEntry(selected) : '',
  )
  const [syncedValue, setSyncedValue] = useState(value)

  if (syncedValue !== value) {
    setSyncedValue(value)
    setInputText(selected ? formatEntry(selected) : '')
  }

  function handleChange(text: string) {
    setInputText(text)
    if (!text) {
      onChange(anyValue)
      return
    }
    const match = ID_PATTERN.exec(text)
    if (match) {
      const id = Number(match[1])
      if (entries.some((e) => e.id === id)) {
        onChange(id)
      }
    }
  }

  const query = inputText.trim().toLowerCase()
  const suggestions = query
    ? entries
        .filter(
          (e) =>
            e.name.toLowerCase().includes(query) ||
            String(e.id).includes(query),
        )
        .slice(0, 10)
    : []

  return (
    <label className="grid gap-1.5">
      <span className="label text-[0.65rem]">{label}</span>
      <input
        className="field"
        list={listId}
        placeholder={t('any')}
        value={inputText}
        onChange={(event) => handleChange(event.currentTarget.value)}
      />
      <datalist id={listId}>
        {suggestions.map((entry) => (
          <option key={entry.id} value={formatEntry(entry)} />
        ))}
      </datalist>
    </label>
  )
}
