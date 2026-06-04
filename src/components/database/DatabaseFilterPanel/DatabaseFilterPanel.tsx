import type { DatabaseBrowserState } from '../../../core/hooks/useDatabaseBrowser/useDatabaseBrowser'
import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { CatalogBundle, DatabaseView } from '../../../core/types/index/index'
import { SubPanelTabs } from '../../ui/SubPanelTabs/SubPanelTabs'
import { EncounterDatabaseFilters } from '../encounters/EncounterDatabaseFilters/EncounterDatabaseFilters'
import { MysteryGiftDatabaseFilters } from '../mystery-gift/MysteryGiftDatabaseFilters/MysteryGiftDatabaseFilters'

export function DatabaseFilterPanel({
  catalogs,
  databaseBrowser,
  databaseView,
  onDatabaseViewChange,
  t,
}: {
  catalogs: CatalogBundle
  databaseBrowser: DatabaseBrowserState
  databaseView: DatabaseView
  onDatabaseViewChange: (view: DatabaseView) => void
  t: Translator
}) {
  return (
    <>
      <SubPanelTabs
        active={databaseView}
        label={t('databaseTabs')}
        options={[
          { value: 'encounters', label: t('encounters') },
          { value: 'mysteryGifts', label: t('mysteryGifts') },
        ]}
        onChange={onDatabaseViewChange}
      />
      {databaseView === 'encounters' ? (
        <EncounterDatabaseFilters
          activeTab={databaseBrowser.encounters.activeTab}
          catalogs={catalogs}
          filters={databaseBrowser.encounters.filters}
          loading={databaseBrowser.encounters.loading}
          setActiveTab={databaseBrowser.encounters.setActiveTab}
          setFilters={databaseBrowser.encounters.setFilters}
          t={t}
          onSearch={() =>
            void databaseBrowser.encounters.search({
              ...databaseBrowser.encounters.filters,
              page: 1,
            })
          }
        />
      ) : (
        <MysteryGiftDatabaseFilters
          activeTab={databaseBrowser.mysteryGifts.activeTab}
          catalogs={catalogs}
          filters={databaseBrowser.mysteryGifts.filters}
          loading={databaseBrowser.mysteryGifts.loading}
          legalityCounts={databaseBrowser.mysteryGifts.legalityCounts}
          setActiveTab={databaseBrowser.mysteryGifts.setActiveTab}
          storage={databaseBrowser.mysteryGifts.storage}
          t={t}
          updateFilters={databaseBrowser.mysteryGifts.updateFilters}
          onSearch={() =>
            void databaseBrowser.mysteryGifts.search({
              ...databaseBrowser.mysteryGifts.filters,
              page: 1,
            })
          }
        />
      )}
    </>
  )
}
