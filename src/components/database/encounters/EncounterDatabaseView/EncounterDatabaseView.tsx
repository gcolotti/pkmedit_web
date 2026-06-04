import { Search } from 'lucide-react'
import { useState } from 'react'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type {
  EncounterDatabaseEntry,
  EncounterDatabaseSearchRequest,
  EncounterDatabaseSearchResponse,
} from '../../../../core/types/database/database'
import type { CatalogBundle } from '../../../../core/types/index/index'
import { createDefaultEncounterSearch } from '../../../../core/utils/database/defaults/defaults'
import { MoveFilterGrid } from '../../../pokemon/moves/MoveFilterGrid/MoveFilterGrid'
import { AnyBooleanSelect } from '../../../ui/AnyBooleanSelect/AnyBooleanSelect'
import { AnyCatalogSelect } from '../../../ui/catalog-select/AnyCatalogSelect/AnyCatalogSelect'
import { CatalogSearchCombobox } from '../../../ui/catalog-select/CatalogSearchCombobox/CatalogSearchCombobox'
import {
  type DatabaseFilterTab,
  DatabaseFilterTabs,
} from '../../DatabaseFilterTabs/DatabaseFilterTabs'
import { DatabaseResultCard } from '../../DatabaseResultCard/DatabaseResultCard'
import { EncounterCriteriaTab } from '../EncounterCriteriaTab/EncounterCriteriaTab'
import { EncounterSettingsTab } from '../EncounterSettingsTab/EncounterSettingsTab'

export function EncounterDatabaseView({
  catalogs,
  onPreview,
  onSearch,
  saveGameVersion,
  selectedId,
  t,
}: {
  catalogs: CatalogBundle
  onPreview: (search: EncounterDatabaseSearchRequest, resultId: string) => void
  onSearch: (
    request: EncounterDatabaseSearchRequest,
  ) => Promise<EncounterDatabaseSearchResponse>
  saveGameVersion: number
  selectedId: string | null
  t: Translator
}) {
  const [filters, setFilters] = useState(() =>
    createDefaultEncounterSearch(saveGameVersion),
  )
  const [activeTab, setActiveTab] = useState<DatabaseFilterTab>('general')
  const [results, setResults] = useState<EncounterDatabaseEntry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  async function runSearch() {
    setLoading(true)
    try {
      const response = await onSearch(filters)
      setResults(response.results)
      setTotal(response.total)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-5 grid gap-4">
      <div className="surface-muted rounded-md p-2">
        <DatabaseFilterTabs active={activeTab} t={t} onChange={setActiveTab} />
        <div className="mt-3">
          {activeTab === 'general' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <CatalogSearchCombobox
                id="encounter-view-species"
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
            <EncounterCriteriaTab
              catalogs={catalogs}
              filters={filters}
              t={t}
              onFiltersChange={setFilters}
            />
          ) : null}
          {activeTab === 'settings' ? (
            <EncounterSettingsTab
              filters={filters}
              t={t}
              onFiltersChange={setFilters}
            />
          ) : null}
        </div>
        <button
          className="btn btn-primary mt-3 w-full"
          disabled={loading}
          type="button"
          onClick={() => void runSearch()}
        >
          <Search size={18} />
          {loading ? t('searching') : t('searchDatabase')}
        </button>
      </div>

      <div className="flex items-center justify-between text-sm font-bold text-stone-300/80">
        <span>{t('databaseResults', { count: total })}</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {results.map((entry) => (
          <DatabaseResultCard
            key={entry.id}
            active={selectedId === entry.id}
            entry={entry}
            kind="encounter"
            t={t}
            onClick={() => onPreview(filters, entry.id)}
          />
        ))}
      </div>
      {!loading && results.length === 0 ? (
        <div className="rounded-md border border-dashed border-stone-500/50 p-4 text-sm font-bold text-stone-300/80">
          {t('databaseNoResults')}
        </div>
      ) : null}
    </div>
  )
}
