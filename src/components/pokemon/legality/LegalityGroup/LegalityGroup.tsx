import { Maximize2, Wand2 } from 'lucide-react'
import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react'

import { useWorkspace } from '../../../../core/hooks/workspaceContext/workspaceContext'
import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { SlotLegalityState } from '../../../../core/state/draftStoreTypes/draftStoreTypes'
import { useUiStore } from '../../../../core/state/uiStore/uiStore'
import type { PokemonDetail } from '../../../../core/types/index/index'
import { supportsAlpha as supportsAlphaForVersion } from '../../../../core/utils/gameRules/gameRules'
import { EditorGroup } from '../../../core/EditorGroup/EditorGroup'
import { LegalityObjectives } from '../LegalityObjectives/LegalityObjectives'
import { LegalityStatus } from '../LegalityStatus/LegalityStatus'

const sectionClassName = 'grid gap-2 sm:col-span-2'
const sectionTitleClassName = 'label text-[0.7rem]'

// Remount per slot (key={selectedSlotId}) so the target toggles re-initialise
// from the new slot's current shiny/alpha.
export function LegalityGroup({
  draft,
  onCheck,
  onLegalityGenerated,
  onOpenAdvanced,
  saveGameVersion,
  selectedSlotId,
  selectedLegality,
  sessionId,
  setDraft,
  t,
}: {
  draft: PokemonDetail
  onCheck: () => Promise<unknown>
  onLegalityGenerated: (detail: PokemonDetail) => void
  onOpenAdvanced: () => void
  saveGameVersion: number
  selectedSlotId: string | null
  selectedLegality: SlotLegalityState | null
  sessionId: string | null
  setDraft: Dispatch<SetStateAction<PokemonDetail | null>>
  t: Translator
}) {
  const { api } = useWorkspace()
  const showToast = useUiStore((state) => state.showToast)
  const alphaSupported = supportsAlphaForVersion(saveGameVersion)

  const currentShiny = draft.summary.shiny
  const currentAlpha = draft.cosmetic.alpha
  const [targetShiny, setTargetShiny] = useState(currentShiny)
  const [targetAlpha, setTargetAlpha] = useState(currentAlpha)
  const [generating, setGenerating] = useState(false)
  const legality = selectedLegality?.report ?? draft.legality
  const checkedAt = selectedLegality?.checkedAt ?? null

  // Staleness (B): recheck the slot when the Legality tab opens. Remounts per
  // slot via key, so this runs once per slot selection. A ref keeps onCheck
  // out of the dep array (its identity changes every parent render).
  const onCheckRef = useRef(onCheck)
  useEffect(() => {
    onCheckRef.current = onCheck
  }, [onCheck])
  useEffect(() => {
    void onCheckRef.current()
  }, [])

  const objectivesMet =
    targetShiny === currentShiny && targetAlpha === currentAlpha
  const alreadyLegal = legality.legal && objectivesMet

  async function handleGenerate() {
    if (!sessionId || !selectedSlotId) return
    setGenerating(true)
    try {
      const response = await api.pokemon.previewLegalGenerate(
        sessionId,
        selectedSlotId,
        { targetAlpha, targetShiny },
      )
      setDraft(() => response.draft)
      onLegalityGenerated(response.draft)
      if (targetAlpha && !response.alphaPreserved) showToast(t('alphaDropped'))
      else if (response.warning) showToast(response.warning)
    } catch {
      showToast(t('generateLegalError'))
    } finally {
      setGenerating(false)
    }
  }

  return (
    <EditorGroup title={t('legality')}>
      <div className={sectionClassName}>
        <div className={sectionTitleClassName}>{t('status')}</div>
        <LegalityStatus checkedAt={checkedAt} legality={legality} t={t} />
      </div>

      <div className={sectionClassName}>
        <div className={sectionTitleClassName}>{t('objectives')}</div>
        <LegalityObjectives
          supportsAlpha={alphaSupported}
          t={t}
          targetAlpha={targetAlpha}
          targetShiny={targetShiny}
          onTargetAlphaChange={setTargetAlpha}
          onTargetShinyChange={setTargetShiny}
        />
      </div>

      <div className={sectionClassName}>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-lagoon bg-lagoon/15 px-3 text-sm font-bold text-lagoon transition hover:bg-lagoon/25 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={alreadyLegal || generating}
            title={alreadyLegal ? t('generateLegalAlreadyLegal') : undefined}
            type="button"
            onClick={() => void handleGenerate()}
          >
            <Wand2 aria-hidden="true" size={16} />
            <span>{generating ? t('generatingLegal') : t('generateLegal')}</span>
          </button>
          <button
            className="btn inline-flex h-10 items-center justify-center gap-1.5 px-3 text-sm"
            type="button"
            onClick={onOpenAdvanced}
          >
            <Maximize2 aria-hidden="true" size={16} />
            <span>{t('reviewAndFix')}</span>
          </button>
        </div>
        {alreadyLegal && (
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {t('generateLegalAlreadyLegal')}
          </p>
        )}
      </div>
    </EditorGroup>
  )
}
