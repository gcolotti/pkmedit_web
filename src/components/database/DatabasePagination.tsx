import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import type { Translator } from '../../core/i18n/i18n'

export function DatabasePagination({
  disabled,
  page,
  pageCount,
  t,
  onPageChange,
}: {
  disabled: boolean
  page: number
  pageCount: number
  t: Translator
  onPageChange: (page: number) => void
}) {
  const lastPage = Math.max(pageCount, 1)
  const currentPage = Math.min(Math.max(page, 1), lastPage)
  const canGoPrevious = currentPage > 1 && !disabled
  const canGoNext = currentPage < lastPage && !disabled

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        aria-label={t('firstPage')}
        className="btn min-h-9 px-2"
        disabled={!canGoPrevious}
        type="button"
        onClick={() => onPageChange(1)}
      >
        <ChevronsLeft size={16} />
      </button>
      <button
        aria-label={t('previousPage')}
        className="btn min-h-9 px-2"
        disabled={!canGoPrevious}
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={16} />
      </button>
      <div className="surface-muted min-h-9 rounded-md px-3 py-2 text-sm font-black">
        {t('databasePage', { current: currentPage, total: lastPage })}
      </div>
      <button
        aria-label={t('nextPage')}
        className="btn min-h-9 px-2"
        disabled={!canGoNext}
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight size={16} />
      </button>
      <button
        aria-label={t('lastPage')}
        className="btn min-h-9 px-2"
        disabled={!canGoNext}
        type="button"
        onClick={() => onPageChange(lastPage)}
      >
        <ChevronsRight size={16} />
      </button>
    </div>
  )
}
