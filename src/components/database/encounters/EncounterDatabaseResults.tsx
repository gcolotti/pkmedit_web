import type { Translator } from '../../../core/i18n/i18n'
import type {
  EncounterDatabaseEntry,
  EncounterDatabaseSearchRequest,
} from '../../../core/types/database'
import { DatabasePagination } from '../DatabasePagination'
import { DatabaseResultCard } from '../DatabaseResultCard'

export function EncounterDatabaseResults({
  filters,
  loading,
  onPageChange,
  onPreview,
  page,
  pageCount,
  results,
  selectedId,
  t,
  total,
}: {
  filters: EncounterDatabaseSearchRequest
  loading: boolean
  onPageChange: (page: number) => void
  onPreview: (search: EncounterDatabaseSearchRequest, resultId: string) => void
  page: number
  pageCount: number
  results: EncounterDatabaseEntry[]
  selectedId: string | null
  t: Translator
  total: number
}) {
  return (
    <div className="mt-5 grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-stone-600 dark:text-stone-300/80">
        <span>{t('databaseResults', { count: total })}</span>
        {total > 0 ? (
          <DatabasePagination
            disabled={loading}
            page={page}
            pageCount={pageCount}
            t={t}
            onPageChange={onPageChange}
          />
        ) : null}
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
        <div className="rounded-md border border-dashed border-stone-500/50 p-4 text-sm font-bold text-stone-600 dark:text-stone-300/80">
          {t('databaseNoResults')}
        </div>
      ) : null}
    </div>
  )
}
