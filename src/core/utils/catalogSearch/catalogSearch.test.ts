import { describe, expect, it } from 'vitest'

import type { CatalogEntry } from '../../types/index/index'
import { getCatalogSearchResults } from './catalogSearch'

const makeEntry = (id: number, name: string): CatalogEntry => ({ id, name })

describe('getCatalogSearchResults', () => {
  it('returns sorted entries when query is empty (with selectedId first)', () => {
    const entries = [makeEntry(1, 'Bravo'), makeEntry(2, 'Alpha'), makeEntry(3, 'Charlie')]
    const result = getCatalogSearchResults(entries, '')
    expect(result.map((e) => e.id)).toEqual([2, 1, 3])
  })

  it('returns sorted entries when query is whitespace only', () => {
    const entries = [makeEntry(2, 'Alpha'), makeEntry(1, 'Bravo')]
    expect(getCatalogSearchResults(entries, '   ').map((e) => e.id)).toEqual([2, 1])
  })

  it('puts the selectedId first when it exists in the entry list', () => {
    const entries = [makeEntry(1, 'Alpha'), makeEntry(2, 'Bravo'), makeEntry(3, 'Charlie')]
    const result = getCatalogSearchResults(entries, '', 2)
    expect(result[0].id).toBe(2)
    expect(result.slice(1).map((e) => e.id)).toEqual([1, 3])
  })

  it('ignores selectedId when not in entries (just returns sorted)', () => {
    const entries = [makeEntry(1, 'Alpha'), makeEntry(2, 'Bravo')]
    const result = getCatalogSearchResults(entries, '', 99)
    expect(result.map((e) => e.id)).toEqual([1, 2])
  })

  it('finds entries by name substring (case-insensitive)', () => {
    const entries = [makeEntry(1, 'FlyingPichu'), makeEntry(2, 'Charizard'), makeEntry(3, 'Pichu')]
    const result = getCatalogSearchResults(entries, 'pich')
    // FlyingPichu has 'pich' at index 6; Pichu has it at index 0
    expect(result.map((e) => e.id)).toEqual([3, 1])
  })

  it('finds entries by id substring', () => {
    const entries = [makeEntry(25, 'Pikachu'), makeEntry(26, 'Raichu'), makeEntry(250, 'Hippopotas')]
    const result = getCatalogSearchResults(entries, '25')
    // Match in id "25" or "250"
    expect(result.map((e) => e.id)).toEqual([25, 250])
  })

  it('prioritizes entries that start with the query (sorted by name length on tie)', () => {
    const entries = [makeEntry(1, 'Bulbasaur'), makeEntry(2, 'Pikachu'), makeEntry(3, 'Pichu')]
    // For query "pi", both Pikachu and Pichu start with pi (matchIndex=0);
    // tie broken by length: Pichu (5) < Pikachu (7) → Pichu first.
    const result = getCatalogSearchResults(entries, 'pi')
    expect(result.map((e) => e.id)).toEqual([3, 2])
  })

  it('strips diacritics when normalizing for search', () => {
    const entries = [makeEntry(1, 'Flabébé'), makeEntry(2, 'Flaaffy')]
    const result = getCatalogSearchResults(entries, 'flabebe')
    expect(result.map((e) => e.id)).toEqual([1])
  })

  it('returns at most 10 results', () => {
    const entries = Array.from({ length: 30 }, (_, i) => makeEntry(i + 1, `Mon${i + 1}`))
    const result = getCatalogSearchResults(entries, 'mon')
    expect(result).toHaveLength(10)
  })

  it('returns empty array when nothing matches', () => {
    const entries = [makeEntry(1, 'Pikachu'), makeEntry(2, 'Charizard')]
    expect(getCatalogSearchResults(entries, 'xyz')).toEqual([])
  })

  it('ranks exact prefix matches above partial matches', () => {
    const entries = [makeEntry(1, 'Aaaa Pikachu'), makeEntry(2, 'Pikachu')]
    // For query "pika", Pikachu starts with it, Aaaa Pikachu has it later
    const result = getCatalogSearchResults(entries, 'pika')
    expect(result[0].id).toBe(2)
  })

  it('places prefix-matching entries before substring-only matches', () => {
    // "Cap Pikachu" has 'pik' at position 4; "Pikachu" has it at 0. The prefix
    // one (startsWith) should come first regardless of match index ordering.
    const entries = [makeEntry(1, 'Cap Pikachu'), makeEntry(2, 'Pikachu')]
    const result = getCatalogSearchResults(entries, 'pik')
    expect(result[0].id).toBe(2)
  })

  it('breaks ties by length when entries share startsWith and matchIndex', () => {
    // Both Pichu and Pikachu start with 'pi' (startsWith=0, matchIndex=0).
    // The comparator falls through startsWith (0-0) and matchIndex (0-0),
    // then length (5<7) breaks the tie → Pichu first.
    const entries = [makeEntry(1, 'Pichu'), makeEntry(2, 'Pikachu')]
    const result = getCatalogSearchResults(entries, 'pi')
    expect(result.map((e) => e.id)).toEqual([1, 2])
  })
})
