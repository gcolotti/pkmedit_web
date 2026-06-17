import { describe, expect, it } from 'vitest'

import type { PokemonTrainer } from '../../types/pokemon/pokemon'
import { getEffectiveHandlingTrainerLanguage } from './handlingTrainerLanguage'

const trainer = (overrides: Partial<PokemonTrainer> = {}): PokemonTrainer => ({
  originalTrainerName: 'Ash',
  tid16: 0,
  sid16: 0,
  displayTid: 0,
  displaySid: 0,
  originalTrainerGender: 0,
  originalTrainerFriendship: 70,
  handlingTrainerName: 'Misty',
  handlingTrainerGender: 0,
  handlingTrainerFriendship: 70,
  handlingTrainerLanguage: 2,
  currentHandler: 1,
  ...overrides,
})

describe('getEffectiveHandlingTrainerLanguage', () => {
  it('uses the save trainer language when HT is the current handler', () => {
    expect(getEffectiveHandlingTrainerLanguage(trainer(), 1)).toBe(1)
  })

  it('keeps the stored language for historical HT data when OT is current', () => {
    expect(
      getEffectiveHandlingTrainerLanguage(
        trainer({ currentHandler: 0, handlingTrainerLanguage: 3 }),
        1,
      ),
    ).toBe(3)
  })

  it('returns unset when there is no HT name', () => {
    expect(
      getEffectiveHandlingTrainerLanguage(
        trainer({ handlingTrainerName: '', handlingTrainerLanguage: 3 }),
        1,
      ),
    ).toBe(0)
  })
})
