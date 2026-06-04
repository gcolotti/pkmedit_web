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
