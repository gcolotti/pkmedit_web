import { describe, expect, it } from 'vitest'

import { createTranslator } from '../../i18n/i18n/i18n'
import { buildWorkspaceDraftChanges } from './drafts'

const t = createTranslator('en')

describe('buildWorkspaceDraftChanges', () => {
  it('returns an empty list when nothing is given', () => {
    expect(buildWorkspaceDraftChanges([], t, null, null, [], [], null)).toEqual(
      [],
    )
  })

  it('emits a trainer slot when trainerDraft is non-null', () => {
    const result = buildWorkspaceDraftChanges(
      [],
      t,
      { otName: 'A' } as never,
      null,
      [],
      [],
      null,
    )
    expect(result[0]?.slotId).toBe('__trainer__')
  })

  it('emits an items slot when itemsDraft is non-null', () => {
    const result = buildWorkspaceDraftChanges(
      [],
      t,
      null,
      { pockets: [] },
      [],
      [],
      null,
    )
    expect(result[0]?.slotId).toBe('__items__')
  })

  it('emits an underground slot when undergroundDraft is non-null', () => {
    const result = buildWorkspaceDraftChanges(
      [],
      t,
      null,
      null,
      [],
      [],
      null,
      [],
      null,
      { groups: [] } as never,
    )
    expect(result.find((c) => c.slotId === '__underground__')).toBeDefined()
  })

  it('emits a raids slot when raidsDraft is non-null', () => {
    const result = buildWorkspaceDraftChanges(
      [],
      t,
      null,
      null,
      [],
      [],
      null,
      [],
      null,
      null,
      { groups: [] } as never,
    )
    expect(result.find((c) => c.slotId === '__raids__')).toBeDefined()
  })

  it('emits a slot per mystery gift with the gift id and title', () => {
    const result = buildWorkspaceDraftChanges(
      [],
      t,
      null,
      null,
      [
        {
          entry: { id: 'g1', title: 'Pikachu Gift' } as never,
          pokemon: null,
          draft: { giftDataBase64: '', extension: '' },
          replacement: null,
          storage: { supported: true, full: false, capacity: 0, used: 0 },
        },
      ],
      [],
      null,
    )
    expect(result[0]?.slotId).toBe('__mystery_gift__:g1')
    expect(result[0]?.after).toBe('Pikachu Gift')
  })

  it('emits a slot per pokedex draft', () => {
    const result = buildWorkspaceDraftChanges(
      [],
      t,
      null,
      null,
      [],
      [{ dexId: 'national', action: 'seen' }],
      null,
    )
    expect(result[0]?.slotId).toBe('__pokedex__:national:seen')
  })

  it('emits a slot per donut draft with the donut id and label', () => {
    const result = buildWorkspaceDraftChanges([], t, null, null, [], [], null, [
      {
        id: 'd1',
        label: 'Sweet Donut',
        berries: [1],
        berryName: 1,
        flavor0: 0,
        flavor1: 0,
        flavor2: 0,
      } as never,
    ])
    expect(result[0]?.slotId).toBe('__donut__:d1')
    expect(result[0]?.after).toBe('Sweet Donut')
  })

  it('emits a metDateFixer slot when metDateFixerDraft is given', () => {
    const result = buildWorkspaceDraftChanges(
      [],
      t,
      null,
      null,
      [],
      [],
      null,
      [],
      { rewriteAll: true } as never,
    )
    expect(result[0]?.slotId).toBe('__met_date_fixer__')
    expect(result[0]?.after).toBeTruthy()
  })

  it('appends arceus research drafts at the end, after pokemon changes', () => {
    const pokemonChange = {
      slotId: 'slot-1',
      path: 'main.nickname',
      label: 'x',
      before: '',
      after: 'A',
    }
    const result = buildWorkspaceDraftChanges(
      [pokemonChange],
      t,
      null,
      null,
      [],
      [],
      null,
      [],
      null,
      null,
      null,
      [{ species: 25, action: 'completeTask' }],
      [],
      null,
    )
    // pokemon change is at the end (after the special/arceus entries)
    expect(result[result.length - 1]).toEqual(pokemonChange)
    // the arceus slot precedes it
    const arceusIdx = result.findIndex((c) =>
      c.slotId.startsWith('__arceus_research__:'),
    )
    expect(arceusIdx).toBeGreaterThanOrEqual(0)
    expect(arceusIdx).toBeLessThan(result.length - 1)
  })
})
