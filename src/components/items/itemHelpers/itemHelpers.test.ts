import { describe, expect, it } from 'vitest'

import type { ItemPocket } from '../../../core/types/index/index'
import { getItemMaxCount, giveAllItems, setItemField } from './itemHelpers'

const TM01 = 191
const HM01 = 243

// Crystal TM/HM pocket: pocket max 99, HMs capped at 1.
function tmhmPocket(overrides: Partial<ItemPocket> = {}): ItemPocket {
  return {
    pocketKey: 'TMHMs',
    pocketName: 'TM/HM',
    maxCount: 99,
    maxSlots: 57,
    items: [{ itemId: TM01, count: 5 }],
    legalItemIds: [TM01, HM01],
    itemMaxCounts: [{ itemId: HM01, maxCount: 1 }],
    ...overrides,
  }
}

describe('getItemMaxCount', () => {
  it('uses the per-item override when present', () => {
    expect(getItemMaxCount(tmhmPocket(), HM01)).toBe(1)
  })

  it('falls back to the pocket max (and for older backends)', () => {
    expect(getItemMaxCount(tmhmPocket(), TM01)).toBe(99)
    expect(
      getItemMaxCount(tmhmPocket({ itemMaxCounts: undefined }), HM01),
    ).toBe(99)
  })
})

describe('setItemField', () => {
  it('clamps counts to the item max', () => {
    const pocket = tmhmPocket({ items: [{ itemId: HM01, count: 1 }] })

    expect(setItemField(pocket, 0, 'count', 99).items[0]).toEqual({
      itemId: HM01,
      count: 1,
    })
  })

  it('re-clamps the count when switching to an item with a lower max', () => {
    expect(setItemField(tmhmPocket(), 0, 'itemId', HM01).items[0]).toEqual({
      itemId: HM01,
      count: 1,
    })
  })
})

describe('giveAllItems', () => {
  it('gives each item up to its own max', () => {
    expect(giveAllItems(tmhmPocket(), 999).items).toEqual([
      { itemId: TM01, count: 99 },
      { itemId: HM01, count: 1 },
    ])
  })
})
