import { describe, expect, it, vi } from 'vitest'

import type { PokemonDetail } from '../../types/index/index'
import {
  revertWorkspaceChange,
  type RevertWorkspaceChangeCallbacks,
} from './revertWorkspaceChange'

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
    main: { nickname: 'Original' },
    moves: [],
    origin: {},
    plusMoves: [],
    summary: {
      slotId: 'a',
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

const draft = (overrides: Partial<PokemonDetail> = {}): PokemonDetail =>
  base({ main: { nickname: 'Modified' } as never, ...overrides })

const noopCallbacks = (): RevertWorkspaceChangeCallbacks => ({
  revertArceusResearchAction: vi.fn(),
  revertArceusResearchBulk: vi.fn(),
  revertDonutDraft: vi.fn(),
  revertItemsEdit: vi.fn(),
  revertMetDateFixerDraft: vi.fn(),
  revertMysteryGiftEdit: vi.fn(),
  revertPokedexAction: vi.fn(),
  revertRaidsDraft: vi.fn(),
  revertTrainerEdit: vi.fn(),
  revertUndergroundDraft: vi.fn(),
})

const withCallback = <K extends keyof RevertWorkspaceChangeCallbacks>(
  key: K,
  fn: RevertWorkspaceChangeCallbacks[K],
) => {
  const callbacks = noopCallbacks()
  callbacks[key] = fn
  return callbacks
}

describe('revertWorkspaceChange', () => {
  it('reverts a trainer change via revertTrainerEdit', () => {
    const revertTrainerEdit = vi.fn()
    revertWorkspaceChange(
      { slotId: '__trainer__', path: '', label: '', before: '', after: '' },
      {},
      {},
      vi.fn(),
      withCallback('revertTrainerEdit', revertTrainerEdit),
    )
    expect(revertTrainerEdit).toHaveBeenCalledOnce()
  })

  it('reverts an items change via revertItemsEdit', () => {
    const revertItemsEdit = vi.fn()
    revertWorkspaceChange(
      { slotId: '__items__', path: '', label: '', before: '', after: '' },
      {},
      {},
      vi.fn(),
      withCallback('revertItemsEdit', revertItemsEdit),
    )
    expect(revertItemsEdit).toHaveBeenCalledOnce()
  })

  it('reverts an underground change via revertUndergroundDraft', () => {
    const revertUndergroundDraft = vi.fn()
    revertWorkspaceChange(
      { slotId: '__underground__', path: '', label: '', before: '', after: '' },
      {},
      {},
      vi.fn(),
      withCallback('revertUndergroundDraft', revertUndergroundDraft),
    )
    expect(revertUndergroundDraft).toHaveBeenCalledOnce()
  })

  it('reverts a raids change via revertRaidsDraft', () => {
    const revertRaidsDraft = vi.fn()
    revertWorkspaceChange(
      { slotId: '__raids__', path: '', label: '', before: '', after: '' },
      {},
      {},
      vi.fn(),
      withCallback('revertRaidsDraft', revertRaidsDraft),
    )
    expect(revertRaidsDraft).toHaveBeenCalledOnce()
  })

  it('reverts a mystery gift change via revertMysteryGiftEdit with the id', () => {
    const revertMysteryGiftEdit = vi.fn()
    revertWorkspaceChange(
      {
        slotId: '__mystery_gift__:g-1',
        path: '',
        label: '',
        before: '',
        after: '',
      },
      {},
      {},
      vi.fn(),
      withCallback('revertMysteryGiftEdit', revertMysteryGiftEdit),
    )
    expect(revertMysteryGiftEdit).toHaveBeenCalledWith('g-1')
  })

  it('reverts a pokedex action change via revertPokedexAction', () => {
    const revertPokedexAction = vi.fn()
    revertWorkspaceChange(
      {
        slotId: '__pokedex__:national:seen',
        path: '',
        label: '',
        before: '',
        after: '',
      },
      {},
      {},
      vi.fn(),
      withCallback('revertPokedexAction', revertPokedexAction),
    )
    expect(revertPokedexAction).toHaveBeenCalledWith({
      dexId: 'national',
      action: 'seen',
    })
  })

  it('reverts an arceus research bulk change via revertArceusResearchBulk', () => {
    const revertArceusResearchBulk = vi.fn()
    revertWorkspaceChange(
      {
        slotId: '__arceus_research_bulk__:markAllPerfect',
        path: '',
        label: '',
        before: '',
        after: '',
      },
      {},
      {},
      vi.fn(),
      withCallback('revertArceusResearchBulk', revertArceusResearchBulk),
    )
    expect(revertArceusResearchBulk).toHaveBeenCalledWith('markAllPerfect')
  })

  it('reverts an arceus research action change via revertArceusResearchAction', () => {
    const revertArceusResearchAction = vi.fn()
    revertWorkspaceChange(
      {
        slotId: '__arceus_research__:25:completeTask:2',
        path: '',
        label: '',
        before: '',
        after: '',
      },
      {},
      {},
      vi.fn(),
      withCallback('revertArceusResearchAction', revertArceusResearchAction),
    )
    expect(revertArceusResearchAction).toHaveBeenCalledWith({
      species: 25,
      action: 'completeTask',
      taskIndex: 2,
    })
  })

  it('reverts a donut draft change via revertDonutDraft with the id', () => {
    const revertDonutDraft = vi.fn()
    revertWorkspaceChange(
      { slotId: '__donut__:d-1', path: '', label: '', before: '', after: '' },
      {},
      {},
      vi.fn(),
      withCallback('revertDonutDraft', revertDonutDraft),
    )
    expect(revertDonutDraft).toHaveBeenCalledWith('d-1')
  })

  it('reverts a met date fixer change via revertMetDateFixerDraft', () => {
    const revertMetDateFixerDraft = vi.fn()
    revertWorkspaceChange(
      {
        slotId: '__met_date_fixer__',
        path: '',
        label: '',
        before: '',
        after: '',
      },
      {},
      {},
      vi.fn(),
      withCallback('revertMetDateFixerDraft', revertMetDateFixerDraft),
    )
    expect(revertMetDateFixerDraft).toHaveBeenCalledOnce()
  })

  it('reverts a regular pokemon field change via setDrafts (path branch)', () => {
    const setDrafts = vi.fn()
    const baseDetail = base()
    const draftDetail = draft({ summary: { ...baseDetail.summary, level: 7 } })
    const change = {
      slotId: 'a',
      path: 'main.nickname',
      label: 'l',
      before: 'X',
      after: 'Y',
    }
    revertWorkspaceChange(
      change,
      { a: baseDetail },
      { a: draftDetail },
      setDrafts,
      noopCallbacks(),
    )
    expect(setDrafts).toHaveBeenCalledOnce()
    const updater = setDrafts.mock.calls[0]?.[0] as (
      prev: Record<string, typeof baseDetail>,
    ) => Record<string, typeof baseDetail>
    const next = updater({ a: draftDetail })
    const a = next.a as
      | (typeof baseDetail & { main: { nickname: string } })
      | undefined
    expect(a?.main.nickname).toBe('Original')
  })

  it('deletes the draft when reverting brings the pokemon back to base', () => {
    const setDrafts = vi.fn()
    const baseDetail = base()
    const change = {
      slotId: 'a',
      path: 'main.nickname',
      label: 'l',
      before: 'X',
      after: 'Y',
    }
    revertWorkspaceChange(
      change,
      { a: baseDetail },
      { a: draft(baseDetail) },
      setDrafts,
      noopCallbacks(),
    )
    const updater = setDrafts.mock.calls[0]?.[0] as (
      prev: Record<string, PokemonDetail>,
    ) => Record<string, PokemonDetail>
    const next = updater({ a: baseDetail })
    expect(next).not.toHaveProperty('a')
  })

  it('no-ops when both base and current are missing', () => {
    const setDrafts = vi.fn()
    revertWorkspaceChange(
      { slotId: 'missing', path: 'p', label: 'l', before: 'b', after: 'a' },
      {},
      {},
      setDrafts,
      noopCallbacks(),
    )
    expect(setDrafts).not.toHaveBeenCalled()
  })
})
