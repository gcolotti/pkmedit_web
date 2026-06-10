import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import type { MysteryGiftDatabasePreview } from '../../types/database/database'
import type { PokemonReplacement } from '../../types/database/database'
import type { ArceusResearchActionKey } from '../../types/index/index'
import type { ArceusResearchBulkAction } from '../../types/index/index'
import type { PokedexActionKey } from '../../types/index/index'
import type { PokemonDetail } from '../../types/index/index'
import { useDraftStore } from './draftStore'

const pokemon = (id: number): PokemonDetail =>
  ({ species: id, nickname: `Mon${id}` }) as unknown as PokemonDetail

const mysteryGift = (id: number): MysteryGiftDatabasePreview =>
  ({
    entry: { id, name: `Gift${id}` },
  }) as unknown as MysteryGiftDatabasePreview

const initial = () => ({
  pokemonDrafts: {} as Record<string, PokemonDetail>,
  baseDetails: {} as Record<string, PokemonDetail>,
  draftViolations: [] as never[],
  trainerDraft: null,
  itemsDraft: null,
  undergroundDraft: null,
  donutDrafts: [] as never[],
  raidsDraft: null,
  mysteryGiftDrafts: [] as MysteryGiftDatabasePreview[],
  replacementDrafts: {} as Record<string, PokemonReplacement>,
  pokedexDrafts: [] as PokedexActionKey[],
  pokedexStatus: null,
  arceusResearchStatus: null,
  arceusResearchDrafts: [] as ArceusResearchActionKey[],
  arceusResearchBulkDrafts: [] as ArceusResearchBulkAction[],
  metDateFixerDraft: null,
  databasePreview: null,
})

