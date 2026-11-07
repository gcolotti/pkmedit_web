import { describe, expect, it } from 'vitest'

import type { PokemonDetail } from '../../types/index/index'
import type { PokemonRibbon } from '../../types/pokemon/pokemon'
import {
  getRibbonIdFromPath,
  readComparableValue,
  revertRibbon,
  toComparableRibbons,
} from './draftRibbons'

const kalos: PokemonRibbon = { id: 0, name: 'Kalos Champion', value: true }
const g3: PokemonRibbon = {
  id: 1,
  name: 'Champion (Gen3)',
  value: true,
  obtainable: false,
}
const cool: PokemonRibbon = {
  id: 94,
  name: 'Cool',
  value: true,
  count: 3,
  maxCount: 4,
}

const detail = (ribbons: PokemonRibbon[]) =>
  ({ cosmetic: { ribbons } }) as unknown as PokemonDetail

describe('toComparableRibbons', () => {
  it('keys held ribbons by id and drops the rest', () => {
    expect(toComparableRibbons([kalos, { ...g3, value: false }, cool])).toEqual(
      { '0': { value: true }, '94': { value: true, count: 3 } },
    )
  })

  it('treats a missing list as no ribbons', () => {
    expect(toComparableRibbons()).toEqual({})
  })
})

describe('getRibbonIdFromPath', () => {
  it('reads the id from ribbon value/count paths only', () => {
    expect(getRibbonIdFromPath('cosmetic.ribbons.94.count')).toBe(94)
    expect(getRibbonIdFromPath('cosmetic.ribbons.94.name')).toBeUndefined()
    expect(getRibbonIdFromPath('main.nickname')).toBeUndefined()
  })
})

describe('readComparableValue', () => {
  it('defaults missing ribbon paths to not held', () => {
    expect(readComparableValue({}, 'cosmetic.ribbons.1.value')).toBe(false)
    expect(readComparableValue({}, 'cosmetic.ribbons.94.count')).toBe(0)
    expect(readComparableValue({}, 'main.nickname')).toBeUndefined()
    expect(readComparableValue({ 'main.level': 5 }, 'main.level')).toBe(5)
  })
})

describe('revertRibbon', () => {
  it('restores flag and count from the base', () => {
    const draft = detail([{ ...cool, value: false, count: 0 }])
    expect(revertRibbon(detail([cool]), draft, 94).cosmetic.ribbons).toEqual([
      cool,
    ])
  })

  it('puts back a ribbon the draft list no longer has', () => {
    const draft = detail([kalos])
    expect(
      revertRibbon(detail([kalos, g3]), draft, 1).cosmetic.ribbons,
    ).toEqual([kalos, g3])
  })

  it('clears a ribbon the base did not hold', () => {
    const draft = detail([kalos, cool])
    expect(revertRibbon(detail([]), draft, 0).cosmetic.ribbons).toEqual([
      { ...kalos, value: false, count: undefined },
      cool,
    ])
    expect(revertRibbon(detail([]), draft, 94).cosmetic.ribbons).toEqual([
      kalos,
      { ...cool, value: false, count: 0 },
    ])
  })

  it('leaves the draft alone when neither side lists the ribbon', () => {
    const draft = detail([kalos])
    expect(revertRibbon(detail([]), draft, 5)).toBe(draft)
  })
})
