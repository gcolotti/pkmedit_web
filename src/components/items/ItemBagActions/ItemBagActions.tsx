import { Zap } from 'lucide-react'

import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { CatalogEntry } from '../../../core/types/index/index'
import { parseClampedNumberInput } from '../../../core/utils/numberInput/numberInput'
import { CatalogSearchCombobox } from '../../ui/catalog-select/CatalogSearchCombobox/CatalogSearchCombobox'

export function ItemBagActions({
  addEntries,
  canAdd,
  canGiveAll,
  getItemImageUrl,
  giveAllCount,
  maxCount,
  t,
  onAddItem,
  onGiveAll,
  onGiveAllCountChange,
}: {
  // Items the pocket accepts; picking one adds it at its max count.
  addEntries: CatalogEntry[]
  canAdd: boolean
  canGiveAll: boolean
  getItemImageUrl: (id: number) => string | undefined
  giveAllCount: number
  maxCount: number
  t: Translator
  onAddItem: (itemId: number) => void
  onGiveAll: () => void
  onGiveAllCountChange: (value: number) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="min-w-48 flex-1">
        <CatalogSearchCombobox
          hideLabel
          clearValue={0}
          disabled={!canAdd}
          emptyLabel={t('addItemSearch')}
          entries={addEntries}
          getImageUrl={getItemImageUrl}
          id="item-add"
          label={t('addItem')}
          t={t}
          value={0}
          onChange={onAddItem}
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <input
          className="field w-20 py-1.5 text-center text-sm"
          max={maxCount}
          min={1}
          type="number"
          value={giveAllCount}
          onChange={(event) =>
            onGiveAllCountChange(
              parseClampedNumberInput(event.target.value, {
                max: maxCount,
                min: 1,
              }),
            )
          }
        />
        <button
          className="btn text-sm"
          disabled={!canGiveAll}
          type="button"
          onClick={onGiveAll}
        >
          <Zap size={14} />
          {t('giveAll')}
        </button>
      </div>
    </div>
  )
}
