import { Search } from 'lucide-react'

import type { DatabaseFilterTab } from '../../../../core/hooks/useDatabaseBrowser/useDatabaseBrowser'
import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type {
  MysteryGiftDatabaseSearchRequest,
  MysteryGiftLegalityCounts,
  MysteryGiftStorageStatus,
} from '../../../../core/types/database/database'
import type { CatalogBundle } from '../../../../core/types/index/index'
import { getHeldItemImageUrl } from '../../../../core/utils/wikiDexAssets/wikiDexAssets'
import { MoveFilterGrid } from '../../../pokemon/moves/MoveFilterGrid/MoveFilterGrid'
import { AnyBooleanSelect } from '../../../ui/AnyBooleanSelect/AnyBooleanSelect'
import { CatalogSearchCombobox } from '../../../ui/catalog-select/CatalogSearchCombobox/CatalogSearchCombobox'
import { SmallNumberField } from '../../../ui/SmallNumberField/SmallNumberField'
import { DatabaseFilterTabs } from '../../DatabaseFilterTabs/DatabaseFilterTabs'
import { MysteryGiftCriteriaTab } from '../MysteryGiftCriteriaTab/MysteryGiftCriteriaTab'
import { MysteryGiftLegalityToggles } from '../MysteryGiftLegalityToggles/MysteryGiftLegalityToggles'

export function MysteryGiftDatabaseFilters({
  activeTab,
  catalogs,
  filters,
  legalityCounts,
  loading,
  onSearch,
  setActiveTab,
  storage,
  t,
  updateFilters,
}: {
  activeTab: DatabaseFilterTab
  catalogs: CatalogBundle
  filters: MysteryGiftDatabaseSearchRequest
  legalityCounts: MysteryGiftLegalityCounts
  loading: boolean
  onSearch: () => void
  setActiveTab: (tab: DatabaseFilterTab) => void
  storage: MysteryGiftStorageStatus | null
  t: Translator
  updateFilters: (next: Partial<MysteryGiftDatabaseSearchRequest>) => void
}) {
  return (
    <div className="mt-4 grid gap-3">
      <DatabaseFilterTabs active={activeTab} t={t} onChange={setActiveTab} />
      {activeTab === 'general' ? (
        <div className="grid gap-3">
          <CatalogSearchCombobox
            id="mystery-gift-species"
            entries={catalogs.species}
            label={t('species')}
            clearValue={-1}
            emptyLabel={t('any')}
            t={t}
            value={filters.species}
            onChange={(species) => updateFilters({ species })}
          />
          <CatalogSearchCombobox
            id="mystery-gift-held-item"
            entries={catalogs.items}
            label={t('heldItem')}
            clearValue={-1}
            emptyLabel={t('any')}
            getImageUrl={getHeldItemImageUrl}
            t={t}
            value={filters.heldItem}
            onChange={(heldItem) => updateFilters({ heldItem })}
          />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <AnyBooleanSelect
              label={t('shiny')}
              t={t}
              value={filters.shiny}
              onChange={(shiny) => updateFilters({ shiny })}
            />
            <AnyBooleanSelect
              label={t('egg')}
              t={t}
              value={filters.egg}
              onChange={(egg) => updateFilters({ egg })}
            />
          </div>
          <MysteryGiftLegalityToggles
            filters={filters}
            legalityCounts={legalityCounts}
            t={t}
            updateFilters={updateFilters}
          />
        </div>
      ) : null}
      {activeTab === 'advanced' ? (
        <MoveFilterGrid
          moveCatalog={catalogs.moves}
          moves={filters.moves}
          t={t}
          onChange={(moves) => updateFilters({ moves })}
        />
      ) : null}
      {activeTab === 'criteria' ? (
        <MysteryGiftCriteriaTab
          filters={filters}
          t={t}
          updateFilters={updateFilters}
        />
      ) : null}
      {activeTab === 'settings' ? (
        <div className="grid gap-3">
          <SmallNumberField
            label={t('resultsPerPage')}
            min={1}
            max={600}
            value={filters.limit}
            onChange={(limit) => updateFilters({ limit })}
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
