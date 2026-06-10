import { describe, expect, it } from 'vitest'

import type { ItemBag } from '../../types/index/index'
import type { TrainerInfo } from '../../types/trainer/trainer'
import {
  buildItemsUpdatePayload,
  buildRaidsUpdatePayload,
  buildTrainerUpdatePayload,
  isSameDraft,
} from './draftPayloads'

const makeTrainer = (overrides: Partial<TrainerInfo> = {}): TrainerInfo => ({
  otName: 'A',
  gender: 0,
  language: 0,
  displayTID: 0,
  displaySID: 0,
  money: 0,
  playedHours: null,
  playedMinutes: null,
  playedSeconds: null,
  lastSaved: null,
  canEditPlayTime: false,
  canEditMoney: false,
  saveKind: 'main',
  gameFields: [],
  gameActions: [],
  images: [],
  timeline: [],
  map: null,
  royale: null,
  dlc: null,
  ...overrides,
})

describe('isSameDraft', () => {
  it('returns false when base is null', () => {
    expect(isSameDraft(null, { a: 1 })).toBe(false)
  })

  it('returns true for structurally equal values', () => {
    expect(isSameDraft({ a: 1 }, { a: 1 })).toBe(true)
  })

  it('returns false for structurally different values', () => {
    expect(isSameDraft({ a: 1 }, { a: 2 })).toBe(false)
  })
})

