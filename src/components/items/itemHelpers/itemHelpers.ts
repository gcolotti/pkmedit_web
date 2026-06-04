import type { CatalogEntry, ItemPocket } from '../../../core/types/index/index'

export function setItemField(
  pocket: ItemPocket,
  itemIndex: number,
  field: 'itemId' | 'count',
  value: number,
): ItemPocket {
  return {
    ...pocket,
    items: pocket.items.map((item, i) =>
      i === itemIndex
        ? {
            ...item,
            [field]:
              field === 'count'
                ? Math.max(0, Math.min(value, pocket.maxCount))
                : value,
          }
        : item,
    ),
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
  const maxCount = Math.min(count, pocket.maxCount)
  const items = pocket.legalItemIds
    .slice(0, pocket.maxSlots)
    .map((itemId) => ({ itemId, count: maxCount }))
  return { ...pocket, items }
}
