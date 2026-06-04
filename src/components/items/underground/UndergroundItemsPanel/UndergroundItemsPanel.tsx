import { useEffect } from 'react'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type {
  UndergroundItemEntry,
  UndergroundItemsResponse,
} from '../../../../core/types/saveFeature/saveFeature'
import { UndergroundItemRow } from '../UndergroundItemRow/UndergroundItemRow'

export function UndergroundItemsPanel({
  sessionId,
  t,
  data,
  status,
  onLoad,
  onChange,
}: {
  sessionId: string | null
  t: Translator
  data: UndergroundItemsResponse | null
  status: string
  onLoad: (sessionId: string) => void
  onChange: (data: UndergroundItemsResponse) => void
}) {
  useEffect(() => {
    if (sessionId && !data) onLoad(sessionId)
  }, [sessionId, data, onLoad])

  function updateItem(index: number, patch: Partial<UndergroundItemEntry>) {
    if (!data) return
    onChange({
      items: data.items.map((item) =>
        item.index === index ? { ...item, ...patch } : item,
      ),
    })
  }

  if (!sessionId)
    return (
      <div className="py-8 text-center text-sm text-stone-500">
        {t('noSaveLoaded')}
      </div>
    )
  if (!data)
    return (
      <div className="py-8 text-center text-sm text-stone-500">
        {status || t('saveSectionLoading')}
      </div>
    )

  return (
    <div className="mt-4 grid gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          className="btn"
          type="button"
          onClick={() => onChange({ items: data.items.map(maxItem) })}
        >
          {t('all')}
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => onChange({ items: data.items.map(clearItem) })}
        >
          {t('none')}
        </button>
      </div>
      <div className="max-h-[34rem] overflow-auto rounded-md border border-black/10 dark:border-white/10">
        <table className="min-w-full text-left text-xs">
          <thead className="sticky top-0 bg-stone-100 text-stone-600 dark:bg-stone-900 dark:text-stone-300">
            <tr>
              <th className="px-2 py-2">{t('id')}</th>
              <th className="px-2 py-2">{t('type')}</th>
              <th className="px-2 py-2">{t('name')}</th>
              <th className="px-2 py-2">{t('count')}</th>
              <th className="px-2 py-2">{t('new')}</th>
              <th className="px-2 py-2">{t('favorite')}</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <UndergroundItemRow
                key={item.index}
                item={item}
                t={t}
                onChange={updateItem}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function maxItem(item: UndergroundItemEntry): UndergroundItemEntry {
  return { ...item, count: item.maxCount, isNew: true }
}

function clearItem(item: UndergroundItemEntry): UndergroundItemEntry {
  return { ...item, count: 0, favorite: false, isNew: false }
}
