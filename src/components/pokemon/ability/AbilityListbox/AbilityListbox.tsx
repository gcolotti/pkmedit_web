import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import { useMemo } from 'react'

import { useWorkspace } from '../../../../core/hooks/workspaceContext/workspaceContext'
import { localizedText } from '../../../../core/i18n/i18n/i18n'
import { useAbilityDetailsByIds } from '../../../../core/query/useAbilityDetails/useAbilityDetails'
import type {
  AbilityDetail,
  CatalogEntry,
  Language,
} from '../../../../core/types/index/index'
import { useFieldIssue } from '../../../core/forms/FieldIssueContext/FieldIssueContext'
import { AbilityInfoTooltip } from '../AbilityInfoTooltip/AbilityInfoTooltip'

function getAbilityDescription(
  detail: AbilityDetail | undefined,
  language: Language,
): string | null {
  if (!detail?.current?.effect) return null
  const effect = detail.current.effect
  return (
    localizedText(effect.description, language) ||
    localizedText(effect.short, language) ||
    null
  )
}

export function AbilityListbox({
  id,
  label,
  value,
  entries,
  contextAbilities,
  language,
  validationPath,
  onChange,
}: {
  id: string
  label: string
  value: number
  entries: CatalogEntry[]
  contextAbilities: CatalogEntry[]
  language?: Language
  validationPath?: string
  onChange: (value: number) => void
}) {
  const { api, state } = useWorkspace()
  const apiBase = state.apiBase
  const issue = useFieldIssue(validationPath)
  const lang: Language = language ?? 'en'

  const ids = useMemo(() => entries.map((e) => e.id), [entries])
  const { data: abilityDetails } = useAbilityDetailsByIds(api, apiBase, ids)
  const selected = entries.find((e) => e.id === value)

  const renderLabel = (entry: CatalogEntry) => {
    const index = contextAbilities.findIndex((e) => e.id === entry.id)
    if (index < 0) return { name: entry.name, slot: null, hidden: false }
    const slot = index === 2 ? 4 : index + 1
    return { name: entry.name, slot, hidden: index === 2 }
  }

  const selectedLabel = selected ? renderLabel(selected) : null
  const selectedDescription = getAbilityDescription(
    abilityDetails?.get(value),
    lang,
  )

  return (
    <label className="grid gap-1.5" htmlFor={id}>
      <span className={`label${issue.labelClassName} text-[0.65rem]`}>
        {label}
      </span>
      <Listbox value={value} onChange={onChange}>
        <ListboxButton
          id={id}
          aria-invalid={issue.invalid || undefined}
          className={`field${issue.fieldClassName} flex min-w-0 items-center gap-1 text-left`}
        >
          <span className="min-w-0 flex-1 truncate">
            {selectedLabel ? (
              <>
                {selectedLabel.name}
                {selectedLabel.slot !== null && (
                  <span className="ml-1 opacity-70">
                    [{selectedLabel.slot}]
                  </span>
                )}
                {selectedLabel.hidden && (
                  <span className="ml-1 text-[0.55rem] opacity-70">HA</span>
                )}
              </>
            ) : (
              `#${value}`
            )}
          </span>
          {selectedDescription && (
            <AbilityInfoTooltip text={selectedDescription} />
          )}
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          className="z-50 max-h-80 w-[var(--button-width)] overflow-y-auto rounded-md border border-white/10 bg-zinc-900 py-1 shadow-xl outline-none"
        >
          {entries.map((entry) => {
            const info = renderLabel(entry)
            const description = getAbilityDescription(
              abilityDetails?.get(entry.id),
              lang,
            )
            return (
              <ListboxOption
                key={entry.id}
                value={entry.id}
                className="flex cursor-pointer flex-col gap-0.5 px-3 py-1.5 text-[0.65rem] data-[focus]:bg-white/10"
              >
                <span className="flex items-center gap-1">
                  <span className="truncate">{info.name}</span>
                  {info.slot !== null && (
                    <span className="opacity-70">[{info.slot}]</span>
                  )}
                  {info.hidden && (
                    <span className="text-[0.55rem] opacity-70">HA</span>
                  )}
                </span>
                {description && (
                  <span className="whitespace-pre-line text-[0.6rem] leading-snug opacity-70">
                    {description}
                  </span>
                )}
              </ListboxOption>
            )
          })}
        </ListboxOptions>
      </Listbox>
    </label>
  )
}
