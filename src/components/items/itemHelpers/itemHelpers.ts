import type { ItemPocket } from '../../../core/types/index/index'

export function getItemMaxCount(pocket: ItemPocket, itemId: number): number {
  return (
    pocket.itemMaxCounts?.find((entry) => entry.itemId === itemId)?.maxCount ??
    pocket.maxCount
  )
}

function clampCount(pocket: ItemPocket, itemId: number, count: number) {
  return Math.max(0, Math.min(count, getItemMaxCount(pocket, itemId)))
}

export function setItemField(
  pocket: ItemPocket,
  itemIndex: number,
  field: 'itemId' | 'count',
  value: number,
): ItemPocket {
  return {
    ...pocket,
    items: pocket.items.map((item, i) => {
      if (i !== itemIndex) return item
      return field === 'count'
        ? { ...item, count: clampCount(pocket, item.itemId, value) }
        : { itemId: value, count: clampCount(pocket, value, item.count) }
    }),
  }
}

// Bag order is saved as-is, so reordering changes the in-game list order.
export function moveItem(
  pocket: ItemPocket,
  itemIndex: number,
  offset: -1 | 1,
): ItemPocket {
  const target = itemIndex + offset
  if (target < 0 || target >= pocket.items.length) return pocket
  const items = [...pocket.items]
  const [moved] = items.splice(itemIndex, 1)
  items.splice(target, 0, moved)
  return { ...pocket, items }
}

export function removeItem(pocket: ItemPocket, itemIndex: number): ItemPocket {
  return {
    ...pocket,
    items: pocket.items.filter((_, i) => i !== itemIndex),
  }
}

// Picked from the add field: new items enter at their max; an item already in
// the pocket is topped up to its max instead of duplicated.
export function addItemAtMax(pocket: ItemPocket, itemId: number): ItemPocket {
  const count = getItemMaxCount(pocket, itemId)
  const exists = pocket.items.some((item) => item.itemId === itemId)
  return {
    ...pocket,
    items: exists
      ? pocket.items.map((item) =>
          item.itemId === itemId ? { ...item, count } : item,
        )
      : [...pocket.items, { itemId, count }],
  }
}

export function giveAllItems(pocket: ItemPocket, count: number): ItemPocket {
  const items = pocket.legalItemIds
    .slice(0, pocket.maxSlots)
    .map((itemId) => ({ itemId, count: clampCount(pocket, itemId, count) }))
  return { ...pocket, items }
}
