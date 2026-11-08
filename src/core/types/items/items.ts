export type InventoryItemEntry = {
  itemId: number
  count: number
}

// Items whose max differs from the pocket maxCount (HMs, Z-Ring, Mega Shard...).
export type ItemMaxCount = {
  itemId: number
  maxCount: number
}

export type ItemPocket = {
  pocketKey: string
  pocketName: string
  maxCount: number
  maxSlots: number
  items: InventoryItemEntry[]
  legalItemIds: number[]
  // Optional: older backends don't send per-item maxima.
  itemMaxCounts?: ItemMaxCount[]
}

export type ItemBag = {
  pockets: ItemPocket[]
}
