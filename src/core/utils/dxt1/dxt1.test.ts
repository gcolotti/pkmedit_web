import { describe, expect, it } from 'vitest'

import { decompressDxt1 } from './dxt1'

// Helper: build a 4x4 DXT1 block (8 bytes) where both endpoints encode 0,0,0 (black).
function blackBlock(): Uint8Array {
  const block = new Uint8Array(8)
  // color0=0, color1=0 → both black; indices=0 → all pixels use c0
  return block
}

function color565(r: number, g: number, b: number): number {
  return ((r & 0x1f) << 11) | ((g & 0x3f) << 5) | (b & 0x1f)
}

describe('decompressDxt1', () => {
  it('decodes a 4x4 block of solid black when endpoints match and indices are zero', () => {
    const data = blackBlock()
    const pixels = decompressDxt1(data, 4, 4)
    expect(pixels).toBeInstanceOf(Uint8ClampedArray)
    expect(pixels).toHaveLength(4 * 4 * 4)
    for (let i = 0; i < pixels.length; i += 4) {
      expect(pixels[i]).toBe(0)
      expect(pixels[i + 1]).toBe(0)
      expect(pixels[i + 2]).toBe(0)
      expect(pixels[i + 3]).toBe(255)
    }
  })

  it('uses index 0 = color0 and index 1 = color1 (color0 > color1 path)', () => {
    // color0=0xffff (white), color1=0 (black). color0 > color1 → c0, c1, lerps (no transparent).
    // Indices: pixel 0 = 0 (c0), pixel 1 = 1 (c1)
    const data = new Uint8Array(8)
    data[0] = 0xff
    data[1] = 0xff
    data[2] = 0
    data[3] = 0
    // bits 0-1 = pixel 0 index, bits 2-3 = pixel 1 index
    // Want: pixel 0 = 0, pixel 1 = 1 → 0b00000100 = 4
    data[4] = 0b00000100
    data[5] = 0
    data[6] = 0
    data[7] = 0
    const pixels = decompressDxt1(data, 4, 4)
    // Pixel 0 (index 0): c0 (white)
    expect(pixels[0]).toBeGreaterThan(200)
    expect(pixels[1]).toBeGreaterThan(200)
    expect(pixels[2]).toBeGreaterThan(200)
    // Pixel 1 (index 1): c1 (black)
    expect(pixels[4]).toBe(0)
    expect(pixels[5]).toBe(0)
    expect(pixels[6]).toBe(0)
  })

  it('uses transparent alpha for index 3 in the color0 <= color1 path', () => {
    // color0 (0) <= color1 (0xffff). index 3 in that path returns [0,0,0,0] (transparent).
    const data = new Uint8Array(8)
    data[0] = 0
    data[1] = 0
    data[2] = 0xff
    data[3] = 0xff
    // pixel 0 index = 3 (binary 11)
    data[4] = 0b00000011
    data[5] = 0
    data[6] = 0
    data[7] = 0
    const pixels = decompressDxt1(data, 4, 4)
    expect(pixels[3]).toBe(0) // alpha
  })

  it('expands 5-bit R, 6-bit G, 5-bit B color channels to 8-bit (rgb565)', () => {
    // Pick mid values: r=0b10000=16, g=0b100000=32, b=0b10000=16
    const c0 = color565(16, 32, 16)
    const c1 = color565(16, 32, 16)
    const data = new Uint8Array(8)
    data[0] = c0 & 0xff
    data[1] = (c0 >> 8) & 0xff
    data[2] = c1 & 0xff
    data[3] = (c1 >> 8) & 0xff
    const pixels = decompressDxt1(data, 4, 4)
    // (16 << 3) | (16 >> 2) = 128 | 4 = 132
    // (32 << 2) | (32 >> 4) = 128 | 2 = 130
    for (let i = 0; i < pixels.length; i += 4) {
      expect(pixels[i]).toBe(132)
      expect(pixels[i + 1]).toBe(130)
      expect(pixels[i + 2]).toBe(132)
      expect(pixels[i + 3]).toBe(255)
    }
  })

  it('decodes multiple blocks (8x8 image = 4 blocks)', () => {
    // All blocks black, all indices 0
    const data = new Uint8Array(8 * 4)
    const pixels = decompressDxt1(data, 8, 8)
    expect(pixels).toHaveLength(8 * 8 * 4)
    // Top-left block (pixels 0..3 of each row, first 4 rows)
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const idx = (row * 8 + col) * 4
        expect(pixels[idx]).toBe(0)
        expect(pixels[idx + 1]).toBe(0)
        expect(pixels[idx + 2]).toBe(0)
        expect(pixels[idx + 3]).toBe(255)
      }
    }
  })
})
