import { describe, expect, it } from 'vitest'

import type { CatalogEntry } from '../../types/index/index'
import { setTypeCatalog } from '../typeData/typeData'
import {
  groupCatalogEntriesByType,
  sortCatalogEntriesByName,
  sortCatalogEntriesByType,
} from './catalogSort'

const makeEntry = (
  id: number,
  name: string,
  typeId?: number,
): CatalogEntry => ({ id, name, typeId })

const noopT = ((key: string) => key) as never

describe('sortCatalogEntriesByName', () => {
  it('sorts alphabetically by name (locale-aware)', () => {
    const entries = [
      makeEntry(1, 'Charlie'),
      makeEntry(2, 'Alpha'),
      makeEntry(3, 'Bravo'),
    ]
    const sorted = sortCatalogEntriesByName(entries)
    expect(sorted.map((e) => e.name)).toEqual(['Alpha', 'Bravo', 'Charlie'])
  })

  it('breaks ties on id', () => {
    const entries = [makeEntry(2, 'A'), makeEntry(1, 'A')]
    expect(sortCatalogEntriesByName(entries).map((e) => e.id)).toEqual([1, 2])
  })

  it('returns a new array (does not mutate the input)', () => {
    const entries = [makeEntry(1, 'B'), makeEntry(2, 'A')]
    const original = [...entries]
    sortCatalogEntriesByName(entries)
    expect(entries).toEqual(original)
  })
})

describe('sortCatalogEntriesByType', () => {
  it('sorts entries without typeId last', () => {
    const entries = [
      makeEntry(1, 'A', 5),
      makeEntry(2, 'B'),
      makeEntry(3, 'C', 1),
    ]
    const sorted = sortCatalogEntriesByType(entries)
    expect(sorted.map((e) => e.id)).toEqual([3, 1, 2])
  })

  it('breaks ties on name, then id (ascending)', () => {
    const entries = [
      makeEntry(1, 'B', 1),
      makeEntry(2, 'A', 1),
      makeEntry(3, 'A', 1),
    ]
    const sorted = sortCatalogEntriesByType(entries)
    expect(sorted.map((e) => e.id)).toEqual([2, 3, 1])
  })
})

describe('groupCatalogEntriesByType', () => {
  it('groups entries by typeId', () => {
    const entries = [
      makeEntry(1, 'A', 1),
      makeEntry(2, 'B', 2),
      makeEntry(3, 'C', 1),
    ]
    const groups = groupCatalogEntriesByType(entries, noopT)
    expect(groups).toHaveLength(2)
    const group1 = groups.find((g) => g.key === '1')
    expect(group1?.entries.map((e) => e.id).sort()).toEqual([1, 3])
  })

  it('groups entries without typeId under "unknown"', () => {
    const entries = [makeEntry(1, 'A'), makeEntry(2, 'B', 1)]
    const groups = groupCatalogEntriesByType(entries, noopT)
    const unknown = groups.find((g) => g.key === 'unknown')
    expect(unknown?.entries.map((e) => e.id)).toEqual([1])
    expect(unknown?.label).toBe('typeUnknown')
  })

  it('uses getTypeName for known typeIds', () => {
    setTypeCatalog([{ id: 42, name: 'Type-42' }])
    try {
      const tMock = ((key: string) =>
        key === 'typeUnknown' ? '???' : key) as never
      const entries = [makeEntry(1, 'A', 42)]
      const groups = groupCatalogEntriesByType(entries, tMock)
      expect(groups[0].label).toBe('Type-42')
    } finally {
      setTypeCatalog([])
    }
  })
})
