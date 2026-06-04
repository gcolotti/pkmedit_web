import { describe, expect, it } from 'vitest'

import {
  BYTE_MAX,
  clampNumber,
  MAX_SAFE_INTEGER,
  parseClampedNumberInput,
  UINT16_MAX,
  UINT32_MAX,
} from './numberInput'

describe('constants', () => {
  it('exposes byte/u16/u32/MAX_SAFE_INTEGER constants', () => {
    expect(BYTE_MAX).toBe(255)
    expect(UINT16_MAX).toBe(65_535)
    expect(UINT32_MAX).toBe(4_294_967_295)
    expect(MAX_SAFE_INTEGER).toBe(Number.MAX_SAFE_INTEGER)
  })
})

describe('clampNumber', () => {
  it('returns the value when no bounds are set', () => {
    expect(clampNumber(0)).toBe(0)
    expect(clampNumber(123)).toBe(123)
    expect(clampNumber(-50)).toBe(-50)
  })

  it('clamps to min', () => {
    expect(clampNumber(5, { min: 10 })).toBe(10)
    expect(clampNumber(-3, { min: 0 })).toBe(0)
  })

  it('clamps to max', () => {
    expect(clampNumber(15, { max: 10 })).toBe(10)
    expect(clampNumber(100, { max: 50 })).toBe(50)
  })

  it('clamps to both min and max', () => {
    expect(clampNumber(5, { min: 0, max: 10 })).toBe(5)
    expect(clampNumber(-5, { min: 0, max: 10 })).toBe(0)
    expect(clampNumber(15, { min: 0, max: 10 })).toBe(10)
  })

  it('keeps value when within bounds', () => {
    expect(clampNumber(5, { min: 0, max: 10 })).toBe(5)
  })
})

describe('parseClampedNumberInput', () => {
  it('returns 0 for empty string when no fallback given', () => {
    expect(parseClampedNumberInput('')).toBe(0)
    expect(parseClampedNumberInput('   ')).toBe(0)
  })

  it('parses a numeric string', () => {
    expect(parseClampedNumberInput('42')).toBe(42)
    expect(parseClampedNumberInput('-3')).toBe(-3)
  })

  it('uses the explicit fallback when input is empty or unparseable', () => {
    expect(parseClampedNumberInput('', { fallback: 7 })).toBe(7)
    expect(parseClampedNumberInput('abc', { fallback: 7 })).toBe(7)
  })

  it('uses min as fallback when no explicit fallback is given', () => {
    expect(parseClampedNumberInput('', { min: 5 })).toBe(5)
    expect(parseClampedNumberInput('not a number', { min: 5 })).toBe(5)
  })

  it('clamps parsed value to max', () => {
    expect(parseClampedNumberInput('100', { max: 10 })).toBe(10)
  })

  it('clamps parsed value to min', () => {
    expect(parseClampedNumberInput('-100', { min: 0 })).toBe(0)
  })

  it('trims surrounding whitespace before parsing', () => {
    expect(parseClampedNumberInput('  42  ')).toBe(42)
  })

  it('handles decimals', () => {
    expect(parseClampedNumberInput('3.14')).toBe(3.14)
  })

  it('returns 0 for input that parses to NaN with no options', () => {
    expect(parseClampedNumberInput('abc')).toBe(0)
  })
})
