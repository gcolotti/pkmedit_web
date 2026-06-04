export type InventoryItemEntry = {
  itemId: number
  count: number
}

export type ItemPocket = {
  pocketKey: string
  pocketName: string
  maxCount: number
  maxSlots: number
  items: InventoryItemEntry[]
  legalItemIds: number[]
}

export type ItemBag = {
  pockets: ItemPocket[]
}
