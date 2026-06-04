import type { Translator } from '../../../core/i18n/i18n'
import type { EncounterDatabaseSearchRequest } from '../../../core/types/database'
import { SmallNumberField } from '../../ui/SmallNumberField'
import { encounterTypes } from './encounterTypes'

type Props = {
  filters: EncounterDatabaseSearchRequest
  t: Translator
  onFiltersChange: (filters: EncounterDatabaseSearchRequest) => void
}

export function EncounterSettingsTab({ filters, onFiltersChange, t }: Props) {
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        {encounterTypes.map(({ type, label }) => {
          const active = filters.types.includes(type)
          return (
            <button
              key={type}
              aria-pressed={active}
              className={`btn min-h-9 px-3 ${active ? 'btn-primary' : ''}`}
              type="button"
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  types: active
                    ? filters.types.filter(
                        (item) =>
                          item !==
                          (type as EncounterDatabaseSearchRequest['types'][number]),
                      )
                    : [...filters.types, type],
                })
              }
            >
              {t(label)}
            </button>
          )
        })}
      </div>
      <SmallNumberField
        label={t('resultLimit')}
        min={1}
        max={600}
        value={filters.limit}
        onChange={(limit) => onFiltersChange({ ...filters, limit })}
      />
    </div>
  )
}