describe('buildTrainerUpdatePayload', () => {
  it('extracts top-level fields from the trainer', () => {
    const trainer = makeTrainer({
      otName: 'Ash',
      language: 1,
      displayTID: 12345,
      displaySID: 54321,
      money: 100,
      gameFields: [
        {
          key: 'a',
          value: '1',
          labelKey: 'a',
          kind: 'text',
          min: null,
          max: null,
        },
      ],
    })
    const payload = buildTrainerUpdatePayload(trainer)
    expect(payload.otName).toBe('Ash')
    expect(payload.gender).toBe(0)
    expect(payload.language).toBe(1)
    expect(payload.displayTID).toBe(12345)
    expect(payload.displaySID).toBe(54321)
    expect(payload.money).toBe(100)
    expect(payload.gameFields).toEqual({ a: '1' })
  })

  it('flattens gameFields and dlcGameFields into a single record', () => {
    const trainer = makeTrainer({
      gameFields: [
        {
          key: 'a',
          value: '1',
          labelKey: 'a',
          kind: 'text',
          min: null,
          max: null,
        },
        {
          key: 'b',
          value: '2',
          labelKey: 'b',
          kind: 'text',
          min: null,
          max: null,
        },
      ],
      dlcGameFields: [
        {
          key: 'c',
          value: '3',
          labelKey: 'c',
          kind: 'text',
          min: null,
          max: null,
        },
      ],
    })
    expect(buildTrainerUpdatePayload(trainer).gameFields).toEqual({
      a: '1',
      b: '2',
      c: '3',
    })
  })

  it('excludes played* and lastSaved when null', () => {
    const payload = buildTrainerUpdatePayload(makeTrainer())
    expect(payload.playedHours).toBeUndefined()
    expect(payload.playedMinutes).toBeUndefined()
    expect(payload.playedSeconds).toBeUndefined()
    expect(payload.lastSaved).toBeUndefined()
  })

  it('includes played* and lastSaved when set', () => {
    const payload = buildTrainerUpdatePayload(
      makeTrainer({
        playedHours: 5,
        playedMinutes: 30,
        playedSeconds: 45,
        lastSaved: '2024-01-01',
      }),
    )
    expect(payload.playedHours).toBe(5)
    expect(payload.playedMinutes).toBe(30)
    expect(payload.playedSeconds).toBe(45)
    expect(payload.lastSaved).toBe('2024-01-01')
  })

  it('excludes map / royale / dlc when null', () => {
    const payload = buildTrainerUpdatePayload(makeTrainer())
    expect(payload.map).toBeUndefined()
    expect(payload.royale).toBeUndefined()
    expect(payload.dlc).toBeUndefined()
  })

  it('includes map / royale / dlc when present', () => {
    const map = { x: 0, y: 0, z: 0, rotation: 0, map: 'm' }
    const royale = { regularTicketPoints: 0, infiniteTicketPoints: 0 }
    const dlc = { hyperspaceSurveyPoints: 0, streetName: '' }
    const payload = buildTrainerUpdatePayload(makeTrainer({ map, royale, dlc }))
    expect(payload.map).toBe(map)
    expect(payload.royale).toBe(royale)
    expect(payload.dlc).toBe(dlc)
  })

  it('omits gameActions when pendingGameActions is empty or missing', () => {
    expect(buildTrainerUpdatePayload(makeTrainer()).gameActions).toBeUndefined()
    expect(
      buildTrainerUpdatePayload(makeTrainer({ pendingGameActions: [] }))
        .gameActions,
    ).toBeUndefined()
  })

  it('includes gameActions when pendingGameActions is non-empty', () => {
    const payload = buildTrainerUpdatePayload(
      makeTrainer({ pendingGameActions: ['x'] }),
    )
    expect(payload.gameActions).toEqual(['x'])
  })

  it('omits collectAllColorfulScrews / collectAllTechnicalMachines when falsy', () => {
    const payload = buildTrainerUpdatePayload(makeTrainer())
    expect(payload.collectAllColorfulScrews).toBeUndefined()
    expect(payload.collectAllTechnicalMachines).toBeUndefined()
  })

  it('includes collectAllColorfulScrews / collectAllTechnicalMachines when truthy', () => {
    const payload = buildTrainerUpdatePayload(
      makeTrainer({
        collectAllColorfulScrews: true,
        collectAllTechnicalMachines: true,
      }),
    )
    expect(payload.collectAllColorfulScrews).toBe(true)
    expect(payload.collectAllTechnicalMachines).toBe(true)
  })

  it('omits timeline when no editable non-text entries are present', () => {
    const trainer = makeTrainer({
      timeline: [
        {
          key: 'k1',
          value: 'v1',
          labelKey: 'k1',
          kind: 'date',
          editable: false,
        },
        { key: 'k2', value: '', labelKey: 'k2', kind: 'date', editable: true },
        {
          key: 'k3',
          value: 'v3',
          labelKey: 'k3',
          kind: 'text',
          editable: true,
        },
      ],
    })
    expect(buildTrainerUpdatePayload(trainer).timeline).toBeUndefined()
  })

  it('includes timeline as a record of editable non-text entries', () => {
    const trainer = makeTrainer({
      timeline: [
        { key: 'k1', value: '', labelKey: 'k1', kind: 'date', editable: true },
        {
          key: 'k2',
          value: 'v2',
          labelKey: 'k2',
          kind: 'date',
          editable: true,
        },
      ],
    })
    expect(buildTrainerUpdatePayload(trainer).timeline).toEqual({ k2: 'v2' })
  })
})

describe('buildItemsUpdatePayload', () => {
  it('maps each pocket with its items', () => {
    const bag: ItemBag = {
      pockets: [
        { pocketKey: 'items', items: [{ id: 1, count: 5 }] },
        { pocketKey: 'berries', items: [] },
      ],
    } as unknown as ItemBag
    const payload = buildItemsUpdatePayload(bag)
    expect(payload.pockets).toEqual([
      { pocketKey: 'items', items: [{ id: 1, count: 5 }] },
      { pocketKey: 'berries', items: [] },
    ])
  })
})

describe('buildRaidsUpdatePayload', () => {
  it('maps groups with key and raids only', () => {
    const data = {
      groups: [
        { key: 'a', raids: [1, 2] },
        { key: 'b', raids: [] },
      ],
      sevenStar: { raids: [3, 4] },
    } as never
    const payload = buildRaidsUpdatePayload(data)
    expect(payload.groups).toEqual([
      { key: 'a', raids: [1, 2] },
      { key: 'b', raids: [] },
    ])
    expect(payload.sevenStar).toEqual([3, 4])
  })

  it('uses null sevenStar.raids when sevenStar is missing', () => {
    const data = { groups: [{ key: 'a', raids: [] }] } as never
    expect(buildRaidsUpdatePayload(data).sevenStar).toBeNull()
  })
})
