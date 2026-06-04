import type { Translator } from '../../../core/i18n/i18n'
import type { EncounterDatabaseSearchRequest } from '../../../core/types/database'
import type { CatalogBundle } from '../../../core/types/index'
import { AnyCatalogSelect } from '../../ui/catalog-select/AnyCatalogSelect'
import { SmallNumberField } from '../../ui/SmallNumberField'

type Props = {
  catalogs: CatalogBundle
  filters: EncounterDatabaseSearchRequest
  onFiltersChange: (filters: EncounterDatabaseSearchRequest) => void
  t: Translator
}

export function EncounterCriteriaTab({
  catalogs,
  filters,
  onFiltersChange,
  t,
}: Props) {
  const setCriteria = (
    criteria: Partial<EncounterDatabaseSearchRequest['criteria']>,
  ) =>
    onFiltersChange({
      ...filters,
      criteria: { ...filters.criteria, ...criteria },
    })

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <AnyCatalogSelect
        anyValue={-1}
        entries={catalogs.natures}
        label={t('nature')}
        t={t}
        value={filters.criteria.nature}
        onChange={(nature) => setCriteria({ nature })}
      />
      <SmallNumberField
        label={t('levelMin')}
        value={filters.criteria.levelMin}
        onChange={(levelMin) => setCriteria({ levelMin })}
      />
      <SmallNumberField
        label={t('levelMax')}
        value={filters.criteria.levelMax}
        onChange={(levelMax) => setCriteria({ levelMax })}
      />
      {(['ivHp', 'ivAtk', 'ivDef', 'ivSpa', 'ivSpd', 'ivSpe'] as const).map(
        (key) => (
          <SmallNumberField
            key={key}
            label={t(key)}
            min={-1}
            max={31}
            value={filters.criteria[key]}
            onChange={(value) => setCriteria({ [key]: value })}
          />
        ),
      )}
    </div>
  )
}
