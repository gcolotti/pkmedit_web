import { describe, expect, it } from 'vitest'

import type { Translator } from '../../i18n/i18n/i18n'
import type {
  RaidEntry,
  RaidListResponse,
  SevenStarRaidEntry,
} from '../../types/saveFeature/saveFeature'
import {
  getRaidSummary,
  getSevenStarLabel,
  getSvRaidKindLabel,
  getSwshBeamLabel,
  isSevenStarRelevant,
  raidMatchesFilter,
  raidMatchesSearch,
  sevenStarMatchesFilter,
  sevenStarMatchesSearch,
} from './raidDisplay'

const t = ((key: string, params?: Record<string, unknown>) => {
  if (!params) return key
  let out = key
  for (const [k, v] of Object.entries(params))
    out = out.replace(`{${k}}`, String(v))
  return out
}) as Translator

const emptyRaid = (overrides: Partial<RaidEntry> = {}): RaidEntry => ({
  index: 0,
  hash: null,
  seed: null,
  stars: null,
  randRoll: null,
  denType: null,
  flags: null,
  isActive: null,
  isRare: null,
  isWishingPiece: null,
  wattsHarvested: null,
  isEvent: null,
  isEnabled: null,
  areaId: null,
  lotteryGroup: null,
  spawnPointId: null,
  scenePointName: null,
  unused: null,
  content: null,
  isClaimedLeaguePoints: null,
  ...overrides,
})

const empty7Star = (
  overrides: Partial<SevenStarRaidEntry> = {},
): SevenStarRaidEntry => ({
  index: 0,
  identifier: 0,
  captured: false,
  defeated: false,
  ...overrides,
})

describe('isSevenStarRelevant', () => {
  it('returns false when identifier is 0 and not captured/defeated', () => {
    expect(isSevenStarRelevant(empty7Star())).toBe(false)
  })

  it('returns true when identifier > 0', () => {
    expect(isSevenStarRelevant(empty7Star({ identifier: 20230127 }))).toBe(true)
  })

  it('returns true when captured', () => {
    expect(isSevenStarRelevant(empty7Star({ captured: true }))).toBe(true)
  })

  it('returns true when defeated', () => {
    expect(isSevenStarRelevant(empty7Star({ defeated: true }))).toBe(true)
  })
})

describe('getRaidSummary', () => {
  it('returns zeros for an empty list', () => {
    const data: RaidListResponse = {
      saveKind: 'sv',
      groups: [],
      sevenStar: null,
    }
    expect(getRaidSummary(data)).toEqual({
      active: 0,
      event: 0,
      lpPending: 0,
      total: 0,
      unknown: 0,
      wish: 0,
    })
  })

  it('counts active raids (isActive or isEnabled)', () => {
    const data: RaidListResponse = {
      saveKind: 'sv',
      groups: [
        {
          key: 'g',
          labelKey: 'l',
          countUsed: 0,
          countAll: 0,
          raids: [
            emptyRaid({ isActive: true }),
            emptyRaid({ isEnabled: true }),
            emptyRaid({}),
          ],
        },
      ],
      sevenStar: null,
    }
    const summary = getRaidSummary(data)
    expect(summary.active).toBe(2)
    expect(summary.total).toBe(3)
  })

  it('counts event raids (isEvent or content Distribution/Might7)', () => {
    const data: RaidListResponse = {
      saveKind: 'sv',
      groups: [
        {
          key: 'g',
          labelKey: 'l',
          countUsed: 0,
          countAll: 0,
          raids: [
            emptyRaid({ isEvent: true }),
            emptyRaid({ content: 'Distribution' }),
            emptyRaid({ content: 'Might7' }),
            emptyRaid({}),
          ],
        },
      ],
      sevenStar: null,
    }
    expect(getRaidSummary(data).event).toBe(3)
  })

  it('counts unclaimed LP (isClaimedLeaguePoints === false)', () => {
    const data: RaidListResponse = {
      saveKind: 'sv',
      groups: [
        {
          key: 'g',
          labelKey: 'l',
          countUsed: 0,
          countAll: 0,
          raids: [
            emptyRaid({ isClaimedLeaguePoints: false }),
            emptyRaid({ isClaimedLeaguePoints: true }),
            emptyRaid({ isClaimedLeaguePoints: null }),
          ],
        },
      ],
      sevenStar: null,
    }
    expect(getRaidSummary(data).lpPending).toBe(1)
  })

  it('counts wishing piece raids', () => {
    const data: RaidListResponse = {
      saveKind: 'sv',
      groups: [
        {
          key: 'g',
          labelKey: 'l',
          countUsed: 0,
          countAll: 0,
          raids: [
            emptyRaid({ isWishingPiece: true }),
            emptyRaid({ isWishingPiece: false }),
          ],
        },
      ],
      sevenStar: null,
    }
    expect(getRaidSummary(data).wish).toBe(1)
  })

  it('counts unknown 7-star events (identifier > 0 but no event data)', () => {
    const data: RaidListResponse = {
      saveKind: 'sv',
      groups: [],
      sevenStar: {
        raids: [
          empty7Star({ identifier: 99999999, defeated: true }), // unknown
          empty7Star({ identifier: 20221202, defeated: true }), // known
        ],
      },
    }
    expect(getRaidSummary(data).unknown).toBe(1)
  })

  it('skips 7-star unknown count when sevenStar is null', () => {
    const data: RaidListResponse = {
      saveKind: 'sv',
      groups: [],
      sevenStar: null,
    }
    expect(getRaidSummary(data).unknown).toBe(0)
  })
})

