import { describe, expect, it } from 'vitest'

import { areStructurallyEqual } from './structuralEquality'

describe('areStructurallyEqual', () => {
  it('returns true for identical primitives via Object.is', () => {
    expect(areStructurallyEqual(1, 1)).toBe(true)
    expect(areStructurallyEqual('a', 'a')).toBe(true)
    expect(areStructurallyEqual(true, true)).toBe(true)
    expect(areStructurallyEqual(null, null)).toBe(true)
    expect(areStructurallyEqual(undefined, undefined)).toBe(true)
    expect(areStructurallyEqual(NaN, NaN)).toBe(true)
  })

  it('returns false for primitives of different types', () => {
    expect(areStructurallyEqual(1, '1')).toBe(false)
    expect(areStructurallyEqual(0, false)).toBe(false)
    expect(areStructurallyEqual(null, undefined)).toBe(false)
  })

  it('returns false when one side is null and the other is an object', () => {
    expect(areStructurallyEqual(null, {})).toBe(false)
    expect(areStructurallyEqual({}, null)).toBe(false)
  })

  it('compares Dates by time', () => {
    const a = new Date(1000)
    const b = new Date(1000)
    const c = new Date(2000)
    expect(areStructurallyEqual(a, b)).toBe(true)
    expect(areStructurallyEqual(a, c)).toBe(false)
    expect(areStructurallyEqual(a, 'not-a-date')).toBe(false)
    expect(areStructurallyEqual('not-a-date', b)).toBe(false)
  })

  it('compares arrays element-by-element', () => {
    expect(areStructurallyEqual([1, 2, 3], [1, 2, 3])).toBe(true)
    expect(areStructurallyEqual([1, 2, 3], [1, 2])).toBe(false)
    expect(areStructurallyEqual([1, 2, 3], [1, 2, 4])).toBe(false)
    expect(areStructurallyEqual([], [])).toBe(true)
  })

  it('returns false when one side is array and the other is not', () => {
    expect(areStructurallyEqual([1, 2], { 0: 1, 1: 2 })).toBe(false)
    expect(areStructurallyEqual({ 0: 1, 1: 2 }, [1, 2])).toBe(false)
  })

  it('compares nested arrays', () => {
    expect(areStructurallyEqual([[1], [2]], [[1], [2]])).toBe(true)
    expect(areStructurallyEqual([[1], [2]], [[1], [3]])).toBe(false)
  })

  it('compares plain objects by key set and values', () => {
    expect(areStructurallyEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
    expect(areStructurallyEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false)
    expect(areStructurallyEqual({ a: 1 }, { a: 1, b: undefined })).toBe(true)
  })

  it('ignores keys whose value is undefined', () => {
    expect(
      areStructurallyEqual({ a: 1, b: undefined }, { a: 1, b: 2, c: 3 }),
    ).toBe(false)
  })

  it('returns false when only one side has the key', () => {
    expect(areStructurallyEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
    expect(areStructurallyEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false)
  })

  it('returns true for two empty objects', () => {
    expect(areStructurallyEqual({}, {})).toBe(true)
  })

  it('handles nested objects', () => {
    expect(
      areStructurallyEqual(
        { a: { b: 1, c: [1, 2] } },
        { a: { b: 1, c: [1, 2] } },
      ),
    ).toBe(true)
    expect(
      areStructurallyEqual(
        { a: { b: 1, c: [1, 2] } },
        { a: { b: 1, c: [1, 3] } },
      ),
    ).toBe(false)
  })
})
