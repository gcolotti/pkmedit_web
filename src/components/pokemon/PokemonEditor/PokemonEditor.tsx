import { useMemo } from 'react'

import type { PokemonDetail } from '../../../core/types/index/index'
import {
  restrictMovesToLegal,
  supportsHeldItem,
} from '../../../core/utils/gameRules/gameRules'
import { getIllegalFieldPaths } from '../../../core/utils/legalityFieldIssues/legalityFieldIssues'
import { EditorGroup } from '../../core/EditorGroup/EditorGroup'
import { FieldIssueProvider } from '../../core/forms/FieldIssueContext/FieldIssueContext'
import { DetailsGroup } from '../details/DetailsGroup/DetailsGroup'
import { LegalityGroup } from '../legality/LegalityGroup/LegalityGroup'
import { MainTabFields } from '../main-tab/MainTabFields/MainTabFields'
import { MetFields } from '../MetFields/MetFields'
import { MovesGroup } from '../moves/MovesGroup/MovesGroup'
import { PokemonEditorEmpty } from '../PokemonEditorEmpty/PokemonEditorEmpty'
import type { PokemonEditorProps } from '../PokemonEditorProps/PokemonEditorProps'
import { StatsTab } from '../stats/StatsTab/StatsTab'

export function PokemonEditor({
  activeTab,
  catalogs,
  draft,
  language,
  onCheck,
  onFormChange,
  onOpenDetailsAdvanced,
  onOpenLegalityAdvanced,
  onOpenMovesBrowser,
  onOpenTypeChart,
  onSpeciesChange,
  saveGameVersion,
  selectedSlotId,
  sessionId,
  setDraft,
  t,
}: PokemonEditorProps) {
  // Highlight (decision #7): conserved after removing LegalityCheckButton. The
  // per-slot report (draft.legality) is maintained on load, on Generate legal,
  // and by the slot recheck — feed it to FieldIssueProvider.
  const invalidPaths = useMemo(
    () => getIllegalFieldPaths(draft?.legality ?? null),
    [draft?.legality],
  )
  const heldItemSupported = supportsHeldItem(saveGameVersion)
  const movesLegalOnly = restrictMovesToLegal(saveGameVersion)

  if (!draft) return <PokemonEditorEmpty t={t} />

  const update = (mutate: (copy: PokemonDetail) => void) => {
    setDraft((current) => {
      if (!current) return current
      const copy = structuredClone(current)
      mutate(copy)
      return copy
    })
  }
  return (
    <FieldIssueProvider paths={invalidPaths}>
      <div
        className={`mt-4 grid gap-3 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col ${activeTab === 'moves' ? '' : 'xl:overflow-y-auto'}`}
      >
        {activeTab === 'main' && (
          <EditorGroup title={t('main')}>
            <MainTabFields
              catalogs={catalogs}
              draft={draft}
              language={language}
              selectedSlotId={selectedSlotId}
              sessionId={sessionId}
              showHeldItem={heldItemSupported}
              onFormChange={onFormChange}
              onOpenTypeChart={onOpenTypeChart}
              t={t}
              update={update}
              onSpeciesChange={onSpeciesChange}
            />
          </EditorGroup>
        )}
        {activeTab === 'met' && (
          <EditorGroup title={t('met')}>
            <MetFields
              catalogs={catalogs}
              draft={draft}
              t={t}
              update={update}
            />
          </EditorGroup>
        )}
        {activeTab === 'stats' && (
          <StatsTab
            draft={draft}
            natures={catalogs.natures}
            selectedSlotId={selectedSlotId}
            sessionId={sessionId}
            t={t}
            update={update}
          />
        )}
        {activeTab === 'moves' && (
          <MovesGroup
            legalMoveIds={draft.contextCatalogs.legalMoves}
            legalOnly={movesLegalOnly}
            moveBasePp={draft.contextCatalogs.moveBasePp ?? []}
            moveCatalog={catalogs.moves}
            moves={draft.moves}
            plusMoves={draft.plusMoves}
            t={t}
            onChange={(moves) => update((copy) => (copy.moves = moves))}
            onOpenMovesBrowser={onOpenMovesBrowser}
            onPlusMovesChange={(plusMoves) =>
              update((copy) => (copy.plusMoves = plusMoves))
            }
          />
        )}
        {activeTab === 'details' && (
          <DetailsGroup
            cosmetic={draft.cosmetic}
            t={t}
            trainer={draft.trainer}
            onCosmeticChange={(cosmetic) =>
              update((copy) => (copy.cosmetic = cosmetic))
            }
            onOpenAdvanced={onOpenDetailsAdvanced}
            onTrainerChange={(trainer) =>
              update((copy) => (copy.trainer = trainer))
            }
          />
        )}
        {activeTab === 'legality' && (
          <LegalityGroup
            key={selectedSlotId ?? 'none'}
            draft={draft}
            saveGameVersion={saveGameVersion}
            selectedSlotId={selectedSlotId}
            sessionId={sessionId}
            setDraft={setDraft}
            t={t}
            onCheck={onCheck}
            onOpenAdvanced={onOpenLegalityAdvanced}
          />
        )}
      </div>
    </FieldIssueProvider>
  )
}
