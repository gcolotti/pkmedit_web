import { describe, expect, it } from 'vitest'

import {
  isPla,
  restrictMovesToLegal,
  supportsAlpha,
  supportsHeldItem,
} from './gameRules'

describe('gameRules', () => {
  describe('isPla', () => {
    it('is true only for version 47', () => {
      expect(isPla(47)).toBe(true)
      expect(isPla(46)).toBe(false)
      expect(isPla(48)).toBe(false)
      expect(isPla(0)).toBe(false)
    })
  })

  describe('supportsAlpha', () => {
    it('is true for versions 47 and 52', () => {
      expect(supportsAlpha(47)).toBe(true)
      expect(supportsAlpha(52)).toBe(true)
    })

    it('is false otherwise', () => {
      expect(supportsAlpha(46)).toBe(false)
      expect(supportsAlpha(48)).toBe(false)
      expect(supportsAlpha(0)).toBe(false)
    })
  })

  describe('supportsHeldItem', () => {
    it('is false for PLA', () => {
      expect(supportsHeldItem(47)).toBe(false)
    })

    it('is true for non-PLA versions', () => {
      expect(supportsHeldItem(46)).toBe(true)
      expect(supportsHeldItem(48)).toBe(true)
      expect(supportsHeldItem(0)).toBe(true)
    })
  })

  describe('restrictMovesToLegal', () => {
    it('is true for PLA', () => {
      expect(restrictMovesToLegal(47)).toBe(true)
    })

    it('is false for non-PLA versions', () => {
      expect(restrictMovesToLegal(46)).toBe(false)
      expect(restrictMovesToLegal(48)).toBe(false)
    })
  })
})
