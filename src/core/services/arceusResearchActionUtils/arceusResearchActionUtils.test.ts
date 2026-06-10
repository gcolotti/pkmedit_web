import { describe, expect, it } from 'vitest'

import { createTranslator } from '../../i18n/i18n/i18n'
import {
  arceusResearchActionSlotId,
  arceusResearchBulkSlotId,
  formatArceusResearchBulkLabel,
  formatArceusResearchDraftLabel,
  parseArceusResearchActionSlotId,
  parseArceusResearchBulkSlotId,
  sameArceusResearchAction,
} from './arceusResearchActionUtils'

describe('arceusResearchActionSlotId', () => {
  it('uses "all" as the task placeholder when taskIndex is missing', () => {
    expect(
      arceusResearchActionSlotId({ species: 25, action: 'completeTask' }),
    ).toBe('__arceus_research__:25:completeTask:all')
  })

  it('uses the numeric task index when present', () => {
    expect(
      arceusResearchActionSlotId({
        species: 25,
        action: 'completeTask',
        taskIndex: 2,
      }),
    ).toBe('__arceus_research__:25:completeTask:2')
  })
})

describe('arceusResearchBulkSlotId', () => {
  it('builds a prefixed slot id', () => {
    expect(arceusResearchBulkSlotId('markAllPerfect')).toBe(
      '__arceus_research_bulk__:markAllPerfect',
    )
  })
})

describe('parseArceusResearchActionSlotId', () => {
  it('parses a slot id with numeric task index', () => {
    expect(
      parseArceusResearchActionSlotId('__arceus_research__:25:completeTask:2'),
    ).toEqual({ species: 25, action: 'completeTask', taskIndex: 2 })
  })

  it('parses a slot id with "all" task placeholder into null', () => {
    expect(
      parseArceusResearchActionSlotId(
        '__arceus_research__:25:completeTask:all',
      ),
    ).toEqual({ species: 25, action: 'completeTask', taskIndex: null })
  })

  it('parses a slot id missing the task portion into null', () => {
    expect(
      parseArceusResearchActionSlotId('__arceus_research__:25:completeTask'),
    ).toEqual({
      species: 25,
      action: 'completeTask',
      taskIndex: null,
    })
  })

  it('returns null for the prefix without any payload', () => {
    expect(parseArceusResearchActionSlotId('__arceus_research__')).toBeNull()
  })

  it('returns null for an unknown action', () => {
    expect(
      parseArceusResearchActionSlotId('__arceus_research__:25:bogus:all'),
    ).toBeNull()
  })

  it('returns null for a non-numeric species', () => {
    expect(
      parseArceusResearchActionSlotId(
        '__arceus_research__:abc:completeTask:all',
      ),
    ).toBeNull()
  })

  it('returns null for a non-numeric task index that is not "all"', () => {
    expect(
      parseArceusResearchActionSlotId(
        '__arceus_research__:25:completeTask:abc',
      ),
    ).toBeNull()
  })

  it('returns null for unrelated slot ids', () => {
    expect(parseArceusResearchActionSlotId('foo:bar')).toBeNull()
  })
})

describe('parseArceusResearchBulkSlotId', () => {
  it('parses a valid bulk action', () => {
    expect(
      parseArceusResearchBulkSlotId('__arceus_research_bulk__:markAllComplete'),
    ).toBe('markAllComplete')
  })

  it('returns null for unknown bulk action', () => {
    expect(
      parseArceusResearchBulkSlotId('__arceus_research_bulk__:nope'),
    ).toBeNull()
  })

  it('returns null for unrelated slot id', () => {
    expect(parseArceusResearchBulkSlotId('foo')).toBeNull()
  })
})

describe('sameArceusResearchAction', () => {
  it('returns true for identical keys', () => {
    expect(
      sameArceusResearchAction(
        { species: 25, action: 'completeTask', taskIndex: 2 },
        { species: 25, action: 'completeTask', taskIndex: 2 },
      ),
    ).toBe(true)
  })

  it('treats missing taskIndex as equivalent to null', () => {
    expect(
      sameArceusResearchAction(
        { species: 25, action: 'completeTask' },
        { species: 25, action: 'completeTask', taskIndex: null },
      ),
    ).toBe(true)
  })

  it('returns false when species differ', () => {
    expect(
      sameArceusResearchAction(
        { species: 25, action: 'completeTask' },
        { species: 26, action: 'completeTask' },
      ),
    ).toBe(false)
  })

  it('returns false when action differ', () => {
    expect(
      sameArceusResearchAction(
        { species: 25, action: 'completeTask' },
        { species: 25, action: 'perfectSpecies' },
      ),
    ).toBe(false)
  })

  it('returns false when taskIndex differ', () => {
    expect(
      sameArceusResearchAction(
        { species: 25, action: 'completeTask', taskIndex: 1 },
        { species: 25, action: 'completeTask', taskIndex: 2 },
      ),
    ).toBe(false)
  })
})

describe('formatArceusResearchDraftLabel', () => {
  const t = createTranslator('en')

  it('formats the completeTask branch with species and 1-indexed task', () => {
    const out = formatArceusResearchDraftLabel(
      t,
      { species: 25, action: 'completeTask', taskIndex: 0 },
      'Pikachu',
    )
    expect(out).toContain('Pikachu')
    expect(out).toContain('1')
  })

  it('formats the species branch for non-completeTask actions', () => {
    const out = formatArceusResearchDraftLabel(
      t,
      { species: 25, action: 'completeSpecies' },
      'Pikachu',
    )
    expect(out).toContain('Pikachu')
  })
})

describe('formatArceusResearchBulkLabel', () => {
  const t = createTranslator('en')

  it('returns the translated bulk label', () => {
    const out = formatArceusResearchBulkLabel(t, 'markAllPerfect')
    expect(typeof out).toBe('string')
  })
})
