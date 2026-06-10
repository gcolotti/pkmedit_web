import { describe, expect, it } from 'vitest'

import {
  getPokemonSpeciesSpriteCandidates,
  getPokemonSpriteCandidates,
} from './sprites'

describe('getPokemonSpriteCandidates', () => {
  it('returns no candidates when slot is empty', () => {
    expect(
      getPokemonSpriteCandidates({
        form: 0,
        gender: 0,
        present: false,
        shiny: false,
        species: 25,
      }),
    ).toEqual([])
  })

  it('returns no candidates when species is 0', () => {
    expect(
      getPokemonSpriteCandidates({
        form: 0,
        gender: 0,
        present: true,
        shiny: false,
        species: 0,
      }),
    ).toEqual([])
  })

  it('uses artwork folder for non-shiny', () => {
    const urls = getPokemonSpriteCandidates({
      form: 0,
      gender: 0,
      present: true,
      shiny: false,
      species: 25,
    })
    expect(urls.length).toBeGreaterThan(0)
    expect(urls.every((u) => u.includes('/artwork/'))).toBe(true)
    expect(urls.every((u) => !u.includes('/artwork-shiny/'))).toBe(true)
  })

  it('uses artwork-shiny folder for shiny sprites', () => {
    const urls = getPokemonSpriteCandidates({
      form: 0,
      gender: 0,
      present: true,
      shiny: true,
      species: 25,
    })
    expect(urls.length).toBeGreaterThan(0)
    expect(urls[0]).toContain('/artwork-shiny/')
  })

  it('includes a form suffix when form > 0 and species is not a default-form species', () => {
    const urls = getPokemonSpriteCandidates({
      form: 1,
      gender: 0,
      present: true,
      shiny: false,
      species: 25, // Pikachu
    })
    // Pikachu is not in defaultFormSpecies → form is preserved
    expect(urls.some((u) => u.includes('a_25-1'))).toBe(true)
  })

  it('forces form=0 for default-form species (Pikachu etc.)', () => {
    // Species 414 is in defaultFormSpecies → form is reset to 0 regardless of input
    const urls = getPokemonSpriteCandidates({
      form: 1,
      gender: 0,
      present: true,
      shiny: false,
      species: 414,
    })
    // No form-suffixed URL should appear; the stems must be a_414 (and normal fallbacks)
    expect(urls.some((u) => /a_414-/.test(u))).toBe(false)
    expect(urls.every((u) => /a_414(\.png|$)/.test(u))).toBe(true)
  })

  it('appends a gender suffix only for gendered sprite species', () => {
    // Species 449 (Hippopotas) is in genderedSpriteSpecies
    const female = getPokemonSpriteCandidates({
      form: 0,
      gender: 1,
      present: true,
      shiny: false,
      species: 449,
    })
    expect(female.some((u) => u.includes('a_449f'))).toBe(true)
    // Non-gendered species, gender suffix should NOT be applied
    const other = getPokemonSpriteCandidates({
      form: 0,
      gender: 1,
      present: true,
      shiny: false,
      species: 25,
    })
    expect(other.some((u) => u.includes('a_25f'))).toBe(false)
  })

  it('adds a special form stem for Pikachu form 8 (Gmax)', () => {
    const urls = getPokemonSpriteCandidates({
      form: 8,
      gender: 0,
      present: true,
      shiny: false,
      species: 25,
    })
    expect(urls.some((u) => u.includes('a_25-8p'))).toBe(true)
  })

  it('adds a special form stem for Eevee form 1 (Gmax) with shiny suffix', () => {
    const urls = getPokemonSpriteCandidates({
      form: 1,
      gender: 0,
      present: true,
      shiny: true,
      species: 133,
    })
    expect(urls.some((u) => u.includes('a_133-1ps'))).toBe(true)
  })

  it('falls back to non-shiny URL when no shiny candidate is found', () => {
    // Provide a species and a special form that exists only in non-shiny
    // (here we just check that the function always emits a non-shiny fallback line)
    const urls = getPokemonSpriteCandidates({
      form: 0,
      gender: 0,
      present: true,
      shiny: true,
      species: 25,
    })
    // Both artwork-shiny (first entries) and artwork (fallbacks) should be present
    expect(urls.some((u) => u.includes('/artwork-shiny/'))).toBe(true)
    expect(urls.some((u) => u.includes('/artwork/'))).toBe(true)
  })

  it('deduplicates URLs', () => {
    const urls = getPokemonSpriteCandidates({
      form: 0,
      gender: 0,
      present: true,
      shiny: false,
      species: 25,
    })
    const unique = new Set(urls)
    expect(unique.size).toBe(urls.length)
  })
})

describe('getPokemonSpeciesSpriteCandidates', () => {
  it('delegates to getPokemonSpriteCandidates with default slot settings', () => {
    const urls = getPokemonSpeciesSpriteCandidates(25, 0)
    expect(urls.length).toBeGreaterThan(0)
    expect(urls[0]).toContain('a_25')
    expect(urls.every((u) => u.includes('/artwork/'))).toBe(true)
  })

  it('uses the supplied form', () => {
    const urls = getPokemonSpeciesSpriteCandidates(25, 2)
    expect(urls.some((u) => u.includes('a_25-2'))).toBe(true)
  })

  it('always uses non-shiny artwork', () => {
    const urls = getPokemonSpeciesSpriteCandidates(25, 0)
    expect(urls.every((u) => !u.includes('shiny'))).toBe(true)
  })
})
