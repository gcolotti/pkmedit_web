import { useCallback, useMemo, useState } from 'react'

import type { Translator } from '../../../../core/i18n/i18n'
import type { ApiClient } from '../../../../core/services/api'
import type {
  ArceusResearchActionKey,
  ArceusResearchBulkAction,
  ArceusResearchStatusResponse,
} from '../../../../core/types/index'
import { FocusedEditorShell } from '../../../core/focused/FocusedEditorShell'
import { ArceusResearchPanel } from './ArceusResearchPanel'
import { ArceusResearchRegionView } from './ArceusResearchRegionView'

export function ArceusResearchFocusedEditorPage({
  api,
  bulkDrafts,
  drafts,
  language,
  onApplyAction,
  onBack,
  onToggleBulk,
  sessionId,
  status,
  t,
}: {
  api: ApiClient
  bulkDrafts: ArceusResearchBulkAction[]
  drafts: ArceusResearchActionKey[]
  language: string
  onApplyAction: (key: ArceusResearchActionKey) => void
  onBack: () => void
  onToggleBulk: (action: ArceusResearchBulkAction) => void
  sessionId: string | null
  status: ArceusResearchStatusResponse | null
  t: Translator
}) {
  const [selectedDex, setSelectedDex] = useState<string | null>(null)
  const [expandedSpecies, setExpandedSpecies] = useState<number | null>(null)

  const selectedDexSummary = useMemo(() => {
    if (!selectedDex) return null
    return status?.dexes.find((dex) => dex.id === selectedDex) ?? null
  }, [selectedDex, status])

  const filteredSpecies = useMemo(() => {
    if (!selectedDex || !status) return []
    return status.species.filter((entry) => entry.dexIds.includes(selectedDex))
  }, [selectedDex, status])

  const handleSelectDex = useCallback((dexId: string | null) => {
    setSelectedDex(dexId)
    setExpandedSpecies(null)
  }, [])

  const metrics = status
    ? [
        {
          label: t('arceusResearchMetricRank'),
          value: `${status.currentRank}/${status.maxRank}`,
        },
        {
          label: t('arceusResearchMetricPoints'),
          value: `${status.totalResearchPoints.toLocaleString()}/${status.maxResearchPoints.toLocaleString()}`,
        },
        {
          label: t('arceusResearchMetricSpecies'),
          value: status.species.length,
        },
      ]
    : undefined

  return (
    <FocusedEditorShell
      backLabel={t('backToSaveEditor')}
      metrics={metrics}
      title={t('arceusResearchHeader')}
      onBack={onBack}
    >
      {sessionId ? (
        <div className="grid h-full min-h-0 xl:grid-cols-[minmax(20rem,28rem)_minmax(0,1fr)]">
          <div className="border-base-300 min-h-0 border-b xl:border-b-0 xl:border-r">
            <ArceusResearchPanel
              bulkDrafts={bulkDrafts}
              selectedDex={selectedDex}
              status={status}
              t={t}
              onSelectDex={handleSelectDex}
              onToggleBulk={onToggleBulk}
            />
          </div>
          <div className="min-h-0 overflow-y-auto">
            {selectedDexSummary ? (
              <ArceusResearchRegionView
                api={api}
                dex={selectedDexSummary}
                drafts={drafts}
                expandedSpecies={expandedSpecies}
                language={language}
                sessionId={sessionId}
                species={filteredSpecies}
                t={t}
                onApplyAction={onApplyAction}
                onToggleSpecies={setExpandedSpecies}
              />
            ) : (
              <p className="text-base-content/60 p-8 text-center text-sm">
                {t('arceusResearchSelectRegionPrompt')}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-sm text-stone-500">
          {t('noSaveLoaded')}
        </div>
      )}
    </FocusedEditorShell>
  )
}
