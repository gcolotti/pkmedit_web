import { useMemo } from 'react'

import { useStatReconciliation } from '../../../core/hooks/useStatReconciliation'
import { useWorkspace } from '../../../core/hooks/workspaceContext'
import type { Translator } from '../../../core/i18n/i18n'
import type { CatalogEntry, PokemonDetail } from '../../../core/types/index'
import { natureModifier } from '../../../core/utils/natureData'
import { computeDraftStats } from '../computeDraftStats'
import { StatsGroup } from './StatsGroup'

type Update = (mutate: (copy: PokemonDetail) => void) => void

export function StatsTab({
  draft,
  natures,
  selectedSlotId,
  sessionId,
  t,
  update,
}: {
  draft: PokemonDetail
  natures: CatalogEntry[]
  selectedSlotId: string | null
  sessionId: string | null
  t: Translator
  update: Update
}) {
  const { api } = useWorkspace()
  const localStats = useMemo(() => computeDraftStats(draft), [draft])
  const { displayStats, glowKeys } = useStatReconciliation(
    api,
    sessionId,
    selectedSlotId,
    draft,
    localStats,
  )
  const natureEntry = natures.find((n) => n.id === draft.main.statNature)
  const modifier = natureModifier(natureEntry?.upStat, natureEntry?.downStat)
  return (
    <StatsGroup
      baseStats={draft.baseStats}
      calculatedStats={displayStats}
      effortKind={draft.effortKind}
      evs={draft.evs}
      glowKeys={glowKeys}
      hyperTrainedIvs={draft.hyperTrainedIvs}
      hyperTrainingAvailable={draft.hyperTrainingAvailable}
      ivs={draft.ivs}
      maxEv={draft.maxEv}
      maxTotalEv={draft.maxTotalEv}
      natureModifier={modifier}
      t={t}
      onEvsChange={(stats) => update((copy) => (copy.evs = stats))}
      onHyperTrainChange={(ht) => update((copy) => (copy.hyperTrainedIvs = ht))}
      onIvsChange={(stats) => update((copy) => (copy.ivs = stats))}
    />
  )
}
