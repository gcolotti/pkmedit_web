import { describe, expect, it } from 'vitest'

import type { PokemonDetail } from '../../types/index/index'
import { TERA_TYPE_OVERRIDE_NONE } from '../../utils/typeData/typeData'
import { buildPokemonPayload } from './pokemonPayload'

const baseDetail = (overrides: Partial<PokemonDetail> = {}): PokemonDetail =>
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
    main: {},
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

describe('buildPokemonPayload', () => {
  it('flattens top-level summary fields into the payload', () => {
    const payload = buildPokemonPayload(baseDetail())
    expect(payload).toMatchObject({
      species: 1,
      level: 5,
      form: 0,
      shiny: false,
      nature: 0,
      ability: 1,
      abilityNumber: 0,
      heldItem: 0,
      ball: 4,
    })
  })

  it('preserves object-valued fields (cosmetic, evs, ivs, main, moves, origin, plusMoves, trainer, hyperTrainedIvs)', () => {
    const detail = baseDetail({
      cosmetic: { alpha: true } as never,
      evs: { hp: 252, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
      main: { nickname: 'Pikachu' } as never,
      moves: [{ id: 1 }] as never,
    })
    const payload = buildPokemonPayload(detail)
    expect(payload.cosmetic).toEqual({ alpha: true })
    expect(payload.evs).toEqual({ hp: 252, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 })
    expect(payload.ivs).toEqual({ hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 })
    expect(payload.main).toEqual({ nickname: 'Pikachu' })
    expect(payload.moves).toEqual([{ id: 1 }])
  })

  it('omits teraType fields when only one is a number', () => {
    const payload = buildPokemonPayload(
      baseDetail({ teraTypeOriginal: 5, teraTypeOverride: undefined }),
    )
    expect(payload).not.toHaveProperty('teraTypeOriginal')
    expect(payload).not.toHaveProperty('teraTypeOverride')
  })

  it('omits teraType fields when either is negative', () => {
    const payload = buildPokemonPayload(
      baseDetail({ teraTypeOriginal: 5, teraTypeOverride: -1 }),
    )
    expect(payload).not.toHaveProperty('teraTypeOriginal')
    expect(payload).not.toHaveProperty('teraTypeOverride')
  })

  it('includes teraType fields when both are valid non-negative numbers', () => {
    const detail = baseDetail({ teraTypeOriginal: 5, teraTypeOverride: 7 })
    const payload = buildPokemonPayload(detail) as unknown as {
      teraTypeOriginal: number
      teraTypeOverride: number
    }
    expect(payload.teraTypeOriginal).toBe(5)
    expect(payload.teraTypeOverride).toBe(7)
  })

  it('includes teraType fields when both equal TERA_TYPE_OVERRIDE_NONE', () => {
    const detail = baseDetail({ teraTypeOriginal: 0, teraTypeOverride: TERA_TYPE_OVERRIDE_NONE })
    const payload = buildPokemonPayload(detail) as unknown as {
      teraTypeOriginal: number
      teraTypeOverride: number
    }
    expect(payload.teraTypeOriginal).toBe(0)
    expect(payload.teraTypeOverride).toBe(TERA_TYPE_OVERRIDE_NONE)
  })
})
