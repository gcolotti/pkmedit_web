import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'

import type { Translator } from '../../../core/i18n/i18n'
import type { CatalogEntry } from '../../../core/types/index'
import { useFieldIssue } from '../../core/forms/FieldIssueContext'
import { NatureModifierLabel } from '../NatureModifierLabel'

export function NatureListbox({
  id,
  label,
  suffix,
  value,
  entries,
  validationPath,
  t,
  onChange,
}: {
  id: string
  label: string
  suffix?: string
  value: number
  entries: CatalogEntry[]
  validationPath?: string
  t: Translator
  onChange: (value: number) => void
}) {
  const issue = useFieldIssue(validationPath)
  const selected = entries.find((e) => e.id === value)

  return (
    <label className="grid gap-1.5" htmlFor={id}>
      <span className={`label${issue.labelClassName} text-[0.65rem]`}>
        {label}
        {suffix && (
          <span className="ml-1 text-[0.5rem] opacity-70">{suffix}</span>
        )}
      </span>
      <Listbox value={value} onChange={onChange}>
        <ListboxButton
          id={id}
          aria-invalid={issue.invalid || undefined}
          className={`field${issue.fieldClassName} flex min-w-0 items-center justify-between gap-1 text-left`}
        >
          <span className="truncate">{selected?.name ?? `#${value}`}</span>
          <NatureModifierLabel
            upStat={selected?.upStat}
            downStat={selected?.downStat}
            t={t}
          />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          className="z-50 max-h-64 w-[var(--button-width)] overflow-y-auto rounded-md border border-white/10 bg-zinc-900 py-1 shadow-xl outline-none"
        >
          {entries.map((entry) => (
            <ListboxOption
              key={entry.id}
              value={entry.id}
              className="flex cursor-pointer items-center justify-between gap-2 px-3 py-1 text-[0.65rem] data-[focus]:bg-white/10"
            >
              <span className="truncate">{entry.name}</span>
              <NatureModifierLabel
                upStat={entry.upStat}
                downStat={entry.downStat}
                t={t}
              />
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </label>
  )
}
