import { Search } from 'lucide-react'

import type { EncounterDatabaseSearchRequest } from '../../../../core/types/database/database'
import type { EncounterDatabaseFiltersProps } from '../../../../core/types/databaseFilters/databaseFilters'
import { MoveFilterGrid } from '../../../pokemon/moves/MoveFilterGrid/MoveFilterGrid'
import { AnyBooleanSelect } from '../../../ui/AnyBooleanSelect/AnyBooleanSelect'
import { AnyCatalogSelect } from '../../../ui/catalog-select/AnyCatalogSelect/AnyCatalogSelect'
import { CatalogSearchCombobox } from '../../../ui/catalog-select/CatalogSearchCombobox/CatalogSearchCombobox'
import { SmallNumberField } from '../../../ui/SmallNumberField/SmallNumberField'
import { DatabaseFilterTabs } from '../../DatabaseFilterTabs/DatabaseFilterTabs'
import { encounterTypes } from '../encounterTypes/encounterTypes'

export function EncounterDatabaseFilters({
  activeTab,
  catalogs,
  filters,
  loading,
  onSearch,
  setActiveTab,
  setFilters,
  t,
}: EncounterDatabaseFiltersProps) {
  const setCriteria = (
    criteria: Partial<EncounterDatabaseSearchRequest['criteria']>,
  ) =>
    setFilters({ ...filters, criteria: { ...filters.criteria, ...criteria } })

  return (
    <div className="mt-4 grid gap-3">
      <DatabaseFilterTabs active={activeTab} t={t} onChange={setActiveTab} />
      {activeTab === 'general' ? (
        <div className="grid gap-3">
          <CatalogSearchCombobox
            id="encounter-species"
            entries={catalogs.species}
            label={t('species')}
            clearValue={0}
            emptyLabel={t('any')}
            t={t}
            value={filters.species}
            onChange={(species) => setFilters({ ...filters, species })}
          />
          <AnyCatalogSelect
            entries={catalogs.versions}
            label={t('originGame')}
            t={t}
            value={filters.version}
            onChange={(version) => setFilters({ ...filters, version })}
          />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <AnyBooleanSelect
              label={t('shiny')}
              t={t}
              value={filters.shiny}
              onChange={(shiny) => setFilters({ ...filters, shiny })}
            />
            <AnyBooleanSelect
              label={t('egg')}
              t={t}
              value={filters.egg}
              onChange={(egg) => setFilters({ ...filters, egg })}
            />
          </div>
        </div>
      ) : null}
      {activeTab === 'advanced' ? (
        <MoveFilterGrid
          moveCatalog={catalogs.moves}
          moves={filters.moves}
          t={t}
          onChange={(moves) => setFilters({ ...filters, moves })}
        />
      ) : null}
      {activeTab === 'criteria' ? (
        <div className="grid gap-3 sm:grid-cols-2">
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
      ) : null}
      {activeTab === 'settings' ? (
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
                    setFilters({
                      ...filters,
                      types: active
                        ? filters.types.filter((item) => item !== type)
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
            label={t('resultsPerPage')}
            min={1}
            max={600}
            value={filters.limit}
            onChange={(limit) => setFilters({ ...filters, limit })}
          />
        </div>
      ) : null}
      <button
        className="btn btn-primary w-full"
        disabled={loading}
        type="button"
        onClick={onSearch}
      >
        <Search size={18} />
        {loading ? t('searching') : t('searchDatabase')}
      </button>
    </div>
  )
}
