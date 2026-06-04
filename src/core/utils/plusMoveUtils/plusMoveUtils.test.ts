import { describe, expect, it, vi } from 'vitest'

import type { CatalogEntry } from '../../types/index/index'
import type { PokemonPlusMoves } from '../../types/pokemon/pokemon'
import * as catalogSort from '../catalogSort/catalogSort'
import {
  buildPlusMoveRows,
  markAllLegalAsPlus,
  updatePlusMoveFlag,
} from './plusMoveUtils'

const move = (id: number, name: string, typeId = 1): CatalogEntry => ({
  id,
  name,
  typeId,
})

const plusMoves = (
  permittedMoves: number[],
  masteredFlags: boolean[],
  purchasedFlags: boolean[] | null = null,
): PokemonPlusMoves => ({
  permittedMoves,
  masteredFlags,
  hasPurchasedFlags: purchasedFlags !== null,
  purchasedFlags: purchasedFlags ?? [],
})

describe('buildPlusMoveRows', () => {
  it('returns rows with correct legal flag based on legalMoveSet', () => {
    const pm = plusMoves([1, 2, 3], [true, false, true])
    const moveById = new Map([[1, move(1, 'A')], [2, move(2, 'B')], [3, move(3, 'C')]])
    const rows = buildPlusMoveRows(pm, moveById, new Set([1, 3]), true)
    expect(rows).toHaveLength(2)
    expect(rows.every((r) => r.legal)).toBe(true)
    expect(rows.map((r) => r.entry.id).sort()).toEqual([1, 3])
  })

  it('returns only illegal rows when legal=false', () => {
    const pm = plusMoves([1, 2, 3], [true, false, true])
    const moveById = new Map([[1, move(1, 'A')], [2, move(2, 'B')], [3, move(3, 'C')]])
    const rows = buildPlusMoveRows(pm, moveById, new Set([1, 3]), false)
    expect(rows).toHaveLength(1)
    expect(rows[0].entry.id).toBe(2)
    expect(rows[0].legal).toBe(false)
  })

  it('uses a placeholder entry when the move id is not in moveById', () => {
    const pm = plusMoves([1, 99], [true, false])
    const moveById = new Map([[1, move(1, 'A')]])
    const rows = buildPlusMoveRows(pm, moveById, new Set([1, 99]), true)
    expect(rows.find((r) => r.entry.id === 99)?.entry.name).toBe('#99')
  })

  it('preserves the original index from permittedMoves', () => {
    const pm = plusMoves([1, 2, 3], [true, false, true])
    const moveById = new Map([[1, move(1, 'A')], [2, move(2, 'B')], [3, move(3, 'C')]])
    // moves 1 and 3 are legal; move 2 is illegal. Filter for illegal rows.
    const rows = buildPlusMoveRows(pm, moveById, new Set([1, 3]), false)
    expect(rows).toHaveLength(1)
    expect(rows[0].entry.id).toBe(2)
    expect(rows[0].index).toBe(1)
  })

  it('returns rows sorted by type then name then id', () => {
    const pm = plusMoves([1, 2, 3], [true, true, true])
    const moveById = new Map([
      [1, move(1, 'Z', 2)],
      [2, move(2, 'A', 1)],
      [3, move(3, 'B', 1)],
    ])
    const rows = buildPlusMoveRows(pm, moveById, new Set([1, 2, 3]), true)
    // Type 1 (entries 2,3) before type 2 (entry 1), then by name within type
    expect(rows.map((r) => r.entry.id)).toEqual([2, 3, 1])
  })

  it('skips entries returned by sort that are not in the legal rows', () => {
    // Defensive guard: if sortCatalogEntriesByType ever returns a phantom
    // entry not present in the legal-filtered rows, the flatMap must drop it
    // instead of emitting a row with a missing match.
    const spy = vi.spyOn(catalogSort, 'sortCatalogEntriesByType')
    const pm = plusMoves([1, 2], [true, true])
    const moveById = new Map([[1, move(1, 'A')], [2, move(2, 'B')]])
    spy.mockReturnValueOnce([move(1, 'A'), { id: 999, name: 'Phantom' }])
    try {
      const rows = buildPlusMoveRows(pm, moveById, new Set([1, 2]), true)
      expect(rows.map((r) => r.entry.id)).toEqual([1])
    } finally {
      spy.mockRestore()
    }
  })
})

