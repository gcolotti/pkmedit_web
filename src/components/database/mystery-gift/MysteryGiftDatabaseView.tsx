import { Gift } from 'lucide-react'
import { useState } from 'react'

import type { Translator } from '../../../core/i18n/i18n'
import type {
  MysteryGiftDatabaseEntry,
  MysteryGiftDatabaseSearchRequest,
  MysteryGiftDatabaseSearchResponse,
  MysteryGiftStorageStatus,
} from '../../../core/types/database'
import type { CatalogBundle } from '../../../core/types/index'
import { createDefaultMysteryGiftSearch } from '../../../core/utils/database/defaults'
import { type DatabaseFilterTab } from '../DatabaseFilterTabs'
import { DatabasePagination } from '../DatabasePagination'
import { DatabaseResultCard } from '../DatabaseResultCard'
import { MysteryGiftSearchForm } from './MysteryGiftSearchForm'

export function MysteryGiftDatabaseView({
  catalogs,
  onPreview,
  onSearch,
  saveGeneration,
  selectedId,
  t,
}: {
  catalogs: CatalogBundle
  onPreview: (resultId: string) => void
  onSearch: (
    request: MysteryGiftDatabaseSearchRequest,
  ) => Promise<MysteryGiftDatabaseSearchResponse>
  saveGeneration: number
  selectedId: string | null
  t: Translator
}) {
  const [filters, setFilters] = useState(() =>
    createDefaultMysteryGiftSearch(saveGeneration),
  )
  const [activeTab, setActiveTab] = useState<DatabaseFilterTab>('general')
  const [results, setResults] = useState<MysteryGiftDatabaseEntry[]>([])
  const [storage, setStorage] = useState<MysteryGiftStorageStatus | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [loading, setLoading] = useState(false)

  function updateFilters(next: Partial<MysteryGiftDatabaseSearchRequest>) {
    setFilters((current) => ({ ...current, ...next, page: 1 }))
    setPage(1)
  }

  async function runSearch(nextFilters = filters) {
    setLoading(true)
    try {
      const response = await onSearch(nextFilters)
      setResults(response.results)
      setStorage(response.storage)
      setTotal(response.total)
      setPage(response.page)
      setPageCount(response.pageCount)
      setFilters({
        ...nextFilters,
        limit: response.pageSize,
        page: response.page,
      })
    } finally {
      setLoading(false)
    }
  }

  function goToPage(nextPage: number) {
    void runSearch({ ...filters, page: nextPage })
  }

  return (
    <div className="mt-5 grid gap-4">
      <MysteryGiftSearchForm
        activeTab={activeTab}
        catalogs={catalogs}
        filters={filters}
        loading={loading}
        storage={storage}
        t={t}
        onActiveTabChange={setActiveTab}
        onFiltersChange={updateFilters}
        onSearch={() => void runSearch({ ...filters, page: 1 })}
      />

      <div className="flex items-center justify-between text-sm font-bold text-stone-300/80">
        <span>{t('databaseResults', { count: total })}</span>
        <Gift size={18} />
      </div>
      {total > 0 ? (
        <DatabasePagination
          disabled={loading}
          page={page}
          pageCount={pageCount}
          t={t}
          onPageChange={goToPage}
        />
      ) : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {results.map((entry) => (
          <DatabaseResultCard
            key={entry.id}
            active={selectedId === entry.id}
            entry={entry}
            kind="gift"
            t={t}
            onClick={() => onPreview(entry.id)}
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
