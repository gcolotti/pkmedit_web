import type { CatalogEntry, ItemPocket } from '../../../core/types/index/index'

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

export function removeItem(pocket: ItemPocket, itemIndex: number): ItemPocket {
  return {
    ...pocket,
    items: pocket.items.filter((_, i) => i !== itemIndex),
  }
}

export function addItem(
  pocket: ItemPocket,
  pocketCatalog: CatalogEntry[],
): ItemPocket {
  const unused = pocketCatalog.find(
    (entry) => !pocket.items.some((item) => item.itemId === entry.id),
  )
  return {
    ...pocket,
    items: [
      ...pocket.items,
      {
        itemId: unused?.id ?? pocketCatalog[0]?.id ?? 1,
        count: 1,
      },
    ],
  }
}

export function giveAllItems(pocket: ItemPocket, count: number): ItemPocket {
  const items = pocket.legalItemIds
    .slice(0, pocket.maxSlots)
    .map((itemId) => ({ itemId, count: clampCount(pocket, itemId, count) }))
  return { ...pocket, items }
}
