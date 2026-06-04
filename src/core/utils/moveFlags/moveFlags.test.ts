import { describe, expect, it } from 'vitest'

import type { MoveDetail } from '../../types/index/index'
import { getActiveFlags } from './moveFlags'

const detail = (
  overrides: Partial<MoveDetail['current']['interactions']> = {},
): MoveDetail =>
  ({
    current: {
      interactions: {
        protectDetect: 'not-flagged',
        substitute: 'hits-substitute',
        contact: false,
        magicCoat: false,
        mirrorMove: false,
        snatch: false,
        sound: false,
        punch: false,
        slicing: false,
        wind: false,
        dance: false,
        heal: false,
        charge: false,
        recharge: false,
        defrost: false,
        gravity: false,
        powder: false,
        pulse: false,
        bite: false,
        bullet: false,
        ...overrides,
      },
    },
  }) as unknown as MoveDetail

describe('getActiveFlags', () => {
  it('returns an empty array when no interactions are active', () => {
    expect(getActiveFlags(detail())).toEqual([])
  })

  it('flags protect when protectDetect is "blocked"', () => {
    const flags = getActiveFlags(detail({ protectDetect: 'blocked' }))
    expect(flags.some((f) => f.flag === 'protect')).toBe(true)
  })

  it('flags authentic when substitute is "bypasses-substitute"', () => {
    const flags = getActiveFlags(detail({ substitute: 'bypasses-substitute' }))
    expect(flags.some((f) => f.flag === 'authentic')).toBe(true)
  })

  it('does NOT flag authentic for non-bypass substitute values', () => {
    const flags = getActiveFlags(detail({ substitute: 'hits-substitute' }))
    expect(flags.some((f) => f.flag === 'authentic')).toBe(false)
  })

  it('flags contact when contact is true', () => {
    expect(getActiveFlags(detail({ contact: true })).some((f) => f.flag === 'contact')).toBe(true)
  })

  it('flags reflectable, mirror, snatch from their respective booleans', () => {
    const flags = getActiveFlags(
      detail({ magicCoat: true, mirrorMove: true, snatch: true }),
    )
    expect(flags.some((f) => f.flag === 'reflectable')).toBe(true)
    expect(flags.some((f) => f.flag === 'mirror')).toBe(true)
    expect(flags.some((f) => f.flag === 'snatch')).toBe(true)
  })

  it('flags the 13 generic move flags (those present in MOVE_FLAGS) when set to true', () => {
    const flags = getActiveFlags(
      detail({
        sound: true,
        punch: true,
        slicing: true,
        wind: true,
        dance: true,
        heal: true,
        charge: true,
        recharge: true,
        defrost: true,
        gravity: true,
        powder: true,
        pulse: true,
        bite: true,
        bullet: true,
      }),
    )
    for (const f of ['sound', 'punch', 'slicing', 'wind', 'dance', 'heal', 'charge',
      'recharge', 'defrost', 'gravity', 'powder', 'pulse', 'bite'] as const) {
      expect(flags.some((flag) => flag.flag === f)).toBe(true)
    }
  })

  it('ignores the generic flags when they are false', () => {
    const flags = getActiveFlags(detail())
    for (const f of ['sound', 'punch', 'slicing']) {
      expect(flags.some((flag) => flag.flag === f)).toBe(false)
    }
  })
})
