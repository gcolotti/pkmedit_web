import type { Dispatch, SetStateAction } from 'react'

import type { DatabaseFilterTab } from '../../hooks/useDatabaseBrowser/useDatabaseBrowser'
import type { Translator } from '../../i18n/i18n/i18n'
import type { EncounterDatabaseSearchRequest } from '../database/database'
import type { CatalogBundle } from '../index/index'

export type EncounterDatabaseFiltersProps = {
  activeTab: DatabaseFilterTab
  catalogs: CatalogBundle
  filters: EncounterDatabaseSearchRequest
  loading: boolean
  onSearch: () => void
  setActiveTab: (tab: DatabaseFilterTab) => void
  setFilters: Dispatch<SetStateAction<EncounterDatabaseSearchRequest>>
  t: Translator
}
