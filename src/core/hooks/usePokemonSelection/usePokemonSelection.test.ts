import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useDraftStore } from '../../state/draftStore/draftStore'
import type { LegalityReport, PokemonDetail } from '../../types/index/index'
import { usePokemonSelection } from './usePokemonSelection'

const oldReport: LegalityReport = {
  slotId: 'a',
  legal: false,
  severity: 'error',
  report: '',
  checks: [
    {
      identifier: 'PID',
      severity: 'error',
      code: 'old',
      valid: false,
      message: 'old issue',
    },
  ],
}

const newReport: LegalityReport = {
  slotId: 'a',
  legal: false,
  severity: 'error',
  report: '',
  checks: [
    {
      identifier: 'Met',
      severity: 'error',
      code: 'new',
      valid: false,
      message: 'new issue',
    },
  ],
}

function makeDetail(overrides: Partial<PokemonDetail> = {}): PokemonDetail {
  return {
    cosmetic: {
      alpha: false,
      height: 0,
      weight: 0,
      scale: 0,
      contest: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      markings: [],
      ribbons: [],
      homeTracker: 0,
      formArgument: 0,
      formArgumentRemain: 0,
      formArgumentElapsed: 0,
      formArgumentMaximum: 0,
      extraBytes: [],
    },
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
    legality: oldReport,
    main: {
      nickname: 'Old',
      pid: 1,
      encryptionConstant: 2,
      isNicknamed: true,
      exp: 0,
      gender: 0,
      language: 2,
      statNature: 0,
      pokerusStrain: 0,
      pokerusDays: 0,
      infected: false,
      cured: false,
    },
    moves: [],
    origin: {},
    plusMoves: [],
    summary: {
      slotId: 'a',
      present: true,
      species: 25,
      speciesName: 'Pikachu',
      form: 0,
      level: 5,
      shiny: false,
      gender: 0,
      nature: 0,
      ability: 1,
      abilityNumber: 0,
      heldItem: 0,
      ball: 4,
      legal: false,
      alpha: false,
      egg: false,
      hasItem: false,
      legalSeverity: 'error',
    },
    trainer: {},
    ...overrides,
  } as unknown as PokemonDetail
}

function renderSelection(api: { previewPokemonUpdate: ReturnType<typeof vi.fn> }) {
  return renderHook(() =>
    usePokemonSelection(
      api as never,
      { sessionId: 'ses-1' },
      'a',
      vi.fn(),
      vi.fn(),
      useDraftStore.getState().setPokemonLegality,
    ),
  )
}

describe('usePokemonSelection legality recheck', () => {
  beforeEach(() => {
    useDraftStore.getState().resetDrafts()
    useDraftStore.setState({
      baseDetails: { a: makeDetail() },
      pokemonDrafts: { a: makeDetail() },
    })
  })

  it('stores a new full legality report even when legal and severity do not change', async () => {
    const api = {
      previewPokemonUpdate: vi.fn().mockResolvedValue(
        makeDetail({
          legality: newReport,
          summary: { ...makeDetail().summary, legal: false, legalSeverity: 'error' },
        }),
      ),
    }
    const { result } = renderSelection(api)

    await act(async () => {
      await result.current.recheckSelectedLegality()
    })

    expect(useDraftStore.getState().pokemonLegality.a.report).toEqual(newReport)
    expect(useDraftStore.getState().pokemonDrafts.a.legality).toEqual(oldReport)
  })

  it('ignores an in-flight recheck response when the draft input changes', async () => {
    let resolvePreview: (detail: PokemonDetail) => void = () => {}
    const api = {
      previewPokemonUpdate: vi.fn(
        () =>
          new Promise<PokemonDetail>((resolve) => {
            resolvePreview = resolve
          }),
      ),
    }
    const { result } = renderSelection(api)

    const pending = act(async () => {
      await result.current.recheckSelectedLegality()
    })
    await waitFor(() =>
      expect(useDraftStore.getState().pokemonLegality.a.status).toBe(
        'checking',
      ),
    )

    act(() => {
      result.current.setDraft((current) =>
        current
          ? {
              ...current,
              main: { ...current.main, nickname: 'Changed' },
            }
          : current,
      )
    })
    resolvePreview(makeDetail({ legality: newReport }))
    await pending

    expect(useDraftStore.getState().pokemonLegality.a.report).toEqual(oldReport)
    expect(useDraftStore.getState().pokemonLegality.a.status).toBe('stale')
  })
})
