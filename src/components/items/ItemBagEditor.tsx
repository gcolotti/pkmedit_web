import { useMemo, useState } from 'react'

import type { Translator } from '../../core/i18n/i18n'
import type {
  CatalogEntry,
  ItemBag,
  ItemPocket,
  SaveSectionStatus,
} from '../../core/types/index'
import { ItemBagActions } from './ItemBagActions'
import {
  addItem as addToPocket,
  giveAllItems,
  removeItem as removeFromPocket,
  setItemField as setInPocket,
} from './itemHelpers'
import { ItemPocketTable } from './ItemPocketTable'
import { ItemPocketTabs } from './ItemPocketTabs'

export function ItemBagEditor({
  current,
  itemCatalog,
  onChange,
  status,
  t,
}: {
  current: ItemBag | null
  itemCatalog: CatalogEntry[]
  onChange: (bag: ItemBag) => void
  status: SaveSectionStatus
  t: Translator
}) {
  const [activePocketIndex, setActivePocketIndex] = useState(0)
  const [expandedItemIndex, setExpandedItemIndex] = useState<number | null>(
    null,
  )
  const [giveAllCount, setGiveAllCount] = useState(999)

  const itemById = useMemo(() => {
    const map = new Map<number, string>()
    for (const entry of itemCatalog) map.set(entry.id, entry.name)
    return map
  }, [itemCatalog])

  if (!current) {
    return (
      <div className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
        {emptyMessage(status, t)}
      </div>
    )
  }

  if (current.pockets.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
        {t('itemsNotAvailable')}
      </div>
    )
  }

  const effectivePocketIndex = current.pockets[activePocketIndex]
    ? activePocketIndex
    : 0
  const pocket = current.pockets[effectivePocketIndex]
  if (!pocket) return null

  const legalItemIds = new Set(pocket.legalItemIds)
  const pocketItemCatalog = itemCatalog.filter((entry) =>
    legalItemIds.has(entry.id),
  )
  const hasUnusedLegalItem = pocketItemCatalog.some(
    (entry) => !pocket.items.some((item) => item.itemId === entry.id),
  )
  const canAdd = pocket.items.length < pocket.maxSlots && hasUnusedLegalItem
  const canGiveAll = pocket.legalItemIds.length > 0
  const itemOptions = pocketItemCatalog.map((entry) => (
    <option key={entry.id} value={entry.id}>
      {entry.name}
    </option>
  ))

  function updatePocket(updater: (pocket: ItemPocket) => ItemPocket) {
    onChange({
      ...current!,
      pockets: current!.pockets.map((p, i) =>
        i === effectivePocketIndex ? updater(p) : p,
      ),
    })
  }

  function setItemField(
    itemIndex: number,
    field: 'itemId' | 'count',
    value: number,
  ) {
    updatePocket((p) => setInPocket(p, itemIndex, field, value))
  }

  function removeItem(itemIndex: number) {
    updatePocket((p) => removeFromPocket(p, itemIndex))
  }

  function addItem() {
    updatePocket((p) => addToPocket(p, pocketItemCatalog))
  }

  function giveAll() {
    updatePocket((p) => giveAllItems(p, giveAllCount))
  }

  return (
    <div className="mt-4 grid gap-4">
      <ItemPocketTabs
        activeIndex={effectivePocketIndex}
        pockets={current.pockets}
        onChange={changePocket}
      />
      <ItemPocketTable
        expandedItemIndex={expandedItemIndex}
        itemById={itemById}
        itemOptions={itemOptions}
        pocket={pocket}
        t={t}
        onExpandedItemIndexChange={setExpandedItemIndex}
        onRemoveItem={removeItem}
        onSetItemField={setItemField}
      />
      <ItemBagActions
        canAdd={canAdd}
        canGiveAll={canGiveAll}
        giveAllCount={giveAllCount}
        maxCount={pocket.maxCount}
        t={t}
        onAddItem={addItem}
        onGiveAll={giveAll}
        onGiveAllCountChange={setGiveAllCount}
      />
    </div>
  )

  function changePocket(index: number) {
    setActivePocketIndex(index)
    setExpandedItemIndex(null)
  }
}

function emptyMessage(status: SaveSectionStatus, t: Translator) {
  if (status === 'loading') return t('saveSectionLoading')
  if (status === 'unavailable') return t('itemsNotAvailable')
  return t('noSaveLoaded')
}