describe('useDraftStore', () => {
  beforeEach(() => {
    useDraftStore.setState(initial(), false)
  })

  it('starts with empty slices', () => {
    const s = useDraftStore.getState()
    expect(s.pokemonDrafts).toEqual({})
    expect(s.draftViolations).toEqual([])
    expect(s.trainerDraft).toBeNull()
    expect(s.itemsDraft).toBeNull()
    expect(s.donutDrafts).toEqual([])
    expect(s.pokedexDrafts).toEqual([])
    expect(s.arceusResearchDrafts).toEqual([])
    expect(s.metDateFixerDraft).toBeNull()
  })

  describe('pokemon drafts', () => {
    it('setPokemonDrafts replaces the map', () => {
      act(() => useDraftStore.getState().setPokemonDrafts({ a: pokemon(1) }))
      expect(useDraftStore.getState().pokemonDrafts).toEqual({ a: pokemon(1) })
    })

    it('setPokemonDrafts accepts a functional updater', () => {
      act(() => useDraftStore.getState().setPokemonDrafts({ a: pokemon(1) }))
      act(() =>
        useDraftStore
          .getState()
          .setPokemonDrafts((prev) => ({ ...prev, b: pokemon(2) })),
      )
      expect(useDraftStore.getState().pokemonDrafts).toEqual({
        a: pokemon(1),
        b: pokemon(2),
      })
    })

    it('setDraft inserts a new entry', () => {
      act(() => useDraftStore.getState().setDraft('a', pokemon(1)))
      expect(useDraftStore.getState().pokemonDrafts).toEqual({ a: pokemon(1) })
    })

    it('setDraft applies a functional updater over the current value', () => {
      act(() => useDraftStore.getState().setDraft('a', pokemon(1)))
      act(() =>
        useDraftStore.getState().setDraft('a', (current) => {
          if (!current) return null
          return {
            ...current,
            main: { ...current.main, nickname: 'Renamed' },
          }
        }),
      )
      expect(useDraftStore.getState().pokemonDrafts.a.main.nickname).toBe(
        'Renamed',
      )
    })

    it('setDraft with null is a no-op (does not throw, does not change state)', () => {
      act(() => useDraftStore.getState().setDraft('a', pokemon(1)))
      const before = useDraftStore.getState().pokemonDrafts
      act(() => useDraftStore.getState().setDraft('a', null))
      // The store explicitly returns {} when updater resolves to null
      expect(useDraftStore.getState().pokemonDrafts).toBe(before)
    })

    it('setBaseDetail sets a single base detail', () => {
      act(() => useDraftStore.getState().setBaseDetail('a', pokemon(7)))
      expect(useDraftStore.getState().baseDetails).toEqual({ a: pokemon(7) })
    })

    it('setBaseDetails replaces the entire map', () => {
      act(() => useDraftStore.getState().setBaseDetail('a', pokemon(7)))
      act(() => useDraftStore.getState().setBaseDetails({ b: pokemon(9) }))
      expect(useDraftStore.getState().baseDetails).toEqual({ b: pokemon(9) })
    })

    it('setDraftViolations accepts a functional updater', () => {
      const v1 = { kind: 'illegal' } as never
      const v2 = { kind: 'warning' } as never
      act(() => useDraftStore.getState().setDraftViolations([v1]))
      act(() =>
        useDraftStore.getState().setDraftViolations((prev) => [...prev, v2]),
      )
      expect(useDraftStore.getState().draftViolations).toEqual([v1, v2])
    })
  })

  describe('trainer / items / underground / raids / database', () => {
    it.each([
      ['setTrainerDraft', 'trainerDraft', { tid: 12345 }],
      ['setItemsDraft', 'itemsDraft', { bag: 'value' }],
      ['setUndergroundDraft', 'undergroundDraft', { items: [] }],
      ['setRaidsDraft', 'raidsDraft', { saveKind: 'sv', groups: [] }],
      ['setDatabasePreview', 'databasePreview', { kind: 'encounter' }],
    ] as const)('%s replaces the slot', (action, key, value) => {
      // @ts-expect-error -- action signatures vary; we only need to drive the store
      act(() => useDraftStore.getState()[action](value))
      expect(useDraftStore.getState()[key]).toEqual(value)
    })
  })

  describe('mystery gifts', () => {
    it('setMysteryGiftDrafts replaces the list', () => {
      act(() => useDraftStore.getState().setMysteryGiftDrafts([mysteryGift(1)]))
      expect(useDraftStore.getState().mysteryGiftDrafts).toEqual([
        mysteryGift(1),
      ])
    })

    it('addMysteryGiftDraft appends a new gift', () => {
      act(() => useDraftStore.getState().addMysteryGiftDraft(mysteryGift(1)))
      act(() => useDraftStore.getState().addMysteryGiftDraft(mysteryGift(2)))
      expect(
        useDraftStore.getState().mysteryGiftDrafts.map((g) => g.entry.id),
      ).toEqual([1, 2])
    })

    it('addMysteryGiftDraft dedupes by entry.id', () => {
      act(() => useDraftStore.getState().addMysteryGiftDraft(mysteryGift(1)))
      act(() => useDraftStore.getState().addMysteryGiftDraft(mysteryGift(1)))
      expect(useDraftStore.getState().mysteryGiftDrafts).toHaveLength(1)
    })

    it('revertMysteryGiftDraft removes by entry.id', () => {
      act(() =>
        useDraftStore
          .getState()
          .setMysteryGiftDrafts([mysteryGift(1), mysteryGift(2)]),
      )
      // The store expects an `id` string, but the synthetic gifts use numeric
      // ids to keep the test data simple. The store compares with `!==`, so
      // coercion is not relevant — only the type signature is.
      act(() =>
        useDraftStore.getState().revertMysteryGiftDraft(1 as unknown as string),
      )
      expect(
        useDraftStore.getState().mysteryGiftDrafts.map((g) => g.entry.id),
      ).toEqual([2])
    })
  })

  describe('replacement drafts', () => {
    it('setReplacementDraft sets a single entry', () => {
      const r: PokemonReplacement = { dataBase64: 'AA==' }
      act(() => useDraftStore.getState().setReplacementDraft('a', r))
      expect(useDraftStore.getState().replacementDrafts).toEqual({ a: r })
    })

    it('setReplacementDrafts accepts a functional updater', () => {
      act(() =>
        useDraftStore.getState().setReplacementDrafts({
          a: { dataBase64: 'AA==' },
        }),
      )
      act(() =>
        useDraftStore.getState().setReplacementDrafts((prev) => ({
          ...prev,
          b: { dataBase64: 'BB==' },
        })),
      )
      expect(useDraftStore.getState().replacementDrafts).toEqual({
        a: { dataBase64: 'AA==' },
        b: { dataBase64: 'BB==' },
      })
    })

    it('clearReplacementDraft removes the entry', () => {
      act(() =>
        useDraftStore.getState().setReplacementDraft('a', {
          species: 25,
          dataBase64: 'AA==',
        } as PokemonReplacement),
      )
      act(() => useDraftStore.getState().clearReplacementDraft('a'))
      expect(useDraftStore.getState().replacementDrafts).toEqual({})
    })

    it('clearReplacementDraft is a no-op when the entry does not exist', () => {
      act(() => useDraftStore.getState().clearReplacementDraft('missing'))
      expect(useDraftStore.getState().replacementDrafts).toEqual({})
    })
  })

  describe('pokedex drafts', () => {
    const targetA: PokedexActionKey = { dexId: '1', action: 'caught' }
    const targetB: PokedexActionKey = { dexId: '2', action: 'caught' }

    it('applyPokedexAction adds a new action', () => {
      act(() => useDraftStore.getState().applyPokedexAction(targetA))
      expect(useDraftStore.getState().pokedexDrafts).toEqual([targetA])
    })

    it('applyPokedexAction is idempotent for the same target', () => {
      act(() => useDraftStore.getState().applyPokedexAction(targetA))
      act(() => useDraftStore.getState().applyPokedexAction(targetA))
      expect(useDraftStore.getState().pokedexDrafts).toEqual([targetA])
    })

    it('revertPokedexAction removes the target', () => {
      act(() => useDraftStore.getState().setPokedexDrafts([targetA, targetB]))
      act(() => useDraftStore.getState().revertPokedexAction(targetA))
      expect(useDraftStore.getState().pokedexDrafts).toEqual([targetB])
    })

    it('setPokedexDrafts accepts a functional updater', () => {
      act(() => useDraftStore.getState().setPokedexDrafts([targetA]))
      act(() =>
        useDraftStore.getState().setPokedexDrafts((prev) => [...prev, targetB]),
      )
      expect(useDraftStore.getState().pokedexDrafts).toEqual([targetA, targetB])
    })

    it('setPokedexStatus replaces the status', () => {
      const status = { dexes: [] } as never
      act(() => useDraftStore.getState().setPokedexStatus(status))
      expect(useDraftStore.getState().pokedexStatus).toBe(status)
    })
  })

  describe('arceus research', () => {
    it('toggleArceusResearchBulk adds the action when missing', () => {
      act(() =>
        useDraftStore
          .getState()
          .toggleArceusResearchBulk('catch-25' as ArceusResearchBulkAction),
      )
      expect(useDraftStore.getState().arceusResearchBulkDrafts).toEqual([
        'catch-25',
      ])
    })

    it('toggleArceusResearchBulk removes the action when present', () => {
      act(() =>
        useDraftStore
          .getState()
          .toggleArceusResearchBulk('catch-25' as ArceusResearchBulkAction),
      )
      act(() =>
        useDraftStore
          .getState()
          .toggleArceusResearchBulk('catch-25' as ArceusResearchBulkAction),
      )
      expect(useDraftStore.getState().arceusResearchBulkDrafts).toEqual([])
    })

    it('revertArceusResearchBulk removes a specific action', () => {
      act(() =>
        useDraftStore
          .getState()
          .toggleArceusResearchBulk('catch-25' as ArceusResearchBulkAction),
      )
      act(() =>
        useDraftStore
          .getState()
          .toggleArceusResearchBulk('catch-150' as ArceusResearchBulkAction),
      )
      act(() =>
        useDraftStore
          .getState()
          .revertArceusResearchBulk('catch-25' as ArceusResearchBulkAction),
      )
      expect(useDraftStore.getState().arceusResearchBulkDrafts).toEqual([
        'catch-150',
      ])
    })
  })

  describe('donut drafts', () => {
    it('addDonutDraft appends', () => {
      const d = { id: 'd1' } as never
      act(() => useDraftStore.getState().addDonutDraft(d))
      expect(useDraftStore.getState().donutDrafts).toEqual([d])
    })

    it('revertDonutDraft removes by id', () => {
      act(() =>
        useDraftStore
          .getState()
          .setDonutDrafts([{ id: 'a' }, { id: 'b' }] as never[]),
      )
      act(() => useDraftStore.getState().revertDonutDraft('a'))
      expect(useDraftStore.getState().donutDrafts.map((d) => d.id)).toEqual([
        'b',
      ])
    })
  })

  describe('met date fixer', () => {
    it('setMetDateFixerDraft replaces the draft', () => {
      act(() => useDraftStore.getState().setMetDateFixerDraft({} as never))
      expect(useDraftStore.getState().metDateFixerDraft).toEqual({})
    })
  })

  describe('reset / revert', () => {
    it('resetDrafts restores the empty slices', () => {
      act(() => useDraftStore.getState().setTrainerDraft({ tid: 1 } as never))
      act(() => useDraftStore.getState().resetDrafts())
      expect(useDraftStore.getState().trainerDraft).toBeNull()
      expect(useDraftStore.getState().pokemonDrafts).toEqual({})
    })

    it('revertAll resets the fields it owns and leaves the rest', () => {
      act(() => useDraftStore.getState().setTrainerDraft({ tid: 1 } as never))
      act(() => useDraftStore.getState().setDatabasePreview({} as never))
      act(() => useDraftStore.getState().revertAll())
      const s = useDraftStore.getState()
      // revertAll clears trainerDraft, donutDrafts, etc.
      expect(s.trainerDraft).toBeNull()
      expect(s.donutDrafts).toEqual([])
      expect(s.replacementDrafts).toEqual({})
      // revertAll does not touch databasePreview (intentional — only
      // resetDrafts is the full reset).
      expect(s.databasePreview).toEqual({})
    })
  })
})
