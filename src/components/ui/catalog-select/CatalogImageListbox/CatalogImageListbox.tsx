import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import { useMemo } from 'react'

import type { CatalogEntry } from '../../../../core/types/index/index'
import { sortCatalogEntriesByName } from '../../../../core/utils/catalogSort/catalogSort'
import { useFieldIssue } from '../../../core/forms/FieldIssueContext/FieldIssueContext'

type Props = {
  id: string
  label: string
  value: number
  entries: CatalogEntry[]
  getImageUrl: (id: number) => string | undefined
  validationPath?: string
  onChange: (value: number) => void
}

export function CatalogImageListbox({
  entries,
  getImageUrl,
  id,
  label,
  onChange,
  validationPath,
  value,
}: Props) {
  const issue = useFieldIssue(validationPath)
  const selected = entries.find((e) => e.id === value)
  const sorted = useMemo(() => sortCatalogEntriesByName(entries), [entries])
  const selectedImageUrl = getImageUrl(value)

  return (
    <label className="grid gap-1.5" htmlFor={id}>
      <span className={`label${issue.labelClassName} text-[0.65rem]`}>
        {label}
      </span>
      <Listbox value={value} onChange={onChange}>
        <ListboxButton
          id={id}
          aria-invalid={issue.invalid || undefined}
          className={`field${issue.fieldClassName} flex min-w-0 items-center gap-2 text-left`}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center">
            {selectedImageUrl && (
              <img
                alt=""
                aria-hidden="true"
                className="h-full w-full object-contain"
                decoding="async"
                loading="lazy"
                src={selectedImageUrl}
              />
            )}
          </span>
          <span className="truncate">{selected?.name ?? `#${value}`}</span>
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          className="z-50 max-h-64 w-[var(--button-width)] overflow-y-auto rounded-md border border-white/10 bg-zinc-900 py-1 shadow-xl outline-none"
        >
          {sorted.map((entry) => {
            const imgUrl = getImageUrl(entry.id)
            return (
              <ListboxOption
                key={entry.id}
                value={entry.id}
                className="flex cursor-pointer items-center gap-2 px-3 py-1 text-[0.65rem] data-[focus]:bg-white/10"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {imgUrl && (
                    <img
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-contain"
                      decoding="async"
                      loading="lazy"
                      src={imgUrl}
                    />
                  )}
                </span>
                <span className="truncate">{entry.name}</span>
              </ListboxOption>
            )
          })}
        </ListboxOptions>
      </Listbox>
    </label>
  )
}
