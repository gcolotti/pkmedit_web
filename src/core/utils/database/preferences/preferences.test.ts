import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  clampDatabasePageSize,
  defaultDatabasePageSize,
  readDatabasePageSize,
  writeDatabasePageSize,
} from './preferences'

const KEY = 'pkmedit.database.pageSize'

describe('preferences', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })
  afterEach(() => {
    window.localStorage.clear()
  })

  describe('defaultDatabasePageSize', () => {
    it('is 40', () => {
      expect(defaultDatabasePageSize).toBe(40)
    })
  })

  describe('clampDatabasePageSize', () => {
    it('falls back to default for 0', () => {
      expect(clampDatabasePageSize(0)).toBe(defaultDatabasePageSize)
    })

    it('floors at 1 for negative values', () => {
      expect(clampDatabasePageSize(-100)).toBe(1)
    })

    it('returns 1 when value rounds down to 1', () => {
      expect(clampDatabasePageSize(0.5)).toBe(defaultDatabasePageSize)
    })

    it('caps at 600', () => {
      expect(clampDatabasePageSize(1000)).toBe(600)
      expect(clampDatabasePageSize(600)).toBe(600)
    })

    it('truncates decimals', () => {
      expect(clampDatabasePageSize(42.9)).toBe(42)
    })

    it('falls back to default for non-finite numbers', () => {
      expect(clampDatabasePageSize(NaN)).toBe(defaultDatabasePageSize)
    })

    it('keeps values within range intact', () => {
      expect(clampDatabasePageSize(50)).toBe(50)
    })
  })

  describe('readDatabasePageSize', () => {
    it('returns the default when localStorage is empty', () => {
      expect(readDatabasePageSize()).toBe(defaultDatabasePageSize)
    })

    it('returns the stored value when valid', () => {
      window.localStorage.setItem(KEY, '100')
      expect(readDatabasePageSize()).toBe(100)
    })

    it('clamps an out-of-range stored value', () => {
      window.localStorage.setItem(KEY, '9999')
      expect(readDatabasePageSize()).toBe(600)
    })

    it('falls back to default when stored value is NaN', () => {
      window.localStorage.setItem(KEY, 'not-a-number')
      expect(readDatabasePageSize()).toBe(defaultDatabasePageSize)
    })
  })

  describe('writeDatabasePageSize', () => {
    it('writes the clamped value to localStorage', () => {
      writeDatabasePageSize(100)
      expect(window.localStorage.getItem(KEY)).toBe('100')
    })

    it('clamps when writing', () => {
      writeDatabasePageSize(9999)
      expect(window.localStorage.getItem(KEY)).toBe('600')
    })

    it('is a no-op when window is undefined (SSR)', () => {
      const original = globalThis.window
      delete (globalThis as { window?: Window }).window
      try {
        expect(() => writeDatabasePageSize(50)).not.toThrow()
      } finally {
        ;(globalThis as { window: Window }).window = original
      }
    })
  })

  describe('readDatabasePageSize (SSR guard)', () => {
    it('returns the default when window is undefined', () => {
      const original = globalThis.window
      delete (globalThis as { window?: Window }).window
      try {
        expect(readDatabasePageSize()).toBe(defaultDatabasePageSize)
      } finally {
        ;(globalThis as { window: Window }).window = original
      }
    })
  })
})
