import { ChevronLeft, ChevronRight, Package } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { BoxSummary, CatalogEntry } from '../../../core/types/index/index'
import { getDenseSlotGridColumnCount, SlotGrid } from '../../common/SlotGrid/SlotGrid'

type Props = {
  boxIndex: number
  boxes: BoxSummary[]
  currentBox: BoxSummary | undefined
  heldItemsSupported: boolean
  itemCatalog: CatalogEntry[]
  selectedSlotId: string | null
  t: Translator
  onBoxChange: (index: number) => void
  onSelectSlot: (slotId: string) => void
}

export function WorkspaceBoxPanel({
  boxIndex,
  boxes,
  currentBox,
  heldItemsSupported,
  itemCatalog,
  onBoxChange,
  onSelectSlot,
  selectedSlotId,
  t,
}: Props) {
  const [showHeldItems, setShowHeldItems] = useState(false)
  const boxSlots = currentBox?.slots ?? []
  const boxColumnCount = getDenseSlotGridColumnCount(boxSlots.length)
  const boxMaxWidthRem = (boxColumnCount / 6) * 28

  const previousBox = useCallback(
    () => onBoxChange(boxIndex <= 0 ? boxes.length - 1 : boxIndex - 1),
    [boxIndex, boxes.length, onBoxChange],
  )
  const nextBox = useCallback(
    () => onBoxChange(boxIndex >= boxes.length - 1 ? 0 : boxIndex + 1),
    [boxIndex, boxes.length, onBoxChange],
  )

  useEffect(() => {
    if (!boxes.length) return
    const handler = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      const target = event.target as HTMLElement | null
      if (target) {
        const tag = target.tagName
        if (
          tag === 'INPUT' ||
          tag === 'TEXTAREA' ||
          tag === 'SELECT' ||
          target.isContentEditable
        )
          return
      }
      event.preventDefault()
      if (event.key === 'ArrowLeft') previousBox()
      else nextBox()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [boxes.length, nextBox, previousBox])

  return (
    <div className="mt-5">
      <div className="mb-4 flex items-center gap-2">
        <button
          aria-label={t('previousBox')}
          className="btn px-2"
          disabled={!boxes.length}
          type="button"
          onClick={previousBox}
        >
          <ChevronLeft size={18} />
        </button>
        <select
          className="field min-h-10 w-1/2"
          value={boxIndex}
          onChange={(event) => onBoxChange(Number(event.target.value))}
        >
          {boxes.map((box) => (
            <option key={box.boxIndex} value={box.boxIndex}>
              {box.name}
            </option>
          ))}
        </select>
        <button
          aria-label={t('nextBox')}
          className="btn px-2"
          disabled={!boxes.length}
          type="button"
          onClick={nextBox}
        >
          <ChevronRight size={18} />
        </button>
        {heldItemsSupported && (
          <button
            aria-label={t('toggleHeldItems')}
            aria-pressed={showHeldItems}
            className={`flex h-10 min-h-10 items-center justify-center rounded-md border px-2 transition ${
              showHeldItems
                ? 'border-lagoon/60 bg-lagoon/20 text-lagoon dark:bg-lagoon/20'
                : 'border-black/10 bg-white/80 text-stone-400 hover:border-stone-400 hover:text-stone-600 dark:border-white/10 dark:bg-white/10 dark:text-stone-500 dark:hover:text-stone-300'
            }`}
            type="button"
            onClick={() => setShowHeldItems((v) => !v)}
          >
            <Package size={18} />
          </button>
        )}
      </div>
      <div
        className="mx-auto rounded-md bg-stone-300/60 p-2 dark:bg-stone-900/70"
        style={{ maxWidth: `${boxMaxWidthRem}rem` }}
      >
        <SlotGrid
          dense
          heldItemsSupported={heldItemsSupported}
          itemCatalog={itemCatalog}
          showHeldItems={showHeldItems && heldItemsSupported}
          slots={boxSlots}
          selectedSlotId={selectedSlotId}
          t={t}
          onSelect={onSelectSlot}
        />
      </div>
    </div>
  )
}
