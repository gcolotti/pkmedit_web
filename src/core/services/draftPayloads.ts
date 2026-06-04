import type { ItemBag } from '../types/index'
import type { RaidListResponse } from '../types/saveFeature'
import type { TrainerInfo } from '../types/trainer'
import { areStructurallyEqual } from './structuralEquality'

export function isSameDraft<T>(base: T | null, draft: T) {
  return base !== null && areStructurallyEqual(base, draft)
}

export function buildTrainerUpdatePayload(trainer: TrainerInfo) {
  return {
    otName: trainer.otName,
    gender: trainer.gender,
    language: trainer.language,
    displayTID: trainer.displayTID,
    displaySID: trainer.displaySID,
    money: trainer.money,
    playedHours: trainer.playedHours ?? undefined,
    playedMinutes: trainer.playedMinutes ?? undefined,
    playedSeconds: trainer.playedSeconds ?? undefined,
    lastSaved: trainer.lastSaved ?? undefined,
    map: trainer.map ?? undefined,
    royale: trainer.royale ?? undefined,
    dlc: trainer.dlc ?? undefined,
    gameFields: Object.fromEntries<string>([
      ...trainer.gameFields.map((field) => [field.key, field.value] as const),
      ...(trainer.dlcGameFields ?? []).map(
        (field) => [field.key, field.value] as const,
      ),
    ]),
    gameActions: trainer.pendingGameActions?.length
      ? trainer.pendingGameActions
      : undefined,
    collectAllColorfulScrews: trainer.collectAllColorfulScrews || undefined,
    collectAllTechnicalMachines:
      trainer.collectAllTechnicalMachines || undefined,
    timeline: buildTimelinePayload(trainer.timeline),
  }
}

function buildTimelinePayload(timeline: TrainerInfo['timeline']) {
  const editable = timeline.filter(
    (entry) => entry.editable && entry.value && entry.kind !== 'text',
  )
  if (editable.length === 0) return undefined
  return Object.fromEntries(editable.map((entry) => [entry.key, entry.value]))
}

export function buildItemsUpdatePayload(bag: ItemBag) {
  return {
    pockets: bag.pockets.map((pocket) => ({
      pocketKey: pocket.pocketKey,
      items: pocket.items,
    })),
  }
}

export function buildRaidsUpdatePayload(data: RaidListResponse) {
  return {
    groups: data.groups.map(({ key, raids }) => ({ key, raids })),
    sevenStar: data.sevenStar?.raids ?? null,
  }
}
