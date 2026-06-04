import { ClipboardPaste, Copy } from 'lucide-react'
import { memo, useState } from 'react'

import type { LegalityReport } from '../../core/types/index'
import type { PokemonEditorPanelProps } from '../../core/types/pokemonEditorPanel'
import { supportsAlpha } from '../../core/utils/gameRules'
import {
  LegalityCheckButton,
  type LegalityCheckState,
} from '../legality/LegalityCheckButton'
import { EditorTabs } from '../ui/EditorTabs'
import { PokemonEditor } from './PokemonEditor'
import { PokemonHeaderIdentity } from './PokemonHeaderIdentity'
import { PokemonTraitControls } from './PokemonTraitIndicators'

export const PokemonEditorPanel = memo(function PokemonEditorPanel({
  activeTab,
  catalogs,
  draft,
  language,
  onCheck,
  onActiveTabChange,
  onCopyPokemon,
  onFormChange,
  onOpenMovesBrowser,
  onOpenTypeChart,
  onPastePokemon,
  onSpeciesChange,
  pokemonClipboard,
  saveGameVersion,
  selectedSlotId,
  sessionId,
  setDraft,
  t,
}: PokemonEditorPanelProps) {
  const btnClass =
    'grid h-9 w-9 place-items-center rounded-md border transition disabled:cursor-not-allowed disabled:opacity-50 border-black/15 text-stone-500 hover:bg-black/5 dark:border-white/15 dark:text-stone-400 dark:hover:bg-white/5'
  const alphaSupported = supportsAlpha(saveGameVersion)
  const [checkResult, setCheckResult] = useState<{
    report: LegalityReport | null
    slotId: string | null
    state: LegalityCheckState
  }>({ report: null, slotId: null, state: 'unchecked' })
  const checkedReport =
    checkResult.slotId === selectedSlotId ? checkResult.report : null
  const checkState =
    checkResult.slotId === selectedSlotId
      ? checkResult.state
      : draft && !draft.legality.legal
        ? 'illegal'
        : 'unchecked'

  async function handleCheck() {
    setCheckResult({ report: null, slotId: selectedSlotId, state: 'checking' })
    try {
      const report = await onCheck()
      const state: LegalityCheckState = report
        ? report.legal
          ? 'legal'
          : 'illegal'
        : draft && !draft.legality.legal
          ? 'illegal'
          : 'unchecked'
      setCheckResult({ report, slotId: selectedSlotId, state })
    } catch {
      setCheckResult({
        report: draft?.legality ?? null,
        slotId: selectedSlotId,
        state: draft && !draft.legality.legal ? 'illegal' : 'unchecked',
      })
    }
  }

  function updateTrait(trait: 'alpha' | 'shiny', value: boolean) {
    setDraft((current) => {
      if (!current) return current
      const copy = structuredClone(current)
      if (trait === 'alpha') {
        copy.cosmetic.alpha = value
        copy.summary.alpha = value
      } else {
        copy.summary.shiny = value
      }
      return copy
    })
  }

  return (
    <div className="contents xl:flex xl:min-h-0 xl:flex-1 xl:flex-col">
      <div className="flex items-center justify-between gap-3">
        <PokemonHeaderIdentity slot={draft?.summary ?? null} t={t} />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <button
              aria-label={t('copyPokemon')}
              className={btnClass}
              disabled={!draft}
              title={t('copyPokemon')}
              type="button"
              onClick={onCopyPokemon}
            >
              <Copy aria-hidden="true" size={16} />
            </button>
            <button
              aria-label={t('pastePokemon')}
              className={btnClass}
              disabled={!draft || !pokemonClipboard}
              title={t('pastePokemon')}
              type="button"
              onClick={onPastePokemon}
            >
              <ClipboardPaste aria-hidden="true" size={16} />
            </button>
          </div>
          <PokemonTraitControls
            alpha={draft?.cosmetic.alpha ?? false}
            disabled={!draft}
            shiny={draft?.summary.shiny ?? false}
            supportsAlpha={alphaSupported}
            t={t}
            onAlphaChange={(value) => updateTrait('alpha', value)}
            onShinyChange={(value) => updateTrait('shiny', value)}
          />
          <LegalityCheckButton
            disabled={!draft}
            state={checkState}
            t={t}
            onClick={() => void handleCheck()}
          />
        </div>
      </div>
      <EditorTabs activeTab={activeTab} t={t} onChange={onActiveTabChange} />
      <PokemonEditor
        activeTab={activeTab}
        catalogs={catalogs}
        draft={draft}
        language={language}
        legalityReport={checkedReport}
        saveGameVersion={saveGameVersion}
        selectedSlotId={selectedSlotId}
        sessionId={sessionId}
        setDraft={setDraft}
        t={t}
        onFormChange={onFormChange}
        onOpenMovesBrowser={draft ? onOpenMovesBrowser : undefined}
        onOpenTypeChart={onOpenTypeChart}
        onSpeciesChange={onSpeciesChange}
      />
    </div>
  )
})
