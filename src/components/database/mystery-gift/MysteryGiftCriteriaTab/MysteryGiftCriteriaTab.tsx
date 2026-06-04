import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { MysteryGiftDatabaseSearchRequest } from '../../../../core/types/database/database'

export function MysteryGiftCriteriaTab({
  filters,
  t,
  updateFilters,
}: {
  filters: MysteryGiftDatabaseSearchRequest
  t: Translator
  updateFilters: (next: Partial<MysteryGiftDatabaseSearchRequest>) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[8rem_minmax(0,1fr)] xl:grid-cols-1 2xl:grid-cols-[8rem_minmax(0,1fr)]">
      <label className="grid gap-1.5">
        <span className="label text-[0.65rem]">{t('formatCompare')}</span>
        <select
          className="field"
          value={filters.formatComparator}
          onChange={(event) =>
            updateFilters({ formatComparator: event.currentTarget.value })
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
            updateFilters({ format: Number(event.currentTarget.value) })
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
  )
}
