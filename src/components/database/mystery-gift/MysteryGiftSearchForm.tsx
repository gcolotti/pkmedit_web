import { Search } from 'lucide-react'

import type { Translator } from '../../../core/i18n/i18n'
import type {
  MysteryGiftDatabaseSearchRequest,
  MysteryGiftStorageStatus,
} from '../../../core/types/database'
import type { CatalogBundle } from '../../../core/types/index'
import { MoveFilterGrid } from '../../pokemon/moves/MoveFilterGrid'
import { SmallNumberField } from '../../ui/SmallNumberField'
import {
  type DatabaseFilterTab,
  DatabaseFilterTabs,
} from '../DatabaseFilterTabs'
import { MysteryGiftGeneralTab } from './MysteryGiftGeneralTab'

type Props = {
  activeTab: DatabaseFilterTab
  catalogs: CatalogBundle
  filters: MysteryGiftDatabaseSearchRequest
  loading: boolean
  storage: MysteryGiftStorageStatus | null
  t: Translator
  onActiveTabChange: (tab: DatabaseFilterTab) => void
  onFiltersChange: (next: Partial<MysteryGiftDatabaseSearchRequest>) => void
  onSearch: () => void
}

export function MysteryGiftSearchForm({
  activeTab,
  catalogs,
  filters,
  loading,
  storage,
  t,
  onActiveTabChange,
  onFiltersChange,
  onSearch,
}: Props) {
  return (
    <div className="surface-muted rounded-md p-2">
      <DatabaseFilterTabs
        active={activeTab}
        t={t}
        onChange={onActiveTabChange}
      />
      <div className="mt-3">
        {activeTab === 'general' ? (
          <MysteryGiftGeneralTab
            catalogs={catalogs}
            filters={filters}
            t={t}
            onFiltersChange={onFiltersChange}
          />
        ) : null}
        {activeTab === 'advanced' ? (
          <MoveFilterGrid
            moveCatalog={catalogs.moves}
            moves={filters.moves}
            t={t}
            onChange={(moves) => onFiltersChange({ moves })}
          />
        ) : null}
        {activeTab === 'criteria' ? (
          <div className="grid gap-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
            <label className="grid gap-1.5">
              <span className="label text-[0.65rem]">{t('formatCompare')}</span>
              <select
                className="field"
                value={filters.formatComparator}
                onChange={(event) =>
                  onFiltersChange({
                    formatComparator: event.currentTarget.value,
                  })
                }
              >
                <option value="">{t('any')}</option>
                <option value="<=">{'<='}</option>
                <option value="=">{'='}</option>
                <option value=">=">{'>='}</option>
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="label text-[0.65rem]">{t('format')}</span>
              <select
                className="field"
                value={filters.format}
                onChange={(event) =>
                  onFiltersChange({ format: Number(event.currentTarget.value) })
                }
              >
                <option value={0}>{t('any')}</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((generation) => (
                  <option key={generation} value={generation}>
                    {t('generation', { generation })}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}
        {activeTab === 'settings' ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <SmallNumberField
              label={t('resultsPerPage')}
              min={1}
              max={600}
              value={filters.limit}
              onChange={(limit) => onFiltersChange({ limit })}
            />
            {storage ? (
              <div className="rounded-md bg-black/10 p-3 text-sm font-bold dark:bg-white/10">
                {storage.supported
                  ? t('mysteryGiftStorageStatus', {
                      used: storage.used,
                      capacity: storage.capacity,
                    })
                  : t('mysteryGiftUnsupported')}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <button
        className="btn btn-primary mt-3 w-full"
        disabled={loading}
        onClick={onSearch}
        type="button"
      >
        <Search size={18} />
        {loading ? t('searching') : t('searchDatabase')}
      </button>
    </div>
  )
}
