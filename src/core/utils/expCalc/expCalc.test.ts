import { describe, expect, it } from 'vitest'

import { expForLevel } from './expCalc'

describe('expForLevel', () => {
  it('returns 0 for level <= 1 regardless of growth rate', () => {
    for (let rate = 0; rate < 6; rate++) {
      expect(expForLevel(0, rate)).toBe(0)
      expect(expForLevel(1, rate)).toBe(0)
      expect(expForLevel(-5, rate)).toBe(0)
    }
  })

  it('MediumFast: n^3', () => {
    expect(expForLevel(2, 0)).toBe(8)
    expect(expForLevel(10, 0)).toBe(1000)
    expect(expForLevel(50, 0)).toBe(125_000)
  })

  it('Erratic: piecewise for n <= 50, 68, 98, and above', () => {
    // n=10: floor((1000 * 90)/50) = 1800
    expect(expForLevel(10, 1)).toBe(1800)
    // n=60: floor((216000 * 90)/100) = 194400
    expect(expForLevel(60, 1)).toBe(194_400)
    // n=80: floor((512000 * floor((1911-800)/3))/500) = floor(512000*floor(1111/3)/500)
    // floor(1111/3)=370, 512000*370/500 = 378880
    expect(expForLevel(80, 1)).toBe(378_880)
    // n=100: floor((1_000_000 * 60) / 100) = 600000
    expect(expForLevel(100, 1)).toBe(600_000)
  })

  it('Fluctuating: piecewise for n <= 15, 35, and above', () => {
    // n=10: floor((1000 * (floor(11/3)+24))/50) = floor(1000*27/50) = 540
    expect(expForLevel(10, 2)).toBe(540)
    // n=20: floor((8000 * 34) / 50) = 5440
    expect(expForLevel(20, 2)).toBe(5440)
    // n=50: floor((125000 * (25+32)) / 50) = floor(125000*57/50) = 142500
    expect(expForLevel(50, 2)).toBe(142_500)
  })

  it('MediumSlow: (6/5)n^3 - 15n^2 + 100n - 140, clamped at 0', () => {
    // n=2: floor(48/5) - 60 + 200 - 140 = 9 - 0 = 9
    expect(expForLevel(2, 3)).toBe(9)
    // n=10: floor(6000/5) - 1500 + 1000 - 140 = 1200 - 640 = 560
    expect(expForLevel(10, 3)).toBe(560)
    // n=50: floor(750000/5) - 37500 + 5000 - 140 = 150000 - 32640 = 117360
    expect(expForLevel(50, 3)).toBe(117_360)
  })

  it('Fast: floor(4n^3/5)', () => {
    expect(expForLevel(5, 4)).toBe(100)
    expect(expForLevel(10, 4)).toBe(800)
    expect(expForLevel(100, 4)).toBe(800_000)
  })

  it('Slow: floor(5n^3/4)', () => {
    expect(expForLevel(5, 5)).toBe(156)
    expect(expForLevel(10, 5)).toBe(1250)
    expect(expForLevel(100, 5)).toBe(1_250_000)
  })

  it('falls back to n^3 for unknown growth rate', () => {
    expect(expForLevel(5, 99)).toBe(125)
    expect(expForLevel(10, -1)).toBe(1000)
  })

  it('level 1 always returns 0 even for erratic/fluctuating', () => {
    expect(expForLevel(1, 1)).toBe(0)
    expect(expForLevel(1, 2)).toBe(0)
  })

  it('mediumSlow at n=2 does not clamp below 0', () => {
    // n=2 result is 2 (not 0), so Math.max(0, …) never clamps here
    expect(expForLevel(2, 3)).toBeGreaterThan(0)
  })
})
