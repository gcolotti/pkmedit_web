import { describe, expect, it } from 'vitest'

import type { PokemonDetail } from '../../types/index/index'
import {
  buildDraftChangeList,
  buildDraftRequests,
  hasPokemonChanged,
  mergeDraftSummary,
} from './draftChanges'

const base = (overrides: Partial<PokemonDetail> = {}): PokemonDetail =>
  ({
    cosmetic: { alpha: false },
    evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    hyperTrainedIvs: {
      hp: false,
      atk: false,
      def: false,
      spa: false,
      spd: false,
      spe: false,
    },
    ivs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    main: { nickname: '' },
    moves: [],
    origin: {},
    plusMoves: [],
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
    trainer: {},
    ...overrides,
  }) as unknown as PokemonDetail

describe('hasPokemonChanged', () => {
  it('returns false when base is undefined', () => {
    expect(hasPokemonChanged(undefined, base())).toBe(false)
  })

  it('returns false when draft is undefined', () => {
    expect(hasPokemonChanged(base(), undefined)).toBe(false)
  })

  it('returns false for identical payloads', () => {
    expect(hasPokemonChanged(base(), base())).toBe(false)
  })

  it('returns true when draft differs from base', () => {
    expect(
      hasPokemonChanged(base(), base({ main: { nickname: 'New' } as never })),
    ).toBe(true)
  })
})

describe('buildDraftRequests', () => {
  it('returns an empty list when no drafts are given', () => {
    expect(buildDraftRequests({}, {})).toEqual([])
  })

  it('skips drafts that match their base (no actual change)', () => {
    const detail = base()
    expect(buildDraftRequests({ a: detail }, { a: detail })).toEqual([])
  })

  it('emits a pokemon change for a single modified draft', () => {
    const b = base()
    const d = base({ main: { nickname: 'X' } as never })
    const result = buildDraftRequests({ a: b }, { a: d })
    expect(result).toHaveLength(1)
    expect(result[0]?.slotId).toBe('a')
    expect((result[0] as { pokemon?: unknown }).pokemon).toBeDefined()
  })

  it('sends both replacement and pokemon when a replacement is provided', () => {
    const b = base()
    const d = base({ main: { nickname: 'X' } as never })
    const result = buildDraftRequests(
      { a: b },
      { a: d },
      {
        a: { dataBase64: 'AA==' },
      },
    )
    expect(result).toHaveLength(1)
    expect(result[0]?.slotId).toBe('a')
    expect(result[0]?.replacement).toEqual({ dataBase64: 'AA==' })
    // The field payload rides along so edits made after applying an
    // encounter survive the export (the backend applies it on top of the
    // replacement bytes).
    const pokemon = result[0]?.pokemon as { main?: { nickname?: string } }
    expect(pokemon?.main?.nickname).toBe('X')
  })
})

describe('buildDraftChangeList', () => {
  const t = (key: string) => key

  it('returns an empty list when no drafts are present', () => {
    expect(buildDraftChangeList({}, {}, t)).toEqual([])
  })

  it('returns an empty list when drafts match their base', () => {
    const detail = base()
    expect(buildDraftChangeList({ a: detail }, { a: detail }, t)).toEqual([])
  })

  it('returns a list with the changed path labeled with the species name', () => {
    const b = base()
    const d = base({ main: { nickname: 'X' } as never })
    const result = buildDraftChangeList({ a: b }, { a: d }, t)
    expect(result.length).toBeGreaterThan(0)
    const nicknameChange = result.find((c) => c.path === 'main.nickname')
    expect(nicknameChange?.label).toContain(' -')
  })

  it('skips drafts whose slot has no base detail', () => {
    const d = base()
    expect(buildDraftChangeList({}, { a: d }, t)).toEqual([])
  })
})

describe('mergeDraftSummary', () => {
  it('returns the original slot when there is no draft', () => {
    const slot = { slotId: 'a', alpha: false } as never
    expect(mergeDraftSummary(slot, {})).toBe(slot)
  })

  it('overlays the draft summary and alpha when there is a draft', () => {
    const slot = { slotId: 'a', alpha: false, species: 1 } as never
    const draft = base({
      summary: { ...base().summary, slotId: 'a' },
      cosmetic: { alpha: true } as never,
    })
    const merged = mergeDraftSummary(slot, { a: draft })
    expect(merged.slotId).toBe('a')
    expect(merged.alpha).toBe(true)
  })
})
