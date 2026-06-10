import { describe, expect, it } from 'vitest'

import {
  extractSecondaryEffect,
  formatStructuredSecondaryEffects,
  getSourceUrls,
} from './moveParsers'

describe('formatStructuredSecondaryEffects', () => {
  it('returns an empty array when items is undefined', () => {
    expect(formatStructuredSecondaryEffects(undefined, 'en')).toEqual([])
  })

  it('returns an empty array when items is empty', () => {
    expect(formatStructuredSecondaryEffects([], 'en')).toEqual([])
  })

  it('formats a status secondary effect with capitalized status label', () => {
    const result = formatStructuredSecondaryEffects(
      [{ kind: 'status', status: 'brn', chance: 10 }],
      'en',
    )
    expect(result).toEqual([{ chance: '10%', effect: 'Burn the target' }])
  })

  it('formats a volatile secondary effect', () => {
    const result = formatStructuredSecondaryEffects(
      [{ kind: 'volatile', effect: 'flinch', chance: 20 }],
      'en',
    )
    expect(result).toEqual([
      { chance: '20%', effect: 'Make the target flinch' },
    ])
  })

  it('formats a stat-lowering effect in en (plural for |stages| > 1)', () => {
    const result = formatStructuredSecondaryEffects(
      [{ kind: 'stat', stat: 'attack', stages: -1, chance: 30 }],
      'en',
    )
    expect(result[0].effect).toBe('Lower Attack by 1 stage')
  })

  it('formats a stat-lowering effect in en (singular vs plural)', () => {
    const result = formatStructuredSecondaryEffects(
      [{ kind: 'stat', stat: 'defense', stages: -2, chance: 30 }],
      'en',
    )
    expect(result[0].effect).toBe('Lower Defense by 2 stages')
  })

  it('formats a stat-raising effect in en', () => {
    const result = formatStructuredSecondaryEffects(
      [{ kind: 'stat', stat: 'speed', stages: 1, chance: 50 }],
      'en',
    )
    expect(result[0].effect).toBe('Raise Speed by 1 stage')
  })

  it('formats a stat-raising effect in en with plural', () => {
    const result = formatStructuredSecondaryEffects(
      [{ kind: 'stat', stat: 'speed', stages: 2, chance: 50 }],
      'en',
    )
    expect(result[0].effect).toBe('Raise Speed by 2 stages')
  })

  it('formats a stat-lowering effect in es (singular)', () => {
    const result = formatStructuredSecondaryEffects(
      [{ kind: 'stat', stat: 'attack', stages: -1, chance: 30 }],
      'es',
    )
    expect(result[0].effect).toBe('Baja el Ataque 1 nivel')
  })

  it('formats a stat-lowering effect in es (plural)', () => {
    const result = formatStructuredSecondaryEffects(
      [{ kind: 'stat', stat: 'defense', stages: -2, chance: 30 }],
      'es',
    )
    expect(result[0].effect).toBe('Baja la Defensa 2 niveles')
  })

  it('formats a stat-raising effect in es (singular and plural)', () => {
    expect(
      formatStructuredSecondaryEffects(
        [{ kind: 'stat', stat: 'speed', stages: 1, chance: 50 }],
        'es',
      )[0].effect,
    ).toBe('Sube la Velocidad 1 nivel')
    expect(
      formatStructuredSecondaryEffects(
        [{ kind: 'stat', stat: 'speed', stages: 2, chance: 50 }],
        'es',
      )[0].effect,
    ).toBe('Sube la Velocidad 2 niveles')
  })

  it('falls back to statLabel when stages is 0', () => {
    const result = formatStructuredSecondaryEffects(
      [{ kind: 'stat', stat: 'attack', stages: 0, chance: 10 }],
      'en',
    )
    expect(result[0].effect).toBe('Attack')
  })

  it('falls back to humanized slug for unknown kind', () => {
    const result = formatStructuredSecondaryEffects(
      [{ kind: 'weird', effect: 'foo-bar', chance: '10' }],
      'en',
    )
    expect(result[0].effect).toBe('Foo Bar')
  })

  it('falls back to humanized kind when kind is provided but effect is missing', () => {
    const result = formatStructuredSecondaryEffects(
      [{ kind: 'weird-thing', chance: 10 }],
      'en',
    )
    expect(result[0].effect).toBe('Weird Thing')
  })

  it('falls back to the literal "effect" when both kind and effect are missing', () => {
    const result = formatStructuredSecondaryEffects([{ chance: 10 }], 'en')
    expect(result[0].effect).toBe('Effect')
  })

  it('preserves chance value (number) in result', () => {
    const result = formatStructuredSecondaryEffects(
      [{ kind: 'status', status: 'par', chance: 100 }],
      'en',
    )
    expect(result[0].chance).toBe('100%')
  })

  it('preserves chance value that already ends with %', () => {
    const result = formatStructuredSecondaryEffects(
      [{ kind: 'status', status: 'par', chance: '10%' }],
      'en',
    )
    expect(result[0].chance).toBe('10%')
  })

  it('returns "-" for empty/non-string/non-number chance', () => {
    expect(
      formatStructuredSecondaryEffects(
        [{ kind: 'status', status: 'par', chance: null }],
        'en',
      )[0].chance,
    ).toBe('-')
    expect(
      formatStructuredSecondaryEffects(
        [{ kind: 'status', status: 'par', chance: '' }],
        'en',
      )[0].chance,
    ).toBe('-')
  })
})

