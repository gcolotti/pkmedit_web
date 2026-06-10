import { describe, expect, it } from 'vitest'

import { createTranslator } from '../../i18n/i18n/i18n'
import type { PokemonDetail } from '../../types/index/index'
import { TERA_TYPE_OVERRIDE_NONE } from '../../utils/typeData/typeData'
import { flatten, formatValue, labelPath, revertDraftPath } from './draftPathUtils'

const t = createTranslator('en')

describe('flatten', () => {
  it('flattens a primitive into a single-key map', () => {
    expect(flatten(7)).toEqual({ '': 7 })
  })

  it('flattens a flat object with a top-level prefix', () => {
    expect(flatten({ a: 1, b: 2 }, 'root')).toEqual({ 'root.a': 1, 'root.b': 2 })
  })

  it('flattens nested objects with dotted paths', () => {
    expect(flatten({ a: { b: { c: 1 } } })).toEqual({ 'a.b.c': 1 })
  })

  it('flattens arrays with index segments', () => {
    expect(flatten([10, 20])).toEqual({ '0': 10, '1': 20 })
  })

  it('flattens arrays nested inside objects', () => {
    expect(flatten({ moves: [1, 2] })).toEqual({ 'moves.0': 1, 'moves.1': 2 })
  })

  it('returns a single empty-prefix entry for null/undefined', () => {
    expect(flatten(null)).toEqual({ '': null })
    expect(flatten(undefined)).toEqual({ '': undefined })
  })
})

describe('labelPath', () => {
  it('returns the last segment when no labelMap match', () => {
    expect(labelPath('main.nickname', t)).toBe('nickname')
  })

  it('uses labelMap override when the last segment matches', () => {
    expect(labelPath('main.heldItem', t)).toBe(t('heldItem'))
  })

  it('translates known labels via the translator', () => {
    expect(labelPath('main.teraTypeOriginal', t)).toBe(t('teraTypeOriginal'))
  })

  it('returns the path itself when the last segment is empty', () => {
    expect(labelPath('', t)).toBe('')
  })
})

describe('formatValue', () => {
  it('formats booleans via yes/no', () => {
    expect(formatValue(true, t)).toBe(t('yes'))
    expect(formatValue(false, t)).toBe(t('no'))
  })

  it('formats null / undefined / empty string as blank', () => {
    expect(formatValue(null, t)).toBe(t('blank'))
    expect(formatValue(undefined, t)).toBe(t('blank'))
    expect(formatValue('', t)).toBe(t('blank'))
  })

  it('translates TERA_TYPE_OVERRIDE_NONE as "none"', () => {
    expect(formatValue(TERA_TYPE_OVERRIDE_NONE, t, 'teraTypeOverride')).toBe(t('none'))
  })

  it('formats teraTypeOriginal as the type name for numeric values', () => {
    expect(formatValue(0, t, 'teraTypeOriginal')).toBeTruthy()
    expect(formatValue(0, t, 'teraTypeOverride')).toBeTruthy()
  })

  it('returns numbers and bigints as their string representation', () => {
    expect(formatValue(42, t)).toBe('42')
    expect(formatValue(42n, t)).toBe('42')
  })

  it('returns strings as-is', () => {
    expect(formatValue('hello', t)).toBe('hello')
  })

  it('JSON-stringifies objects/arrays', () => {
    expect(formatValue({ a: 1 }, t)).toBe('{"a":1}')
  })
})

describe('writePath (via revertDraftPath)', () => {
  const makeDetail = (overrides: Partial<PokemonDetail> = {}): PokemonDetail =>
    ({
      summary: {
        species: 1,
        level: 5,
        form: 0,
        shiny: false,
        nature: 0,
        ability: 1,
        abilityNumber: 0,
        heldItem: 0,
        ball: 4,
      },
      teraType: 0,
      teraTypeOriginal: 0,
      teraTypeOverride: 0,
      main: { nickname: 'NewName' } as never,
      moves: [{ id: 1 }] as never,
      ivs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      ...overrides,
    }) as unknown as PokemonDetail

  it('reverts a summary field (species) to the base value', () => {
    const base = makeDetail({ summary: { ...makeDetail().summary, species: 25 } })
    const draft = makeDetail({ summary: { ...makeDetail().summary, species: 100 } })
    const result = revertDraftPath(base, draft, 'species')
    expect(result.summary.species).toBe(25)
  })

  it('reverts a main.nickname nested field', () => {
    const base = makeDetail({ main: { nickname: 'Original' } as never })
    const draft = makeDetail({ main: { nickname: 'Modified' } as never })
    const result = revertDraftPath(base, draft, 'main.nickname')
    expect(result.main.nickname).toBe('Original')
  })

  it('reverts a teraType field and recomputes the teraType aggregate', () => {
    const base = makeDetail({ teraTypeOverride: 7, teraType: 7 })
    const draft = makeDetail({ teraTypeOverride: 0, teraType: 0 })
    const result = revertDraftPath(base, draft, 'teraTypeOverride')
    expect(result.teraTypeOverride).toBe(7)
    expect(result.teraType).toBe(7)
  })

  it('reverts a teraTypeOverride to TERA_TYPE_OVERRIDE_NONE and falls back to teraTypeOriginal', () => {
    const base = makeDetail({
      teraTypeOriginal: 3,
      teraTypeOverride: TERA_TYPE_OVERRIDE_NONE,
      teraType: 3,
    })
    const draft = makeDetail({
      teraTypeOriginal: 3,
      teraTypeOverride: 5,
      teraType: 5,
    })
    const result = revertDraftPath(base, draft, 'teraTypeOverride')
    expect(result.teraTypeOverride).toBe(TERA_TYPE_OVERRIDE_NONE)
    expect(result.teraType).toBe(3)
  })

  it('reverts a nested array slot (moves.0.id)', () => {
    const base = makeDetail({ moves: [{ id: 1 }] as never })
    const draft = makeDetail({ moves: [{ id: 99 }] as never })
    const result = revertDraftPath(base, draft, 'moves.0.id')
    expect((result.moves as unknown as Array<{ id: number }>)[0]?.id).toBe(1)
  })
})

describe('revertDraftPath', () => {
  const makeDetail = (overrides: Partial<PokemonDetail> = {}): PokemonDetail =>
    ({
      summary: {
        species: 1,
        level: 5,
        form: 0,
        shiny: false,
        nature: 0,
        ability: 1,
        abilityNumber: 0,
        heldItem: 0,
        ball: 4,
      },
      main: { nickname: 'NewName' } as never,
      ivs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      moves: [],
      ...overrides,
    }) as unknown as PokemonDetail

  it('reverts a simple summary field to the base value', () => {
    const base = makeDetail({ summary: { ...makeDetail().summary, level: 10 } })
    const draft = makeDetail({ summary: { ...makeDetail().summary, level: 50 } })
    const result = revertDraftPath(base, draft, 'level')
    expect(result.summary.level).toBe(10)
  })

  it('reverts a nested main.nickname', () => {
    const base = makeDetail({ main: { nickname: 'Original' } as never })
    const draft = makeDetail({ main: { nickname: 'Modified' } as never })
    const result = revertDraftPath(base, draft, 'main.nickname')
    expect(result.main.nickname).toBe('Original')
  })

  it('does not mutate the original draft', () => {
    const base = makeDetail({ main: { nickname: 'Original' } as never })
    const draft = makeDetail({ main: { nickname: 'Modified' } as never })
    revertDraftPath(base, draft, 'main.nickname')
    expect(draft.main.nickname).toBe('Modified')
  })
})
