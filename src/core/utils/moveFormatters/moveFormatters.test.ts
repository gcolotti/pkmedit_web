import { describe, expect, it } from 'vitest'

import type { Translator } from '../../i18n/i18n/i18n'
import {
  abilityModifierLabel,
  capitalize,
  formatAccuracy,
  formatChance,
  formatNum,
  formatPriority,
  humanizeSlug,
  itemModifierLabel,
  numberValue,
  statLabel,
  statusLabel,
  stringValue,
} from './moveFormatters'

const t = ((key: string) => key) as Translator

describe('capitalize', () => {
  it('uppercases the first character', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('returns an empty string unchanged', () => {
    expect(capitalize('')).toBe('')
  })

  it('preserves the rest of the string', () => {
    expect(capitalize('hELLO')).toBe('HELLO')
  })
})

describe('humanizeSlug', () => {
  it('converts kebab-case to Title Case', () => {
    expect(humanizeSlug('special-attack')).toBe('Special Attack')
  })

  it('returns a single word capitalized', () => {
    expect(humanizeSlug('attack')).toBe('Attack')
  })

  it('removes empty segments from leading/trailing/duplicate dashes', () => {
    expect(humanizeSlug('--foo--bar--')).toBe('Foo Bar')
  })

  it('returns empty string for empty input', () => {
    expect(humanizeSlug('')).toBe('')
  })
})

describe('stringValue', () => {
  it('returns the string when value is a string', () => {
    expect(stringValue('hi')).toBe('hi')
  })

  it('returns empty string for non-string values', () => {
    expect(stringValue(42)).toBe('')
    expect(stringValue(null)).toBe('')
    expect(stringValue(undefined)).toBe('')
    expect(stringValue({})).toBe('')
  })
})

describe('numberValue', () => {
  it('returns the number when value is a number', () => {
    expect(numberValue(42)).toBe(42)
    expect(numberValue(0)).toBe(0)
  })

  it('returns null for non-number values', () => {
    expect(numberValue('42')).toBeNull()
    expect(numberValue(null)).toBeNull()
    expect(numberValue(undefined)).toBeNull()
  })
})

describe('formatNum', () => {
  it('returns the number as a string for positive values', () => {
    expect(formatNum(10)).toBe('10')
  })

  it('returns "-" for null', () => {
    expect(formatNum(null)).toBe('-')
  })

  it('returns "-" for undefined', () => {
    expect(formatNum(undefined)).toBe('-')
  })

  it('returns "-" for 0', () => {
    expect(formatNum(0)).toBe('-')
  })

  it('returns "-" for negative values', () => {
    expect(formatNum(-5)).toBe('-')
  })
})

describe('formatAccuracy', () => {
  it('returns "-" for null', () => {
    expect(formatAccuracy(null, t)).toBe('-')
  })

  it('returns "moveNeverMisses" for 0', () => {
    expect(formatAccuracy(0, t)).toBe('moveNeverMisses')
  })

  it('returns "X%" for positive values', () => {
    expect(formatAccuracy(85, t)).toBe('85%')
    expect(formatAccuracy(100, t)).toBe('100%')
  })
})

describe('formatPriority', () => {
  it('prepends + for positive priority', () => {
    expect(formatPriority(1)).toBe('+1')
    expect(formatPriority(5)).toBe('+5')
  })

  it('returns plain string for 0 and negative priority', () => {
    expect(formatPriority(0)).toBe('0')
    expect(formatPriority(-1)).toBe('-1')
    expect(formatPriority(-3)).toBe('-3')
  })
})

describe('formatChance', () => {
  it('formats numbers as percent strings', () => {
    expect(formatChance(10)).toBe('10%')
    expect(formatChance(100)).toBe('100%')
  })

  it('appends % to non-empty strings without %', () => {
    expect(formatChance('10')).toBe('10%')
  })

  it('preserves strings that already end with %', () => {
    expect(formatChance('10%')).toBe('10%')
  })

  it('returns "-" for empty string and other types', () => {
    expect(formatChance('')).toBe('-')
    expect(formatChance(null)).toBe('-')
    expect(formatChance(undefined)).toBe('-')
  })
})

describe('statusLabel', () => {
  it('returns known label for burn/brn/burned in en', () => {
    expect(statusLabel('burn', 'en')).toBe('burn the target')
    expect(statusLabel('brn', 'en')).toBe('burn the target')
    expect(statusLabel('burned', 'en')).toBe('burn the target')
  })

  it('returns known label for freeze/frz/frozen in es and ja', () => {
    expect(statusLabel('freeze', 'es')).toBe('congelar al objetivo')
    expect(statusLabel('frz', 'ja')).toBe('こおり')
  })

  it('returns known label for poison/psn/tox', () => {
    expect(statusLabel('psn', 'en')).toBe('poison the target')
    expect(statusLabel('tox', 'en')).toBe('badly poison the target')
  })

  it('returns known label for paralysis variants', () => {
    expect(statusLabel('paralysis', 'en')).toBe('paralyze the target')
    expect(statusLabel('par', 'en')).toBe('paralyze the target')
    expect(statusLabel('paralyze', 'en')).toBe('paralyze the target')
  })

  it('returns known label for sleep and confusion and flinch', () => {
    expect(statusLabel('slp', 'en')).toBe('put the target to sleep')
    expect(statusLabel('confusion', 'en')).toBe('confuse the target')
    expect(statusLabel('flinch', 'en')).toBe('make the target flinch')
  })

  it('falls back to humanizeSlug for unknown status', () => {
    expect(statusLabel('unknown-status', 'en')).toBe('Unknown Status')
  })
})

describe('statLabel', () => {
  it('returns known label for attack/defense/speed', () => {
    expect(statLabel('attack', 'en')).toBe('Attack')
    expect(statLabel('defense', 'en')).toBe('Defense')
    expect(statLabel('speed', 'en')).toBe('Speed')
  })

  it('returns special-attack and special-defense in different languages', () => {
    expect(statLabel('special-attack', 'en')).toBe('Special Attack')
    expect(statLabel('special-attack', 'ja')).toBe('とくこう')
    expect(statLabel('special-defense', 'es')).toBe('la Defensa Especial')
  })

  it('returns accuracy/evasion labels', () => {
    expect(statLabel('accuracy', 'en')).toBe('accuracy')
    expect(statLabel('evasion', 'en')).toBe('evasion')
  })

  it('falls back to humanizeSlug for unknown stat', () => {
    expect(statLabel('unknown-stat', 'en')).toBe('Unknown Stat')
  })
})

describe('abilityModifierLabel', () => {
  it('returns known labels', () => {
    expect(abilityModifierLabel('iron-fist')).toBe('Iron Fist')
    expect(abilityModifierLabel('strong-jaw')).toBe('Strong Jaw')
    expect(abilityModifierLabel('mega-launcher')).toBe('Mega Launcher')
  })

  it('falls back to humanizeSlug', () => {
    expect(abilityModifierLabel('unknown-ability')).toBe('Unknown Ability')
  })
})

describe('itemModifierLabel', () => {
  it('returns known labels', () => {
    expect(itemModifierLabel('loaded-dice')).toBe('Loaded Dice')
    expect(itemModifierLabel('protective-pads')).toBe('Protective Pads')
    expect(itemModifierLabel('punching-glove')).toBe('Punching Glove')
  })

  it('falls back to humanizeSlug', () => {
    expect(itemModifierLabel('unknown-item')).toBe('Unknown Item')
  })
})
