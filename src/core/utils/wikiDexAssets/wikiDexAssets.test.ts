import { describe, expect, it } from 'vitest'

import { createItemImageResolver, getHeldItemImageUrl } from './wikiDexAssets'

describe('createItemImageResolver', () => {
  it('maps save-native Gen 1-3 item IDs to their Gen 4+ sprite', () => {
    // Gen 2: #5 = Poké Ball (Gen 4+ #4), #18 = Potion (Gen 4+ #17)
    const resolve = createItemImageResolver([
      { id: 5, name: 'Poké Ball', spriteId: 4 },
      { id: 18, name: 'Potion', spriteId: 17 },
    ])

    expect(resolve(5)).toBe(getHeldItemImageUrl(4))
    expect(resolve(18)).toBe(getHeldItemImageUrl(17))
    expect(resolve(5)).not.toBe(getHeldItemImageUrl(5))
  })

  it('shows no icon for items without a Gen 4+ equivalent', () => {
    const resolve = createItemImageResolver([
      { id: 20, name: 'Potion', spriteId: null },
    ])

    expect(resolve(20)).toBeUndefined()
  })

  it('uses the ID itself for global catalogs without spriteId', () => {
    const resolve = createItemImageResolver([{ id: 17, name: 'Potion' }])

    expect(resolve(17)).toBe(getHeldItemImageUrl(17))
    expect(resolve(4)).toBe(getHeldItemImageUrl(4))
  })
})
