import { describe, expect, it } from 'vitest'

import {
  getCatalogEntryOptionStyle,
  getCatalogEntrySelectStyle,
} from './catalogStyle'

const entry = { id: 1, name: 'Bulbasaur' }

describe('getCatalogEntryOptionStyle', () => {
  it('returns the legal style when options.legal is true', () => {
    expect(getCatalogEntryOptionStyle(entry, { legal: true })).toEqual({
      backgroundColor: 'rgba(34, 197, 94, 0.12)',
    })
  })

  it('returns undefined when options.legal is false', () => {
    expect(getCatalogEntryOptionStyle(entry, { legal: false })).toBeUndefined()
  })

  it('returns undefined when no options are given', () => {
    expect(getCatalogEntryOptionStyle(entry)).toBeUndefined()
  })

  it('returns undefined for a null entry with no options', () => {
    expect(getCatalogEntryOptionStyle(null)).toBeUndefined()
  })

  it('returns undefined for an undefined entry with no options', () => {
    expect(getCatalogEntryOptionStyle(undefined)).toBeUndefined()
  })

  it('still returns the legal style for null entry when options.legal is true', () => {
    expect(getCatalogEntryOptionStyle(null, { legal: true })).toEqual({
      backgroundColor: 'rgba(34, 197, 94, 0.12)',
    })
  })
})

describe('getCatalogEntrySelectStyle', () => {
  it('returns the legal style when options.legal is true', () => {
    const style = getCatalogEntrySelectStyle(entry, { legal: true })
    expect(style).toBeDefined()
    expect(style?.backgroundColor).toBe('rgb(187 247 208 / 0.34)')
    expect(style?.borderColor).toBe('#22c55e')
    expect(style?.boxShadow).toContain('rgb(34 197 94 / 0.35)')
  })

  it('returns undefined when options.legal is false', () => {
    expect(getCatalogEntrySelectStyle(entry, { legal: false })).toBeUndefined()
  })

  it('returns undefined when no options are given', () => {
    expect(getCatalogEntrySelectStyle(entry)).toBeUndefined()
  })

  it('returns undefined for null entry with no options', () => {
    expect(getCatalogEntrySelectStyle(null)).toBeUndefined()
  })

  it('returns undefined for undefined entry with no options', () => {
    expect(getCatalogEntrySelectStyle(undefined)).toBeUndefined()
  })

  it('returns the legal style for null entry when options.legal is true', () => {
    expect(getCatalogEntrySelectStyle(null, { legal: true })).toBeDefined()
  })
})
