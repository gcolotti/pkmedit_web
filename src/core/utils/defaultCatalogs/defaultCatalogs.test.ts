import { describe, expect, it } from 'vitest'

import { defaultCatalogs } from './defaultCatalogs'

describe('defaultCatalogs', () => {
  it('is in English by default', () => {
    expect(defaultCatalogs.language).toBe('en')
  })

  it('contains all expected catalog keys as empty arrays', () => {
    expect(defaultCatalogs.balls).toEqual([])
    expect(defaultCatalogs.abilities).toEqual([])
    expect(defaultCatalogs.items).toEqual([])
    expect(defaultCatalogs.languages).toEqual([])
    expect(defaultCatalogs.memories).toEqual([])
    expect(defaultCatalogs.moves).toEqual([])
    expect(defaultCatalogs.natures).toEqual([])
    expect(defaultCatalogs.ribbons).toEqual([])
    expect(defaultCatalogs.species).toEqual([])
    expect(defaultCatalogs.types).toEqual([])
    expect(defaultCatalogs.versions).toEqual([])
  })
})