describe('markAllLegalAsPlus', () => {
  it('sets mastered flag to true for all legal moves', () => {
    const pm = plusMoves([1, 2, 3], [false, false, false])
    const result = markAllLegalAsPlus(pm, new Set([1, 3]))
    expect(result.masteredFlags).toEqual([true, false, true])
  })

  it('keeps existing mastered flag for illegal moves', () => {
    const pm = plusMoves([1, 2, 3], [true, false, true])
    const result = markAllLegalAsPlus(pm, new Set([1]))
    expect(result.masteredFlags).toEqual([true, false, true])
  })

  it('defaults missing mastered flags to false for illegal moves', () => {
    const pm = { permittedMoves: [1, 2], masteredFlags: [true], hasPurchasedFlags: false, purchasedFlags: [] } as PokemonPlusMoves
    const result = markAllLegalAsPlus(pm, new Set([1]))
    // index 1 has no entry in masteredFlags → undefined ?? false
    expect(result.masteredFlags).toEqual([true, false])
  })

  it('sets purchased flags when hasPurchasedFlags is true', () => {
    const pm = { permittedMoves: [1, 2], masteredFlags: [false, false], hasPurchasedFlags: true, purchasedFlags: [false, false] }
    const result = markAllLegalAsPlus(pm, new Set([2]))
    expect(result.purchasedFlags).toEqual([false, true])
  })

  it('leaves purchased flags unchanged when hasPurchasedFlags is false', () => {
    const pm = { permittedMoves: [1, 2], masteredFlags: [false, false], hasPurchasedFlags: false, purchasedFlags: [true, false] }
    const result = markAllLegalAsPlus(pm, new Set([1, 2]))
    expect(result.purchasedFlags).toEqual([true, false])
  })

  it('defaults missing purchased flags to false when array is shorter than permittedMoves', () => {
    // purchasedFlags has one entry, permittedMoves has three. The mapping at
    // index 2 falls back via `?? false` because the slot is undefined.
    const pm = {
      permittedMoves: [1, 2, 3],
      masteredFlags: [false, false, false],
      hasPurchasedFlags: true,
      purchasedFlags: [true],
    }
    const result = markAllLegalAsPlus(pm, new Set([2]))
    expect(result.purchasedFlags).toEqual([true, true, false])
  })

  it('returns a new object (does not mutate input)', () => {
    const pm = plusMoves([1, 2], [false, false])
    const result = markAllLegalAsPlus(pm, new Set([1]))
    expect(result).not.toBe(pm)
    expect(pm.masteredFlags).toEqual([false, false])
  })
})

describe('updatePlusMoveFlag', () => {
  it('updates the mastered flag at the given index', () => {
    const pm = plusMoves([1, 2, 3], [true, false, true])
    const result = updatePlusMoveFlag(pm, 'masteredFlags', 1, true)
    expect(result.masteredFlags).toEqual([true, true, true])
  })

  it('updates the purchased flag at the given index', () => {
    const pm = { permittedMoves: [1, 2], masteredFlags: [true, false], hasPurchasedFlags: true, purchasedFlags: [false, false] }
    const result = updatePlusMoveFlag(pm, 'purchasedFlags', 0, true)
    expect(result.purchasedFlags).toEqual([true, false])
  })

  it('returns a new object and does not mutate the input', () => {
    const pm = plusMoves([1, 2], [true, false])
    const result = updatePlusMoveFlag(pm, 'masteredFlags', 0, false)
    expect(result).not.toBe(pm)
    expect(pm.masteredFlags).toEqual([true, false])
  })

  it('copies the flags array (does not mutate it)', () => {
    const pm = plusMoves([1, 2], [true, false])
    const result = updatePlusMoveFlag(pm, 'masteredFlags', 0, false)
    expect(result.masteredFlags).not.toBe(pm.masteredFlags)
  })
})
