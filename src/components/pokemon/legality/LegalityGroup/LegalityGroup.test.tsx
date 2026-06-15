import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { LegalGenerateResponse, PokemonDetail } from '../../../../core/types/index/index'
import { LegalityGroup } from './LegalityGroup'

const previewLegalGenerate = vi.fn<(s: string, id: string, req: unknown) => Promise<LegalGenerateResponse>>()
const showToast = vi.fn()

vi.mock('../../../../core/hooks/workspaceContext/workspaceContext', () => ({
  useWorkspace: () => ({
    api: {
      pokemon: {
        previewLegalGenerate,
      },
    },
  }),
}))

vi.mock('../../../../core/state/uiStore/uiStore', () => ({
  useUiStore: (selector: (s: { showToast: () => void }) => unknown) =>
    selector({ showToast }),
}))

import type { Translator } from '../../../../core/i18n/i18n/i18n'
const t = ((key: string) => key) as Translator

const baseLegal = {
  slotId: 'a',
  legal: true,
  severity: 'ok',
  report: '',
  checks: [],
}

const illegalReport = {
  slotId: 'a',
  legal: false,
  severity: 'error',
  report: '',
  checks: [
    { identifier: 'PID', severity: 'error', code: '0', valid: false, message: 'pid bad' },
  ],
}

function makeDraft(overrides: Partial<PokemonDetail> = {}): PokemonDetail {
  return {
    summary: {
      slotId: 'a',
      present: true,
      species: 25,
      speciesName: 'Pikachu',
      form: 0,
      level: 5,
      shiny: false,
      gender: 1,
      nature: 0,
      ability: 1,
      abilityNumber: 0,
      heldItem: 0,
      ball: 4,
      legal: true,
      alpha: false,
      egg: false,
      hasItem: false,
      legalSeverity: 'ok',
    },
    cosmetic: {
      alpha: false,
      height: 0,
      weight: 0,
      scale: 0,
      contest: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      markings: [],
      ribbons: [],
      homeTracker: 0,
      formArgument: 0,
      formArgumentRemain: 0,
      formArgumentElapsed: 0,
      formArgumentMaximum: 0,
      extraBytes: [],
    },
    legality: baseLegal,
    ...overrides,
  } as unknown as PokemonDetail
}

beforeEach(() => {
  previewLegalGenerate.mockReset()
  showToast.mockReset()
})

describe('LegalityGroup', () => {
  it('runs the onCheck callback on mount to refresh the slot', async () => {
    const onCheck = vi.fn().mockResolvedValue(undefined)
    render(
      <LegalityGroup
        draft={makeDraft()}
        onCheck={onCheck}
        onOpenAdvanced={() => {}}
        saveGameVersion={42}
        selectedSlotId="a"
        sessionId="ses-1"
        setDraft={() => {}}
        t={t}
      />,
    )
    await waitFor(() => expect(onCheck).toHaveBeenCalledTimes(1))
  })

  it('disables the Generate button when the slot is already legal and objectives are met', () => {
    render(
      <LegalityGroup
        draft={makeDraft({ legality: baseLegal })}
        onCheck={() => Promise.resolve()}
        onOpenAdvanced={() => {}}
        saveGameVersion={42}
        selectedSlotId="a"
        sessionId="ses-1"
        setDraft={() => {}}
        t={t}
      />,
    )
    const generateButton = screen.getByRole('button', { name: 'generateLegal' })
    expect(generateButton).toBeDisabled()
    expect(screen.getByText('generateLegalAlreadyLegal')).toBeInTheDocument()
  })

  it('enables the Generate button when the slot is illegal', () => {
    render(
      <LegalityGroup
        draft={makeDraft({ legality: illegalReport })}
        onCheck={() => Promise.resolve()}
        onOpenAdvanced={() => {}}
        saveGameVersion={42}
        selectedSlotId="a"
        sessionId="ses-1"
        setDraft={() => {}}
        t={t}
      />,
    )
    expect(screen.getByRole('button', { name: 'generateLegal' })).toBeEnabled()
  })

  it('calls the api.pokemon.previewLegalGenerate and setDraft on Generate', async () => {
    previewLegalGenerate.mockResolvedValue({
      draft: makeDraft({ legality: baseLegal }),
      legality: baseLegal,
      alphaPreserved: true,
      warning: null,
    })
    const setDraft = vi.fn()
    render(
      <LegalityGroup
        draft={makeDraft({ legality: illegalReport })}
        onCheck={() => Promise.resolve()}
        onOpenAdvanced={() => {}}
        saveGameVersion={42}
        selectedSlotId="a"
        sessionId="ses-1"
        setDraft={setDraft}
        t={t}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'generateLegal' }))
    await waitFor(() => expect(previewLegalGenerate).toHaveBeenCalledTimes(1))
    expect(setDraft).toHaveBeenCalled()
  })

  it('shows a toast when the backend drops the alpha flag', async () => {
    previewLegalGenerate.mockResolvedValue({
      draft: makeDraft({ legality: baseLegal }),
      legality: baseLegal,
      alphaPreserved: false,
      warning: null,
    })
    render(
      <LegalityGroup
        draft={makeDraft({
          legality: illegalReport,
          cosmetic: { ...makeDraft().cosmetic, alpha: true },
          summary: { ...makeDraft().summary, alpha: true },
        })}
        onCheck={() => Promise.resolve()}
        onOpenAdvanced={() => {}}
        saveGameVersion={42}
        selectedSlotId="a"
        sessionId="ses-1"
        setDraft={() => {}}
        t={t}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'generateLegal' }))
    await waitFor(() => expect(showToast).toHaveBeenCalledWith('alphaDropped'))
  })

  it('invokes onOpenAdvanced when the Review & fix button is clicked', async () => {
    const onOpenAdvanced = vi.fn()
    render(
      <LegalityGroup
        draft={makeDraft()}
        onCheck={() => Promise.resolve()}
        onOpenAdvanced={onOpenAdvanced}
        saveGameVersion={42}
        selectedSlotId="a"
        sessionId="ses-1"
        setDraft={() => {}}
        t={t}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'reviewAndFix' }))
    expect(onOpenAdvanced).toHaveBeenCalledTimes(1)
  })
})
