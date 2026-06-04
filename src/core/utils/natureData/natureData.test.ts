import { describe, expect, it } from 'vitest'

import { natureModifier, type StatKey } from './natureData'

describe('natureModifier', () => {
  it('returns null when upStat is null', () => {
    expect(natureModifier(null, 0)).toBeNull()
  })

  it('returns null when downStat is null', () => {
    expect(natureModifier(0, null)).toBeNull()
  })

  it('returns null when upStat is undefined', () => {
    expect(natureModifier(undefined, 0)).toBeNull()
  })

  it('returns null when downStat is undefined', () => {
    expect(natureModifier(0, undefined)).toBeNull()
  })

  it('returns null when upStat is out of range (no entry in AMP_STAT_KEYS)', () => {
    expect(natureModifier(99, 0)).toBeNull()
  })

  it('returns null when downStat is out of range', () => {
    expect(natureModifier(0, 99)).toBeNull()
  })

  it('resolves up=0 (atk) and down=1 (def)', () => {
    expect(natureModifier(0, 1)).toEqual<{ up: StatKey; down: StatKey }>({
      up: 'atk',
      down: 'def',
    })
  })

  it('resolves up=2 (spe) and down=4 (spd)', () => {
    expect(natureModifier(2, 4)).toEqual({ up: 'spe', down: 'spd' })
  })

  it('resolves up=3 (spa) and down=1 (def)', () => {
    expect(natureModifier(3, 1)).toEqual({ up: 'spa', down: 'def' })
  })
})