describe('getSourceUrls', () => {
  it('returns null values when detail is null', () => {
    expect(getSourceUrls(null)).toEqual({ wikidex: null, bulbapedia: null })
  })

  it('returns null values when detail is undefined', () => {
    expect(getSourceUrls(undefined)).toEqual({
      wikidex: null,
      bulbapedia: null,
    })
  })

  it('returns nulls when urls are missing from detail', () => {
    expect(getSourceUrls({} as never)).toEqual({
      wikidex: null,
      bulbapedia: null,
    })
  })

  it('returns the urls when present', () => {
    expect(
      getSourceUrls({ urls: { wikidex: 'w', bulbapedia: 'b' } } as never),
    ).toEqual({ wikidex: 'w', bulbapedia: 'b' })
  })

  it('returns null for missing url entries', () => {
    expect(getSourceUrls({ urls: { wikidex: 'w' } } as never)).toEqual({
      wikidex: 'w',
      bulbapedia: null,
    })
  })
})

describe('extractSecondaryEffect', () => {
  it('returns null when no pattern matches', () => {
    expect(extractSecondaryEffect('Some unrelated text')).toBeNull()
  })

  it('extracts English "X% chance to Y"', () => {
    const result = extractSecondaryEffect(
      'Has a 30% chance to flinch the target.',
    )
    expect(result).toEqual({ chance: '30%', effect: 'Flinch the target' })
  })

  it('extracts "X% chance to Y" without article', () => {
    expect(extractSecondaryEffect('10% chance to burn')!.effect).toBe('Burn')
  })

  it('extracts Spanish "probabilidad del X% de Y"', () => {
    expect(
      extractSecondaryEffect('Probabilidad del 20% de confundir al objetivo'),
    ).toEqual({
      chance: '20%',
      effect: 'Confundir al objetivo',
    })
  })

  it('extracts Spanish "X% de probabilidad de Y"', () => {
    expect(
      extractSecondaryEffect('50% de probabilidad de envenenar al objetivo'),
    ).toEqual({
      chance: '50%',
      effect: 'Envenenar al objetivo',
    })
  })

  it('extracts Spanish "tiene X% de Y"', () => {
    expect(
      extractSecondaryEffect('Tiene un 30% de bajar el ataque')!.effect,
    ).toBe('Bajar el ataque')
  })

  it('handles decimal percentages', () => {
    expect(extractSecondaryEffect('Has 12.5% chance to confuse')!.chance).toBe(
      '12.5%',
    )
  })

  it('handles comma as decimal separator', () => {
    expect(extractSecondaryEffect('Tiene 12,5% de confundir')!.chance).toBe(
      '12.5%',
    )
  })

  it('normalizes whitespace and trims', () => {
    expect(
      extractSecondaryEffect('  Has  20%   chance   to  burn  ')!.chance,
    ).toBe('20%')
  })

  it('stops at the first sentence boundary', () => {
    expect(
      extractSecondaryEffect(
        'Has 20% chance to burn. Also 30% chance to flinch.',
      )!.effect,
    ).toBe('Burn')
  })
})
