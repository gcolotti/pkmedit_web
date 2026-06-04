import { describe, expect, it } from 'vitest'

import type { Translator } from '../../i18n/i18n/i18n'
import { getRaidHelpContent } from './raidHelpContent'

const t = ((key: string) => key) as Translator

describe('getRaidHelpContent', () => {
  it('returns content with localized title, body, range, example, risk', () => {
    const result = getRaidHelpContent('identifier', t)
    expect(result.title).toBe('raidIdentifier')
    expect(result.body).toBe('raidHelpIdentifier')
    expect(result.range).toBe('raidHelpRangeUint32')
    expect(result.example).toBe('raidHelpExampleIdentifier')
    expect(result.risk).toBe('raidHelpRiskIdentifier')
  })

  it('includes a sourceUrl for the identifier topic (Greninja 2026)', () => {
    const result = getRaidHelpContent('identifier', t)
    expect(result.sourceUrl).toContain('pokemon.com')
  })

  it('omits sourceUrl for topics without one (e.g. flags)', () => {
    const result = getRaidHelpContent('flags', t)
    expect(result.sourceUrl).toBeUndefined()
    expect(result.sourceLabel).toBeUndefined()
  })

  it('includes sourceLabel when sourceUrl is present', () => {
    const result = getRaidHelpContent('identifier', t)
    expect(result.sourceLabel).toBe('learnMore')
  })

  it('returns the correct content for "denType"', () => {
    const result = getRaidHelpContent('denType', t)
    expect(result.title).toBe('raidDenType')
    expect(result.sourceUrl).toContain('serebii.net')
  })

  it('returns the correct content for "hash"', () => {
    const result = getRaidHelpContent('hash', t)
    expect(result.title).toBe('raidHash')
    expect(result.sourceUrl).toContain('serebii.net')
  })

  it('returns the correct content for "stars"', () => {
    const result = getRaidHelpContent('stars', t)
    expect(result.title).toBe('raidStars')
  })

  it('returns the correct content for "lp" with bulbapedia URL', () => {
    const result = getRaidHelpContent('lp', t)
    expect(result.title).toBe('raidClaimedLp')
    expect(result.sourceUrl).toContain('bulbapedia.bulbagarden.net')
  })

  it('returns the correct content for boolean topics (captured, defeated)', () => {
    expect(getRaidHelpContent('captured', t).title).toBe('raidCaptured')
    expect(getRaidHelpContent('defeated', t).title).toBe('raidDefeated')
  })

  it('returns the correct content for location/seed topics', () => {
    expect(getRaidHelpContent('areaId', t).title).toBe('raidArea')
    expect(getRaidHelpContent('seed', t).title).toBe('raidSeed')
    expect(getRaidHelpContent('lotteryGroup', t).title).toBe('raidLotteryGroup')
    expect(getRaidHelpContent('spawnPointId', t).title).toBe('raidSpawnPoint')
    expect(getRaidHelpContent('randRoll', t).title).toBe('raidRandRoll')
  })
})
