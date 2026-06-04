import type { Dispatch, SetStateAction } from 'react'

import type { DatabaseFilterTab } from '../hooks/useDatabaseBrowser'
import type { Translator } from '../i18n/i18n'
import type { EncounterDatabaseSearchRequest } from './database'
import type { CatalogBundle } from './index'

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
