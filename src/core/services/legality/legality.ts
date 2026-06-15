import type { Dispatch, SetStateAction } from 'react'

import type { Translator } from '../../i18n/i18n/i18n'
import type { DraftState } from '../../state/draftStoreTypes/draftStoreTypes'
import type { PokemonDraftChange } from '../../types/database/database'
import type {
  DraftLegalityViolation,
  LegalityReport,
  PokemonDetail,
  SaveSummary,
} from '../../types/index/index'
import type { ApiClient } from '../api/api'
import { selectedDetail } from '../draftSelection/draftSelection'
import { buildPokemonLegalityInputKey } from '../pokemonPayload/pokemonPayload'

type CheckWorkspaceDraftContext = {
  allowIllegalChanges: boolean
  api: ApiClient
  baseDetails: Record<string, PokemonDetail>
  draftRequests: PokemonDraftChange[]
  drafts: Record<string, PokemonDetail>
  selectedSlotId: string | null
  setDrafts: Dispatch<SetStateAction<Record<string, PokemonDetail>>>
  setDraftViolations: Dispatch<SetStateAction<DraftLegalityViolation[]>>
  setPokemonLegality: DraftState['setPokemonLegality']
  setLegalityReports: Dispatch<SetStateAction<LegalityReport[]>>
  setToast: (message: string) => void
  summary: SaveSummary | null
  t: Translator
}

export async function checkWorkspaceDraft(
  context: CheckWorkspaceDraftContext,
  selectedOnly = false,
) {
  const {
    allowIllegalChanges,
    api,
    baseDetails,
    draftRequests,
    drafts,
    selectedSlotId,
    summary,
    t,
  } = context
  if (!summary) return null

  const changes = selectedOnly
    ? draftRequests.filter((change) => change.slotId === selectedSlotId)
    : draftRequests
  const currentDetail = selectedDetail(selectedSlotId, drafts, baseDetails)
  if (selectedOnly && selectedSlotId && changes.length === 0)
    return readExistingReport(context, currentDetail)

  const response = await api.checkDraft(
    summary.sessionId,
    changes,
    allowIllegalChanges,
  )
  context.setLegalityReports(response.reports)
  context.setDraftViolations(response.violations)
  const selectedReport = selectedSlotId
    ? (response.reports.find((report) => report.slotId === selectedSlotId) ??
      currentDetail?.legality ??
      null)
    : null
  if (selectedReport && selectedSlotId)
    writeSelectedReport(context, selectedReport, currentDetail)
  context.setToast(
    response.blocked
      ? t('draftHasIllegalChanges')
      : t(selectedOnly ? 'selectedDraftChecked' : 'draftChecked'),
  )
  return selectedOnly ? selectedReport : null
}

function readExistingReport(
  context: CheckWorkspaceDraftContext,
  currentDetail: PokemonDetail | null,
) {
  const report = currentDetail?.legality ?? null
  if (report) {
    context.setLegalityReports((reports) => [
      report,
      ...reports.filter((current) => current.slotId !== context.selectedSlotId),
    ])
    writeCachedLegality(context, report, currentDetail)
  }
  context.setDraftViolations([])
  context.setToast(context.t('selectedDraftChecked'))
  return report
}

function writeSelectedReport(
  context: CheckWorkspaceDraftContext,
  selectedReport: LegalityReport,
  currentDetail: PokemonDetail | null,
) {
  const { baseDetails, selectedSlotId } = context
  context.setDrafts((current) => {
    const previous = selectedSlotId
      ? (current[selectedSlotId] ?? baseDetails[selectedSlotId] ?? null)
      : null
    return previous && selectedSlotId
      ? {
          ...current,
          [selectedSlotId]: {
            ...previous,
            legality: selectedReport,
            // Keep the slot summary's legal flag in sync so the party/boxes
            // legality icon (reads slot.legal) reflects the latest check.
            summary: {
              ...previous.summary,
              legal: selectedReport.legal,
              legalSeverity: selectedReport.legal ? null : selectedReport.severity,
            },
          },
        }
      : current
  })
  writeCachedLegality(context, selectedReport, currentDetail)
}

function writeCachedLegality(
  context: CheckWorkspaceDraftContext,
  report: LegalityReport,
  currentDetail: PokemonDetail | null,
) {
  const { selectedSlotId } = context
  if (!selectedSlotId || !currentDetail) return
  context.setPokemonLegality((current) => ({
    ...current,
    [selectedSlotId]: {
      report,
      checkedAt: Date.now(),
      inputKey: buildPokemonLegalityInputKey(currentDetail),
      status: 'fresh',
      error: null,
    },
  }))
}
