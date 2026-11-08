// Per-slot result of PKHeX's move parse. expectedMoveId is set when PKHeX knows
// which move belongs in the slot (e.g. egg move order, Gen 1/2 learn order).
export type MoveLegality = {
  slot: number
  moveId: number
  valid: boolean
  method: string
  expectedMoveId: number | null
  message: string
}

export type LegalityReport = {
  slotId: string
  legal: boolean
  severity: string
  report: string
  checks: Array<{
    identifier: string
    severity: string
    code: string
    valid: boolean
    message: string
  }>
  // Optional: reports persisted before the backend exposed them lack these.
  moves?: MoveLegality[]
  relearnMoves?: MoveLegality[]
}

export type DraftChange = {
  slotId: string
  label: string
  path: string
  before: string
  after: string
}

export type DraftLegalityViolation = {
  slotId: string
  speciesName: string
  message: string
  before: LegalityReport
  after: LegalityReport
}

export type DraftLegalityResponse = {
  blocked: boolean
  reports: LegalityReport[]
  violations: DraftLegalityViolation[]
}
