export type UndergroundItemsResponse = {
  items: UndergroundItemEntry[]
}

export type UndergroundItemEntry = {
  index: number
  type: string
  name: string
  count: number
  isNew: boolean
  favorite: boolean
  maxCount: number
}

export type RaidListResponse = {
  saveKind: 'swsh' | 'sv'
  groups: RaidGroup[]
  sevenStar: RaidSevenStar | null
}

export type RaidGroup = {
  key: string
  labelKey: string
  countUsed: number
  countAll: number
  raids: RaidEntry[]
}

export type RaidEntry = {
  index: number
  hash: string | null
  seed: string | null
  stars: number | null
  randRoll: number | null
  denType: string | null
  flags: number | null
  isActive: boolean | null
  isRare: boolean | null
  isWishingPiece: boolean | null
  wattsHarvested: boolean | null
  isEvent: boolean | null
  isEnabled: boolean | null
  areaId: number | null
  lotteryGroup: number | null
  spawnPointId: number | null
  scenePointName: string | null
  unused: number | null
  content: string | null
  isClaimedLeaguePoints: boolean | null
}

export type RaidSevenStar = {
  raids: SevenStarRaidEntry[]
}

export type SevenStarRaidEntry = {
  index: number
  identifier: number
  captured: boolean
  defeated: boolean
}
