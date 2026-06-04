// Smoke test for draftStoreTypes: ensures the module imports cleanly and the
// `emptyDraftSlices` constant is the documented shape.

import { describe, expect, it } from 'vitest'

import { emptyDraftSlices } from './draftStoreTypes'

describe('draftStoreTypes', () => {
  it('exports emptyDraftSlices with the documented shape', () => {
    expect(emptyDraftSlices).toEqual({
      pokemonDrafts: {},
      baseDetails: {},
      draftViolations: [],
      trainerDraft: null,
      itemsDraft: null,
      undergroundDraft: null,
      donutDrafts: [],
      raidsDraft: null,
      mysteryGiftDrafts: [],
      replacementDrafts: {},
      pokedexDrafts: [],
      pokedexStatus: null,
      arceusResearchStatus: null,
      arceusResearchDrafts: [],
      arceusResearchBulkDrafts: [],
      metDateFixerDraft: null,
      databasePreview: null,
    })
  })
})
