import { describe, expect, it } from 'vitest'

import { createTranslator } from '../../i18n/i18n/i18n'
import { buildArceusResearchDraftChanges } from './arceusResearchDraftChanges'

const t = createTranslator('en')

describe('buildArceusResearchDraftChanges', () => {
  it('returns an empty list when no drafts are given', () => {
    expect(buildArceusResearchDraftChanges(t, [], [], null)).toEqual([])
  })

  it('produces a slot for each bulk draft', () => {
    const result = buildArceusResearchDraftChanges(
      t,
      [],
      ['markAllPerfect', 'markAllComplete'],
      null,
    )
    expect(result).toHaveLength(2)
    expect(result[0]?.slotId).toBe('__arceus_research_bulk__:markAllPerfect')
    expect(result[1]?.slotId).toBe('__arceus_research_bulk__:markAllComplete')
  })

  it('falls back to "#<species>" when speciesName is not in the status', () => {
    const result = buildArceusResearchDraftChanges(
      t,
      [{ species: 25, action: 'completeTask' }],
      [],
      null,
    )
    expect(result[0]?.label).toContain('#25')
  })

  it('uses the species name from the status when present', () => {
    const status = {
      groups: [],
      species: [{ species: 25, speciesName: 'Pikachu' }],
    } as never
    const result = buildArceusResearchDraftChanges(
      t,
      [{ species: 25, action: 'completeTask', taskIndex: 1 }],
      [],
      status,
    )
    expect(result[0]?.label).toContain('Pikachu')
  })
})
