import { Plus, Zap } from 'lucide-react'

import type { Translator } from '../../../core/i18n/i18n/i18n'
import { parseClampedNumberInput } from '../../../core/utils/numberInput/numberInput'

export function ItemBagActions({
  canAdd,
  canGiveAll,
  giveAllCount,
  maxCount,
  t,
  onAddItem,
  onGiveAll,
  onGiveAllCountChange,
}: {
  canAdd: boolean
  canGiveAll: boolean
  giveAllCount: number
  maxCount: number
  t: Translator
  onAddItem: () => void
  onGiveAll: () => void
  onGiveAllCountChange: (value: number) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        className="btn text-sm"
        disabled={!canAdd}
        type="button"
        onClick={onAddItem}
      >
        <Plus size={14} />
        {t('addItem')}
      </button>
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
