import { ClipboardPaste, Copy } from 'lucide-react'
import { memo } from 'react'

import type { PokemonEditorPanelProps } from '../../../core/types/pokemonEditorPanel/pokemonEditorPanel'
import { supportsAlpha } from '../../../core/utils/gameRules/gameRules'
import { EditorTabs } from '../../ui/EditorTabs/EditorTabs'
import { PokemonEditor } from '../PokemonEditor/PokemonEditor'
import { PokemonHeaderIdentity } from '../PokemonHeaderIdentity/PokemonHeaderIdentity'
import { PokemonTraitControls } from '../PokemonTraitIndicators/PokemonTraitIndicators'

export const PokemonEditorPanel = memo(function PokemonEditorPanel({
  activeTab,
  catalogs,
  draft,
  language,
  onCheck,
  onLegalityGenerated,
  onActiveTabChange,
  onCopyPokemon,
  onFormChange,
  onOpenDetailsAdvanced,
  onOpenLegalityAdvanced,
  onOpenMovesBrowser,
  onOpenTypeChart,
  onPastePokemon,
  onSpeciesChange,
  pokemonClipboard,
  saveGameVersion,
  saveTrainer,
  selectedSlotId,
  selectedLegality,
  sessionId,
  setDraft,
  t,
}: PokemonEditorPanelProps) {
  const btnClass =
    'grid h-9 w-9 place-items-center rounded-md border transition disabled:cursor-not-allowed disabled:opacity-50 border-black/15 text-stone-500 hover:bg-black/5 dark:border-white/15 dark:text-stone-400 dark:hover:bg-white/5'
  const alphaSupported = supportsAlpha(saveGameVersion)

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
        </div>
      </div>
      <EditorTabs activeTab={activeTab} t={t} onChange={onActiveTabChange} />
      <PokemonEditor
        activeTab={activeTab}
        catalogs={catalogs}
        draft={draft}
        language={language}
        saveGameVersion={saveGameVersion}
        saveTrainer={saveTrainer}
        selectedSlotId={selectedSlotId}
        selectedLegality={selectedLegality}
        sessionId={sessionId}
        setDraft={setDraft}
        t={t}
        onCheck={onCheck}
        onLegalityGenerated={onLegalityGenerated}
        onFormChange={onFormChange}
        onOpenDetailsAdvanced={onOpenDetailsAdvanced}
        onOpenLegalityAdvanced={onOpenLegalityAdvanced}
        onOpenMovesBrowser={draft ? onOpenMovesBrowser : undefined}
        onOpenTypeChart={onOpenTypeChart}
        onSpeciesChange={onSpeciesChange}
      />
    </div>
  )
})
