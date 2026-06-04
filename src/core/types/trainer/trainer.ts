export type TrainerInfo = {
  otName: string
  gender: number
  language: number
  displayTID: number
  displaySID: number
  money: number
  playedHours: number | null
  playedMinutes: number | null
  playedSeconds: number | null
  lastSaved: string | null
  canEditPlayTime: boolean
  canEditMoney: boolean
  saveKind: string
  gameFields: TrainerGameField[]
  gameActions: TrainerGameAction[]
  map: TrainerMapInfo | null
  royale: TrainerRoyaleInfo | null
  dlc: TrainerDlcInfo | null
  images: TrainerImageInfo[]
  timeline: TrainerTimelineEntry[]
  hasDonutPocket?: boolean
  pendingGameActions?: string[]
  collectAllColorfulScrews?: boolean
  collectAllTechnicalMachines?: boolean
  dlcGameFields?: TrainerGameField[]
  dlcGameActions?: TrainerGameAction[]
}

export type TrainerGameField = {
  key: string
  labelKey: string
  kind: 'text' | 'number'
  value: string
  min: number | null
  max: number | null
}

export type TrainerGameAction = {
  key: string
  labelKey: string
}

export type TrainerMapInfo = {
  x: number
  y: number
  z: number
  rotation: number
  map: string
}

export type TrainerRoyaleInfo = {
  regularTicketPoints: number
  infiniteTicketPoints: number
}

export type TrainerDlcInfo = {
  hyperspaceSurveyPoints: number
  streetName: string
}

export type TrainerImageInfo = {
  key: string
  label: string
  width: number
  height: number
  dataBase64: string
}

export type TrainerTimelineEntry = {
  key: string
  labelKey: string
  value: string
  kind: 'date' | 'datetime' | 'duration' | 'text'
  editable?: boolean
}
