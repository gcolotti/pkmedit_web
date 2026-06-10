import { describe, expect, it } from 'vitest'

import type { LegalityReport } from '../../types/index/index'
import { getIllegalFieldPaths } from './legalityFieldIssues'

const report = (
  checks: {
    valid: boolean
    identifier: string
    code?: string
    message: string
  }[],
): LegalityReport => ({
  slotId: 'slot',
  legal: false,
  severity: 'error',
  report: '',
  checks: checks.map((c) => ({
    valid: c.valid,
    identifier: c.identifier,
    severity: 'error',
    code: c.code ?? '0',
    message: c.message,
  })),
})

describe('getIllegalFieldPaths', () => {
  it('returns an empty Set when report is null', () => {
    expect(getIllegalFieldPaths(null).size).toBe(0)
  })

  it('returns an empty Set when report is legal', () => {
    const r: LegalityReport = {
      slotId: 'slot',
      legal: true,
      severity: 'ok',
      report: '',
      checks: [],
    }
    expect(getIllegalFieldPaths(r).size).toBe(0)
  })

  it('returns an empty Set when no checks are invalid', () => {
    expect(
      getIllegalFieldPaths(
        report([{ valid: true, identifier: 'X', message: 'x' }]),
      ).size,
    ).toBe(0)
  })

  it('flags "species" path when message contains "species" or "form" or "mega"', () => {
    const paths = getIllegalFieldPaths(
      report([{ valid: false, identifier: 'A', message: 'invalid species' }]),
    )
    expect(paths.has('species')).toBe(true)
    expect(paths.has('form')).toBe(true)
  })

  it('flags "level" and "main.exp" paths for level/exp terms', () => {
    const paths = getIllegalFieldPaths(
      report([{ valid: false, identifier: 'A', message: 'level too high' }]),
    )
    expect(paths.has('level')).toBe(true)
    expect(paths.has('main.exp')).toBe(true)
    const paths2 = getIllegalFieldPaths(
      report([
        { valid: false, identifier: 'A', message: 'invalid experience value' },
      ]),
    )
    expect(paths2.has('level')).toBe(true)
  })

  it('flags "shiny", "main.pid", "main.encryptionConstant" for shiny/pid/encryption/xor', () => {
    expect(
      getIllegalFieldPaths(
        report([{ valid: false, identifier: 'A', message: 'shiny mismatch' }]),
      ).has('shiny'),
    ).toBe(true)
    expect(
      getIllegalFieldPaths(
        report([{ valid: false, identifier: 'A', message: 'invalid pid' }]),
      ).has('main.pid'),
    ).toBe(true)
    expect(
      getIllegalFieldPaths(
        report([
          {
            valid: false,
            identifier: 'A',
            message: 'encryption constant wrong',
          },
        ]),
      ).has('main.encryptionConstant'),
    ).toBe(true)
  })

  it('flags nature/mint paths for nature messages', () => {
    const paths = getIllegalFieldPaths(
      report([{ valid: false, identifier: 'A', message: 'invalid nature' }]),
    )
    expect(paths.has('nature')).toBe(true)
    expect(paths.has('main.statNature')).toBe(true)
  })

  it('flags ability path for ability messages', () => {
    const paths = getIllegalFieldPaths(
      report([{ valid: false, identifier: 'A', message: 'invalid ability' }]),
    )
    expect(paths.has('ability')).toBe(true)
    expect(paths.has('abilityNumber')).toBe(true)
  })

  it('flags heldItem path for item/held messages', () => {
    const paths = getIllegalFieldPaths(
      report([{ valid: false, identifier: 'A', message: 'invalid held item' }]),
    )
    expect(paths.has('heldItem')).toBe(true)
  })

  it('flags ball path for ball messages', () => {
    const paths = getIllegalFieldPaths(
      report([{ valid: false, identifier: 'A', message: 'wrong ball' }]),
    )
    expect(paths.has('ball')).toBe(true)
  })

  it('flags ivs path for iv/hyper messages', () => {
    const paths = getIllegalFieldPaths(
      report([{ valid: false, identifier: 'A', message: 'invalid IVs' }]),
    )
    expect(paths.has('ivs')).toBe(true)
    const paths2 = getIllegalFieldPaths(
      report([{ valid: false, identifier: 'A', message: 'hyper trained' }]),
    )
    expect(paths2.has('ivs')).toBe(true)
  })

  it('flags evs path for ev messages', () => {
    const paths = getIllegalFieldPaths(
      report([{ valid: false, identifier: 'A', message: 'invalid EVs' }]),
    )
    expect(paths.has('evs')).toBe(true)
  })

  it('flags moves path for move/relearn/pp messages', () => {
    expect(
      getIllegalFieldPaths(
        report([{ valid: false, identifier: 'A', message: 'invalid move' }]),
      ).has('moves'),
    ).toBe(true)
    expect(
      getIllegalFieldPaths(
        report([
          { valid: false, identifier: 'A', message: 'invalid relearn move' },
        ]),
      ).has('moves'),
    ).toBe(true)
    expect(
      getIllegalFieldPaths(
        report([{ valid: false, identifier: 'A', message: 'invalid PP' }]),
      ).has('moves'),
    ).toBe(true)
  })

  it('flags origin met paths for met/encounter/location/origin/date/version messages', () => {
    for (const msg of [
      'met location invalid',
      'invalid encounter',
      'wrong location',
      'bad origin',
      'wrong date',
      'wrong version',
    ]) {
      const paths = getIllegalFieldPaths(
        report([{ valid: false, identifier: 'A', message: msg }]),
      )
      expect(paths.has('origin.metLevel')).toBe(true)
      expect(paths.has('origin.metLocation')).toBe(true)
    }
  })

  it('flags egg paths for egg/hatch messages', () => {
    expect(
      getIllegalFieldPaths(
        report([
          { valid: false, identifier: 'A', message: 'invalid egg location' },
        ]),
      ).has('origin.eggLocation'),
    ).toBe(true)
    expect(
      getIllegalFieldPaths(
        report([
          { valid: false, identifier: 'A', message: 'invalid hatch date' },
        ]),
      ).has('origin.eggMetDate'),
    ).toBe(true)
  })

  it('flags trainer path for trainer/ot/ht/friendship/handler/language messages', () => {
    expect(
      getIllegalFieldPaths(
        report([{ valid: false, identifier: 'A', message: 'invalid trainer' }]),
      ).has('trainer'),
    ).toBe(true)
    expect(
      getIllegalFieldPaths(
        report([{ valid: false, identifier: 'A', message: 'wrong OT' }]),
      ).has('trainer'),
    ).toBe(true)
    expect(
      getIllegalFieldPaths(
        report([{ valid: false, identifier: 'A', message: 'invalid HT' }]),
      ).has('trainer'),
    ).toBe(true)
    expect(
      getIllegalFieldPaths(
        report([
          { valid: false, identifier: 'A', message: 'friendship too low' },
        ]),
      ).has('trainer'),
    ).toBe(true)
    expect(
      getIllegalFieldPaths(
        report([{ valid: false, identifier: 'A', message: 'wrong handler' }]),
      ).has('trainer'),
    ).toBe(true)
    expect(
      getIllegalFieldPaths(
        report([{ valid: false, identifier: 'A', message: 'wrong language' }]),
      ).has('trainer'),
    ).toBe(true)
  })

  it('flags cosmetic.ribbons for ribbon/mark messages', () => {
    expect(
      getIllegalFieldPaths(
        report([{ valid: false, identifier: 'A', message: 'invalid ribbon' }]),
      ).has('cosmetic.ribbons'),
    ).toBe(true)
    expect(
      getIllegalFieldPaths(
        report([{ valid: false, identifier: 'A', message: 'invalid mark' }]),
      ).has('cosmetic.ribbons'),
    ).toBe(true)
  })

  it('flags cosmetic for height/weight/scale/contest/alpha/home/tracker messages', () => {
    for (const msg of [
      'invalid height',
      'invalid weight',
      'invalid scale',
      'invalid contest',
      'invalid alpha',
      'invalid home tracker',
      'invalid tracker',
    ]) {
      const paths = getIllegalFieldPaths(
        report([{ valid: false, identifier: 'A', message: msg }]),
      )
      expect(paths.has('cosmetic')).toBe(true)
    }
  })

  it('combines paths from multiple invalid checks', () => {
    const paths = getIllegalFieldPaths(
      report([
        { valid: false, identifier: 'A', message: 'invalid species' },
        { valid: false, identifier: 'B', message: 'invalid level' },
      ]),
    )
    expect(paths.has('species')).toBe(true)
    expect(paths.has('level')).toBe(true)
  })
})
