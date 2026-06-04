import { describe, expect, it } from 'vitest'

import { hexToRgba } from './color'

describe('hexToRgba', () => {
  it('converts a 6-digit hex to rgba with given alpha', () => {
    expect(hexToRgba('#000000', 1)).toBe('rgba(0, 0, 0, 1)')
    expect(hexToRgba('#ffffff', 0)).toBe('rgba(255, 255, 255, 0)')
  })

  it('parses each channel as hex', () => {
    expect(hexToRgba('#ff0080', 0.5)).toBe('rgba(255, 0, 128, 0.5)')
    expect(hexToRgba('#123456', 1)).toBe('rgba(18, 52, 86, 1)')
  })

  it('preserves an arbitrary alpha', () => {
    expect(hexToRgba('#abcdef', 0.25)).toBe('rgba(171, 205, 239, 0.25)')
  })
})
