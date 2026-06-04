import { useState } from 'react'

import type {
  MysteryGiftDatabaseEntry,
  MysteryGiftDatabaseSearchRequest,
  MysteryGiftDatabaseSearchResponse,
  MysteryGiftLegalityCounts,
  MysteryGiftStorageStatus,
} from '../../types/database/database'
import { createDefaultMysteryGiftSearch } from '../../utils/database/defaults/defaults'
import { writeDatabasePageSize } from '../../utils/database/preferences/preferences'

type MysteryGiftBrowserInternalState = {
  activeTab: 'general' | 'advanced' | 'criteria' | 'settings'
  filters: MysteryGiftDatabaseSearchRequest
  loading: boolean
  page: number
  pageCount: number
  resultSearch: MysteryGiftDatabaseSearchRequest
  results: MysteryGiftDatabaseEntry[]
  saveGeneration: number
  storage: MysteryGiftStorageStatus | null
  legalityCounts: MysteryGiftLegalityCounts
  total: number
}

function createState(saveGeneration: number): MysteryGiftBrowserInternalState {
  const filters = createDefaultMysteryGiftSearch(saveGeneration)
  return {
    activeTab: 'general',
    filters,
    loading: false,
    page: 1,
    pageCount: 1,
    resultSearch: filters,
    results: [],
    saveGeneration,
    storage: null,
    legalityCounts: { legal: 0, uncertain: 0, illegal: 0 },
    total: 0,
  }
}

export function useMysteryGiftBrowser(
  onSearch: (
    request: MysteryGiftDatabaseSearchRequest,
  ) => Promise<MysteryGiftDatabaseSearchResponse>,
  saveGeneration: number,
) {
  const [state, setState] = useState(() => createState(saveGeneration))

  if (state.saveGeneration !== saveGeneration) {
    setState(createState(saveGeneration))
  }

  async function search(filters = state.filters) {
    setState((current) => ({ ...current, loading: true }))
    try {
      const response = await onSearch(filters)
      const includeUncertain =
        filters.includeUncertain ||
        (filters.includeLegal &&
          !filters.includeIllegal &&
          response.legalityCounts.legal === 0 &&
          response.legalityCounts.uncertain > 0)
      const resolvedFilters = {
        ...filters,
        includeUncertain,
        limit: response.pageSize,
        page: response.page,
      }
      setState((current) => ({
        ...current,
        filters: resolvedFilters,
        page: response.page,
        pageCount: response.pageCount,
        resultSearch: resolvedFilters,
        results: response.results,
        storage: response.storage,
        legalityCounts: response.legalityCounts,
        total: response.total,
      }))
    } finally {
      setState((current) => ({ ...current, loading: false }))
    }
  }

  function updateFilters(next: Partial<MysteryGiftDatabaseSearchRequest>) {
    if (next.limit !== undefined) writeDatabasePageSize(next.limit)
    setState((current) => ({
      ...current,
      filters: { ...current.filters, ...next, page: 1 },
      page: 1,
    }))
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
    results: state.results,
    search,
    setActiveTab: (
      activeTab: 'general' | 'advanced' | 'criteria' | 'settings',
    ) => setState((current) => ({ ...current, activeTab })),
    storage: state.storage,
    legalityCounts: state.legalityCounts,
    total: state.total,
    updateFilters,
    goToPage,
  }
}
