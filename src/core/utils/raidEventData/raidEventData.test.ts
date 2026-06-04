import { describe, expect, it } from 'vitest'

import { getSevenStarEvent } from './raidEventData'

describe('getSevenStarEvent', () => {
  it('returns null for an unknown identifier', () => {
    expect(getSevenStarEvent(99999999)).toBeNull()
  })

  it('returns event info for the Charizard 20221202 event', () => {
    const ev = getSevenStarEvent(20221202)
    expect(ev).not.toBeNull()
    expect(ev?.pokemon).toBe('Charizard')
    expect(ev?.teraTypeKey).toBe('typeDragon')
    expect(ev?.firstRun).toBe('2022-12-02')
  })

  it('returns event info for the Greninja event with a non-default source URL', () => {
    const ev = getSevenStarEvent(20230127)
    expect(ev?.pokemon).toBe('Greninja')
    expect(ev?.teraTypeKey).toBe('typePoison')
    expect(ev?.sourceUrl).toContain('pokemon.com')
  })

  it('uses the bulbapedia URL as default when sourceUrl is not specified', () => {
    const ev = getSevenStarEvent(20221230) // Cinderace, no sourceUrl
    expect(ev?.sourceUrl).toContain('bulbapedia.bulbagarden.net')
  })

  it('returns different events for the two Charizard 2022 events', () => {
    expect(getSevenStarEvent(20221202)?.firstRun).toBe('2022-12-02')
    expect(getSevenStarEvent(20221216)?.firstRun).toBe('2022-12-16')
  })

  it('parses the identifier as a number key', () => {
    // The source uses Number(identifier) so all 8-digit dates are valid keys
    expect(getSevenStarEvent(20260327)?.pokemon).toBe('Empoleon')
  })
})
