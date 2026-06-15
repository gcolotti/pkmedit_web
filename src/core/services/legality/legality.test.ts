import { http, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import { server } from '../../../test/server'
import { createTranslator } from '../../i18n/i18n/i18n'
import type { PokemonDetail } from '../../types/index/index'
import type { SaveSummary } from '../../types/index/index'
import type { LegalityReport } from '../../types/index/index'
import { ApiClient } from '../api/api'
import { checkWorkspaceDraft } from './legality'

const t = createTranslator('en')

const base = (overrides: Partial<PokemonDetail> = {}): PokemonDetail =>
  ({
    cosmetic: { alpha: false },
    evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    hyperTrainedIvs: {
      hp: false,
      atk: false,
      def: false,
      spa: false,
      spd: false,
      spe: false,
    },
    ivs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    main: { nickname: 'X' } as never,
    moves: [],
    origin: {},
    plusMoves: [],
    summary: {
      slotId: 'a',
      species: 1,
      level: 5,
      form: 0,
      shiny: false,
      nature: 0,
      ability: 1,
      abilityNumber: 0,
      heldItem: 0,
      ball: 4,
    },
    trainer: {},
    ...overrides,
  }) as unknown as PokemonDetail

const summary: SaveSummary = { sessionId: 'ses-1' } as unknown as SaveSummary

const makeContext = (
  overrides: Partial<Parameters<typeof checkWorkspaceDraft>[0]> = {},
) => {
  const setDrafts = vi.fn()
  const setDraftViolations = vi.fn()
  const setPokemonLegality = vi.fn()
  const setLegalityReports = vi.fn()
  const setToast = vi.fn()
  const api = new ApiClient(
    () => 'http://api.test',
    () => 'en',
  )
  const ctx = {
    allowIllegalChanges: false,
    api,
    baseDetails: { a: base() },
    draftRequests: [{ slotId: 'a' }] as never,
    drafts: { a: base({ main: { nickname: 'Y' } as never }) },
    selectedSlotId: 'a',
    setDrafts,
    setDraftViolations,
    setPokemonLegality,
    setLegalityReports,
    setToast,
    summary,
    t,
    ...overrides,
  }
  return {
    ...ctx,
    setDrafts,
    setDraftViolations,
    setPokemonLegality,
    setLegalityReports,
    setToast,
  }
}

describe('checkWorkspaceDraft', () => {
  it('returns null when summary is missing', async () => {
    const ctx = makeContext({ summary: null })
    const result = await checkWorkspaceDraft(ctx)
    expect(result).toBeNull()
  })

  it('calls api.checkDraft with all draftRequests when selectedOnly is false', async () => {
    let receivedBody: unknown = null
    server.use(
      http.post('*/api/saves/:id/legality/check-draft', async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json({
          reports: [],
          violations: [],
          blocked: false,
        })
      }),
    )
    await checkWorkspaceDraft(makeContext())
    expect(receivedBody).toEqual({
      allowIllegalChanges: false,
      changes: [{ slotId: 'a' }],
    })
  })

  it('filters to the selected slot when selectedOnly is true and slot exists', async () => {
    let receivedBody: unknown = null
    server.use(
      http.post('*/api/saves/:id/legality/check-draft', async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json({
          reports: [],
          violations: [],
          blocked: false,
        })
      }),
    )
    const ctx = makeContext({
      draftRequests: [{ slotId: 'a' }, { slotId: 'b' }] as never,
      selectedSlotId: 'b',
    })
    await checkWorkspaceDraft(ctx, true)
    expect(receivedBody).toEqual({
      allowIllegalChanges: false,
      changes: [{ slotId: 'b' }],
    })
  })

  it('reads the existing report when selectedOnly, slot selected, and no changes', async () => {
    const existingReport: LegalityReport = {
      slotId: 'a',
      severity: 'ok',
      report: [],
    } as unknown as LegalityReport
    const ctx = makeContext({
      draftRequests: [],
      drafts: { a: base({ legality: existingReport }) },
    })
    const result = await checkWorkspaceDraft(ctx, true)
    expect(result).toEqual(existingReport)
    expect(ctx.setLegalityReports).toHaveBeenCalled()
    expect(ctx.setPokemonLegality).toHaveBeenCalled()
    expect(ctx.setToast).toHaveBeenCalled()
  })

  it('filters out any prior report with the same slotId when reading the existing report', async () => {
    const existingReport: LegalityReport = {
      slotId: 'a',
      severity: 'ok',
      report: [],
    } as unknown as LegalityReport
    const staleReport: LegalityReport = {
      slotId: 'a',
      severity: 'warn',
      report: [],
    } as unknown as LegalityReport
    let captured: ((prev: LegalityReport[]) => LegalityReport[]) | undefined
    const ctx = makeContext({
      draftRequests: [],
      drafts: { a: base({ legality: existingReport }) },
    })
    ctx.setLegalityReports = vi.fn((updater) => {
      captured = updater as (prev: LegalityReport[]) => LegalityReport[]
    })
    const result = await checkWorkspaceDraft(ctx, true)
    expect(result).toEqual(existingReport)
    expect(captured).toBeDefined()
    const next = captured!([
      staleReport,
      { slotId: 'b', severity: 'ok', report: [] } as never,
    ])
    expect(next[0]).toEqual(existingReport)
    expect(next).toHaveLength(2)
  })

  it('returns the selected report when present after API call', async () => {
    const report: LegalityReport = {
      slotId: 'a',
      severity: 'ok',
      report: [],
    } as unknown as LegalityReport
    server.use(
      http.post('*/api/saves/:id/legality/check-draft', () =>
        HttpResponse.json({
          reports: [report],
          violations: [],
          blocked: false,
        }),
      ),
    )
    const result = await checkWorkspaceDraft(makeContext(), true)
    expect(result).toEqual(report)
  })

  it('caches the full selected report returned by the API', async () => {
    const report: LegalityReport = {
      slotId: 'a',
      legal: false,
      severity: 'error',
      report: '',
      checks: [
        {
          identifier: 'PID',
          severity: 'error',
          code: '1',
          valid: false,
          message: 'PID mismatch',
        },
      ],
    }
    server.use(
      http.post('*/api/saves/:id/legality/check-draft', () =>
        HttpResponse.json({
          reports: [report],
          violations: [],
          blocked: false,
        }),
      ),
    )
    const ctx = makeContext()
    await checkWorkspaceDraft(ctx, true)
    const updater = ctx.setPokemonLegality.mock.calls[0]?.[0] as (
      prev: Record<string, unknown>,
    ) => Record<string, { report: LegalityReport }>
    expect(updater({}).a.report).toEqual(report)
  })

  it('emits a blocked toast when the response is blocked', async () => {
    server.use(
      http.post('*/api/saves/:id/legality/check-draft', () =>
        HttpResponse.json({ reports: [], violations: [], blocked: true }),
      ),
    )
    const ctx = makeContext()
    await checkWorkspaceDraft(ctx)
    expect(ctx.setToast).toHaveBeenCalledWith(t('draftHasIllegalChanges'))
  })

  it('emits a success toast when blocked is false', async () => {
    server.use(
      http.post('*/api/saves/:id/legality/check-draft', () =>
        HttpResponse.json({ reports: [], violations: [], blocked: false }),
      ),
    )
    const ctx = makeContext()
    await checkWorkspaceDraft(ctx)
    expect(ctx.setToast).toHaveBeenCalledWith(t('draftChecked'))
  })

  it('emits the selected-only toast when selectedOnly and not blocked', async () => {
    server.use(
      http.post('*/api/saves/:id/legality/check-draft', () =>
        HttpResponse.json({ reports: [], violations: [], blocked: false }),
      ),
    )
    const ctx = makeContext()
    await checkWorkspaceDraft(ctx, true)
    expect(ctx.setToast).toHaveBeenCalledWith(t('selectedDraftChecked'))
  })

  it('falls back to the current detail legality when no report matches the selected slot', async () => {
    server.use(
      http.post('*/api/saves/:id/legality/check-draft', () =>
        HttpResponse.json({ reports: [], violations: [], blocked: false }),
      ),
    )
    const fallback: LegalityReport = {
      slotId: 'a',
      severity: 'ok',
      report: [],
    } as unknown as LegalityReport
    const ctx = makeContext({
      drafts: { a: base({ legality: fallback }) },
    })
    const result = await checkWorkspaceDraft(ctx, true)
    expect(result).toEqual(fallback)
  })

  it('returns null when no slot is selected and selectedOnly is true', async () => {
    server.use(
      http.post('*/api/saves/:id/legality/check-draft', () =>
        HttpResponse.json({ reports: [], violations: [], blocked: false }),
      ),
    )
    const ctx = makeContext({ selectedSlotId: null })
    const result = await checkWorkspaceDraft(ctx, true)
    expect(result).toBeNull()
  })

  it('writes the selected report into drafts and replaces any existing entry with the same slotId', async () => {
    const report: LegalityReport = {
      slotId: 'a',
      severity: 'ok',
      report: [],
    } as unknown as LegalityReport
    const otherReport: LegalityReport = {
      slotId: 'b',
      severity: 'ok',
      report: [],
    } as unknown as LegalityReport
    server.use(
      http.post('*/api/saves/:id/legality/check-draft', () =>
        HttpResponse.json({
          reports: [report, otherReport],
          violations: [],
          blocked: false,
        }),
      ),
    )
    const ctx = makeContext({
      baseDetails: { a: base(), b: base() },
      draftRequests: [{ slotId: 'a' }, { slotId: 'b' }] as never,
      drafts: { a: base({ main: { nickname: 'Y' } as never }), b: base() },
      selectedSlotId: 'a',
    })
    await checkWorkspaceDraft(ctx, true)
    expect(ctx.setDrafts).toHaveBeenCalledOnce()
    const updater = ctx.setDrafts.mock.calls[0]?.[0] as (
      prev: Record<string, PokemonDetail>,
    ) => Record<string, PokemonDetail>
    // simulate an existing report for the same slot in the list
    const next = updater({
      a: base({
        main: { nickname: 'Y' } as never,
        legality: { slotId: 'old' } as never,
      }),
    })
    expect(next.a?.legality).toEqual(report)
  })

  it('writeSelectedReport no-ops when no previous draft exists for the slot', async () => {
    const report: LegalityReport = {
      slotId: 'a',
      severity: 'ok',
      report: [],
    } as unknown as LegalityReport
    server.use(
      http.post('*/api/saves/:id/legality/check-draft', () =>
        HttpResponse.json({
          reports: [report],
          violations: [],
          blocked: false,
        }),
      ),
    )
    // selectedSlotId 'a' has no base and no draft
    const ctx = makeContext({
      baseDetails: {},
      draftRequests: [{ slotId: 'a' }] as never,
      drafts: {},
      selectedSlotId: 'a',
    })
    await checkWorkspaceDraft(ctx, true)
    expect(ctx.setDrafts).toHaveBeenCalledOnce()
    const updater = ctx.setDrafts.mock.calls[0]?.[0] as (
      prev: Record<string, PokemonDetail>,
    ) => Record<string, PokemonDetail>
    const next = updater({})
    expect(next).toEqual({})
  })
})