describe('raidMatchesFilter', () => {
  it('matches "active" when isActive or isEnabled is true', () => {
    expect(raidMatchesFilter(emptyRaid({ isActive: true }), 'active')).toBe(
      true,
    )
    expect(raidMatchesFilter(emptyRaid({ isEnabled: true }), 'active')).toBe(
      true,
    )
    expect(raidMatchesFilter(emptyRaid({}), 'active')).toBe(false)
  })

  it('matches "event" for isEvent or Distribution/Might7 content', () => {
    expect(raidMatchesFilter(emptyRaid({ isEvent: true }), 'event')).toBe(true)
    expect(
      raidMatchesFilter(emptyRaid({ content: 'Distribution' }), 'event'),
    ).toBe(true)
    expect(raidMatchesFilter(emptyRaid({ content: 'Might7' }), 'event')).toBe(
      true,
    )
    expect(raidMatchesFilter(emptyRaid({ content: 'Base05' }), 'event')).toBe(
      false,
    )
  })

  it('matches "lp" when isClaimedLeaguePoints is false', () => {
    expect(
      raidMatchesFilter(emptyRaid({ isClaimedLeaguePoints: false }), 'lp'),
    ).toBe(true)
    expect(
      raidMatchesFilter(emptyRaid({ isClaimedLeaguePoints: true }), 'lp'),
    ).toBe(false)
  })

  it('matches "unknown" only for SV save (returns false here)', () => {
    expect(raidMatchesFilter(emptyRaid({}), 'unknown')).toBe(false)
  })

  it('matches "wish" when isWishingPiece is true', () => {
    expect(raidMatchesFilter(emptyRaid({ isWishingPiece: true }), 'wish')).toBe(
      true,
    )
    expect(
      raidMatchesFilter(emptyRaid({ isWishingPiece: false }), 'wish'),
    ).toBe(false)
  })

  it('returns true for any other filter', () => {
    expect(raidMatchesFilter(emptyRaid({}), 'all')).toBe(true)
  })
})

describe('sevenStarMatchesFilter', () => {
  it('matches "event" always', () => {
    expect(sevenStarMatchesFilter(empty7Star(), 'event')).toBe(true)
  })

  it('matches "unknown" when no event is found for the identifier', () => {
    expect(
      sevenStarMatchesFilter(empty7Star({ identifier: 99999999 }), 'unknown'),
    ).toBe(true)
    expect(
      sevenStarMatchesFilter(empty7Star({ identifier: 20221202 }), 'unknown'),
    ).toBe(false)
  })

  it('matches "active" when defeated or captured', () => {
    expect(
      sevenStarMatchesFilter(empty7Star({ captured: true }), 'active'),
    ).toBe(true)
    expect(
      sevenStarMatchesFilter(empty7Star({ defeated: true }), 'active'),
    ).toBe(true)
    expect(sevenStarMatchesFilter(empty7Star(), 'active')).toBe(false)
  })

  it('never matches "lp" or "wish"', () => {
    expect(sevenStarMatchesFilter(empty7Star(), 'lp')).toBe(false)
    expect(sevenStarMatchesFilter(empty7Star(), 'wish')).toBe(false)
  })

  it('returns true for any other filter', () => {
    expect(sevenStarMatchesFilter(empty7Star(), 'all')).toBe(true)
  })
})

describe('raidMatchesSearch', () => {
  const raid = emptyRaid({
    index: 0,
    hash: 'abcd1234',
    seed: 'seed-xyz',
    scenePointName: 'Forest Clearing',
    areaId: 42,
    lotteryGroup: 7,
    spawnPointId: 99,
    content: 'Base05',
  })

  it('returns true for an empty query', () => {
    expect(raidMatchesSearch(raid, '', t)).toBe(true)
    expect(raidMatchesSearch(raid, '   ', t)).toBe(true)
  })

  it('matches by hash substring', () => {
    expect(raidMatchesSearch(raid, 'abcd', t)).toBe(true)
  })

  it('matches by scenePointName (case-insensitive)', () => {
    expect(raidMatchesSearch(raid, 'FOREST', t)).toBe(true)
  })

  it('matches by areaId (as number → string)', () => {
    expect(raidMatchesSearch(raid, '42', t)).toBe(true)
  })

  it('matches by content label (uses getSvRaidKindLabel)', () => {
    expect(raidMatchesSearch(raid, 'raidContentTypeBase05', t)).toBe(true)
  })

  it('returns false when no field matches', () => {
    expect(raidMatchesSearch(raid, 'xyzqq', t)).toBe(false)
  })

  it('skips the content field when null and still matches by other fields', () => {
    // content=null takes the `null` branch in the content ternary; the search
    // still works via the remaining fields.
    const noContentRaid = emptyRaid({
      index: 6,
      hash: 'hash1',
      areaId: 42,
      content: null,
    })
    expect(raidMatchesSearch(noContentRaid, 'hash', t)).toBe(true)
    expect(raidMatchesSearch(noContentRaid, '7', t)).toBe(true) // matches index+1
    expect(raidMatchesSearch(noContentRaid, '42', t)).toBe(true) // matches areaId
  })

  it('includes the beam label in the search when denType is set', () => {
    // denType='Rare' takes the truthy branch of the denType ternary, so
    // getSwshBeamLabel is invoked and its result is searchable.
    const raid = emptyRaid({ denType: 'Rare', content: 'Base05' })
    expect(raidMatchesSearch(raid, 'raidBeamRare', t)).toBe(true)
  })
})

