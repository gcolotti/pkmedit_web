import { Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'

import type { Translator } from '../../core/i18n/i18n'
import type { InventoryItemEntry, ItemPocket } from '../../core/types/index'
import { parseClampedNumberInput } from '../../core/utils/numberInput'

export function ItemPocketTable({
  expandedItemIndex,
  itemOptions,
  itemById,
  pocket,
  t,
  onExpandedItemIndexChange,
  onRemoveItem,
  onSetItemField,
}: {
  expandedItemIndex: number | null
  itemOptions: ReactNode
  itemById: Map<number, string>
  pocket: ItemPocket
  t: Translator
  onExpandedItemIndexChange: (index: number | null) => void
  onRemoveItem: (index: number) => void
  onSetItemField: (
    index: number,
    field: keyof InventoryItemEntry,
    value: number,
  ) => void
}) {
  return (
    <div className="grid gap-0 overflow-hidden rounded-md border border-black/10 dark:border-white/10">
      <div className="grid grid-cols-[minmax(0,1fr)_5.5rem_2rem] gap-2 border-b border-black/10 bg-black/5 px-3 py-2 text-xs font-bold dark:border-white/10 dark:bg-white/5">
        <span>{t('item')}</span>
        <span className="text-center">{t('count')}</span>
        <span />
      </div>
      <div className="max-h-64 overflow-auto">
        {pocket.items.length === 0 ? (
          <p className="px-3 py-4 text-center text-sm text-stone-500 dark:text-stone-400">
            {t('noItems')}
          </p>
        ) : (
          pocket.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[minmax(0,1fr)_5.5rem_2rem] items-center gap-2 border-b border-black/5 px-3 py-1.5 last:border-0 dark:border-white/5"
            >
              <select
                className="field h-8 py-0 text-sm"
                value={item.itemId}
                onBlur={() => onExpandedItemIndexChange(null)}
                onChange={(event) =>
                  onSetItemField(index, 'itemId', Number(event.target.value))
                }
                onFocus={() => onExpandedItemIndexChange(index)}
              >
                {expandedItemIndex === index ? (
                  <>
                    {!itemById.has(item.itemId) && (
                      <option value={item.itemId}>#{item.itemId}</option>
                    )}
                    {itemOptions}
                  </>
                ) : (
                  <option value={item.itemId}>
                    {itemById.get(item.itemId) ?? `#${item.itemId}`}
                  </option>
                )}
              </select>
              <input
                className="field h-8 py-0 text-center text-sm"
                max={pocket.maxCount}
                min={0}
                type="number"
                value={item.count}
                onChange={(event) =>
                  onSetItemField(
                    index,
                    'count',
                    parseClampedNumberInput(event.target.value, {
                      max: pocket.maxCount,
                      min: 0,
                    }),
                  )
                }
              />
              <button
                aria-label={t('removeItem')}
                className="btn h-8 w-8 p-0 text-stone-500 hover:text-rose-500"
                type="button"
                onClick={() => onRemoveItem(index)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
