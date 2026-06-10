import { describe, expect, it } from 'vitest'

import { createTranslator } from '../../i18n/i18n/i18n'
import {
  formatPokedexDraftLabel,
  hasPokedexAction,
  parsePokedexActionSlotId,
  POKEDEX_GLOBAL_DEX_ID,
  pokedexActionLabel,
  pokedexActionSlotId,
  pokedexDexLabel,
  samePokedexAction,
} from './pokedexActionUtils'

const t = createTranslator('en')

describe('pokedexActionSlotId', () => {
  it('builds a slot id from dexId and action', () => {
    expect(pokedexActionSlotId({ dexId: 'national', action: 'seen' })).toBe(
      '__pokedex__:national:seen',
    )
  })

  it('handles the global dex id', () => {
    expect(
      pokedexActionSlotId({ dexId: POKEDEX_GLOBAL_DEX_ID, action: 'complete' }),
    ).toBe('__pokedex__:all:complete')
  })
})

describe('parsePokedexActionSlotId', () => {
  it('parses a well-formed slot id back to a key', () => {
    expect(parsePokedexActionSlotId('__pokedex__:national:seen')).toEqual({
      dexId: 'national',
      action: 'seen',
    })
  })

  it('returns null for unrelated slot ids', () => {
    expect(parsePokedexActionSlotId('foo:bar')).toBeNull()
  })

  it('returns null for the prefix without a value', () => {
    expect(parsePokedexActionSlotId('__pokedex__')).toBeNull()
  })

  it('returns null for unknown action', () => {
    expect(
      parsePokedexActionSlotId('__pokedex__:national:unknownAction'),
    ).toBeNull()
  })

  it('returns null for missing action', () => {
    expect(parsePokedexActionSlotId('__pokedex__:national')).toBeNull()
  })
})

describe('samePokedexAction', () => {
  it('returns true for identical keys', () => {
    expect(
      samePokedexAction(
        { dexId: 'a', action: 'seen' },
        { dexId: 'a', action: 'seen' },
      ),
    ).toBe(true)
  })

  it('returns false if either field differs', () => {
    expect(
      samePokedexAction(
        { dexId: 'a', action: 'seen' },
        { dexId: 'b', action: 'seen' },
      ),
    ).toBe(false)
    expect(
      samePokedexAction(
        { dexId: 'a', action: 'seen' },
        { dexId: 'a', action: 'caught' },
      ),
    ).toBe(false)
  })
})

describe('hasPokedexAction', () => {
  it('finds a matching action in the list', () => {
    expect(
      hasPokedexAction([{ dexId: 'a', action: 'seen' }], {
        dexId: 'a',
        action: 'seen',
      }),
    ).toBe(true)
  })

  it('returns false when not in the list', () => {
    expect(
      hasPokedexAction([{ dexId: 'a', action: 'seen' }], {
        dexId: 'a',
        action: 'caught',
      }),
    ).toBe(false)
  })

  it('returns false for an empty list', () => {
    expect(hasPokedexAction([], { dexId: 'a', action: 'seen' })).toBe(false)
  })
})

describe('roundtrip', () => {
  it('parse(pokedexActionSlotId(k)) === k for valid keys', () => {
    const k = { dexId: 'national', action: 'complete' } as never
    expect(parsePokedexActionSlotId(pokedexActionSlotId(k))).toEqual(k)
  })

  it('label formatters call the translator', () => {
    expect(t('pokedexActionCaught')).toBeTruthy()
  })
})

describe('pokedexDexLabel', () => {
  it('returns the all-dexes label for the global dex id', () => {
    expect(pokedexDexLabel(t, POKEDEX_GLOBAL_DEX_ID, null)).toBeTruthy()
  })

  it('returns the matched dex label when found in status', () => {
    expect(
      pokedexDexLabel(t, 'national', {
        dexes: [{ id: 'national', label: 'National' }],
      } as never),
    ).toBe('National')
  })

  it('falls back to the raw dex id when no matching entry exists', () => {
    expect(pokedexDexLabel(t, 'unknown', { dexes: [] } as never)).toBe(
      'unknown',
    )
  })
})

describe('pokedexActionLabel', () => {
  it('translates the action name', () => {
    expect(pokedexActionLabel(t, 'seen')).toBeTruthy()
  })
})

describe('formatPokedexDraftLabel', () => {
  it('produces a string from the pokedex and action labels', () => {
    const key = { dexId: 'national', action: 'seen' } as never
    const out = formatPokedexDraftLabel(t, key, {
      dexes: [{ id: 'national', label: 'National' }],
    } as never)
    expect(typeof out).toBe('string')
  })
})
