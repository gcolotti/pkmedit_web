import { type SetStateAction, useState } from 'react'

import type {
  EncounterDatabaseEntry,
  EncounterDatabaseSearchRequest,
  EncounterDatabaseSearchResponse,
} from '../types/database'
import { createDefaultEncounterSearch } from '../utils/database/defaults'
import { writeDatabasePageSize } from '../utils/database/preferences'

type EncounterBrowserInternalState = {
  activeTab: 'general' | 'advanced' | 'criteria' | 'settings'
  filters: EncounterDatabaseSearchRequest
  loading: boolean
  page: number
  pageCount: number
  resultSearch: EncounterDatabaseSearchRequest
  results: EncounterDatabaseEntry[]
  saveGameVersion: number
  total: number
}

function createState(saveGameVersion: number): EncounterBrowserInternalState {
  const filters = createDefaultEncounterSearch(saveGameVersion)
  return {
    activeTab: 'general',
    filters,
    loading: false,
    page: 1,
    pageCount: 1,
    resultSearch: filters,
    results: [],
    saveGameVersion,
    total: 0,
  }
}

export function useEncounterBrowser(
  onSearch: (
    request: EncounterDatabaseSearchRequest,
  ) => Promise<EncounterDatabaseSearchResponse>,
  saveGameVersion: number,
) {
  const [state, setState] = useState(() => createState(saveGameVersion))

  if (state.saveGameVersion !== saveGameVersion) {
    setState(createState(saveGameVersion))
  }

  async function search(filters = state.filters) {
    setState((current) => ({ ...current, loading: true }))
    try {
      const response = await onSearch(filters)
      setState((current) => ({
        ...current,
        filters: {
          ...filters,
          limit: response.pageSize,
          page: response.page,
        },
        page: response.page,
        pageCount: response.pageCount,
        resultSearch: {
          ...filters,
          limit: response.pageSize,
          page: response.page,
        },
        results: response.results,
        total: response.total,
      }))
    } finally {
      setState((current) => ({ ...current, loading: false }))
    }
  }

  function setFilters(value: SetStateAction<EncounterDatabaseSearchRequest>) {
    setState((current) => {
      const filters =
        typeof value === 'function' ? value(current.filters) : value
      if (filters.limit !== current.filters.limit)
        writeDatabasePageSize(filters.limit)
      return {
        ...current,
        filters: { ...filters, page: 1 },
        page: 1,
      }
    })
  }

  function goToPage(nextPage: number) {
    void search({ ...state.resultSearch, page: nextPage })
  }

  return {
    activeTab: state.activeTab,
    filters: state.filters,
    loading: state.loading,
    page: state.page,
    pageCount: state.pageCount,
    resultSearch: state.resultSearch,
    results: state.results,
    search,
    setActiveTab: (
      activeTab: 'general' | 'advanced' | 'criteria' | 'settings',
    ) => setState((current) => ({ ...current, activeTab })),
    setFilters,
    total: state.total,
    goToPage,
  }
}