describe('sevenStarMatchesSearch', () => {
  it('returns true for an empty query', () => {
    expect(
      sevenStarMatchesSearch(empty7Star({ identifier: 20221202 }), '', t),
    ).toBe(true)
  })

  it('matches by identifier (number)', () => {
    expect(
      sevenStarMatchesSearch(
        empty7Star({ identifier: 20221202 }),
        '20221202',
        t,
      ),
    ).toBe(true)
  })

  it('matches by pokemon name (known event)', () => {
    expect(
      sevenStarMatchesSearch(
        empty7Star({ identifier: 20221202 }),
        'Charizard',
        t,
      ),
    ).toBe(true)
  })

  it('matches by firstRun date', () => {
    expect(
      sevenStarMatchesSearch(
        empty7Star({ identifier: 20221202 }),
        '2022-12-02',
        t,
      ),
    ).toBe(true)
  })

  it('matches by teraTypeKey (localized)', () => {
    expect(
      sevenStarMatchesSearch(
        empty7Star({ identifier: 20221202 }),
        'typeDragon',
        t,
      ),
    ).toBe(true)
  })

  it('falls back to "raidUnknownEvent" for unknown identifiers', () => {
    expect(
      sevenStarMatchesSearch(
        empty7Star({ identifier: 99999999 }),
        'raidUnknownEvent',
        t,
      ),
    ).toBe(true)
  })

  it('returns false when no field matches', () => {
    expect(
      sevenStarMatchesSearch(empty7Star({ identifier: 20221202 }), 'zzzzz', t),
    ).toBe(false)
  })
})

describe('getSwshBeamLabel', () => {
  it('returns "raidBeamInactive" when isActive is false or denType is "None"', () => {
    expect(
      getSwshBeamLabel(emptyRaid({ isActive: false, denType: 'None' }), t),
    ).toBe('raidBeamInactive')
    expect(getSwshBeamLabel(emptyRaid({ isActive: false }), t)).toBe(
      'raidBeamInactive',
    )
  })

  it('returns "raidBeamCrystal" for DynamaxCrystal', () => {
    expect(getSwshBeamLabel(emptyRaid({ denType: 'DynamaxCrystal' }), t)).toBe(
      'raidBeamCrystal',
    )
  })

  it('returns "raidBeamEvent" for isEvent or denType "Event"', () => {
    expect(getSwshBeamLabel(emptyRaid({ isEvent: true }), t)).toBe(
      'raidBeamEvent',
    )
    expect(getSwshBeamLabel(emptyRaid({ denType: 'Event' }), t)).toBe(
      'raidBeamEvent',
    )
  })

  it('returns "raidBeamRare" for isRare, "Rare", or "RareWish"', () => {
    expect(getSwshBeamLabel(emptyRaid({ isRare: true }), t)).toBe(
      'raidBeamRare',
    )
    expect(getSwshBeamLabel(emptyRaid({ denType: 'Rare' }), t)).toBe(
      'raidBeamRare',
    )
    expect(getSwshBeamLabel(emptyRaid({ denType: 'RareWish' }), t)).toBe(
      'raidBeamRare',
    )
  })

  it('returns "raidBeamCommon" as fallback', () => {
    expect(getSwshBeamLabel(emptyRaid({}), t)).toBe('raidBeamCommon')
  })
})

describe('getSvRaidKindLabel', () => {
  it('localizes the kind based on the content string', () => {
    expect(getSvRaidKindLabel('Base05', t)).toBe('raidContentTypeBase05')
    expect(getSvRaidKindLabel('Distribution', t)).toBe(
      'raidContentTypeDistribution',
    )
  })

  it('uses "Base05" as default when content is null', () => {
    expect(getSvRaidKindLabel(null, t)).toBe('raidContentTypeBase05')
  })
})

describe('getSevenStarLabel', () => {
  it('returns the known title when the identifier maps to an event', () => {
    expect(getSevenStarLabel(empty7Star({ identifier: 20221202 }), t)).toBe(
      'raidSevenStarKnownTitle',
    )
  })

  it('returns "raidUnknownEvent" when the identifier has no event', () => {
    expect(getSevenStarLabel(empty7Star({ identifier: 99999999 }), t)).toBe(
      'raidUnknownEvent',
    )
  })
})
