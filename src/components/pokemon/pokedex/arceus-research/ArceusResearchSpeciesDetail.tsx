import { useEffect, useState } from 'react'

import type { Translator } from '../../../../core/i18n/i18n'
import type { ApiClient } from '../../../../core/services/api'
import { sameArceusResearchAction } from '../../../../core/services/arceusResearchActionUtils'
import type {
  ArceusResearchActionKey,
  ArceusResearchSpeciesDetail as DetailResponse,
  ArceusResearchSpeciesEntry,
} from '../../../../core/types/index'
import { ArceusResearchSpeciesActions } from './ArceusResearchSpeciesActions'
import { ArceusResearchTaskRow } from './ArceusResearchTaskRow'

export function ArceusResearchSpeciesDetail({
  api,
  language,
  onApplyAction,
  queued,
  sessionId,
  species,
  t,
}: {
  api: ApiClient
  language: string
  onApplyAction: (key: ArceusResearchActionKey) => void
  queued: ArceusResearchActionKey[]
  sessionId: string | null
  species: ArceusResearchSpeciesEntry
  t: Translator
}) {
  const [detail, setDetail] = useState<DetailResponse | null>(null)
  const detailLoaded = detail?.summary.species === species.species
  const loading = !detailLoaded

  useEffect(() => {
    if (!sessionId || detailLoaded) return
    let cancelled = false
    api.save
      .getArceusResearchSpecies(sessionId, species.species, language)
      .then((response) => {
        if (!cancelled) setDetail(response)
      })
      .catch(() => {
        if (!cancelled) setDetail(null)
      })
    return () => {
      cancelled = true
    }
  }, [api, detailLoaded, language, sessionId, species.species])

  const speciesQueued = queued.some(
    (item) =>
      item.species === species.species && item.action !== 'completeTask',
  )

  return (
    <div className="grid gap-3 p-3">
      <ArceusResearchSpeciesActions
        queued={queued}
        species={species}
        t={t}
        onApplyAction={onApplyAction}
      />

      {loading && (
        <p className="text-base-content/60 text-sm">{t('pokedexLoading')}</p>
      )}

      {detail && detailLoaded && (
        <div className="grid gap-1">
          <h4 className="text-base-content/80 text-xs font-semibold uppercase">
            {t('arceusResearchTaskHeader')}
          </h4>
          {detail.tasks.map((task) => (
            <ArceusResearchTaskRow
              key={task.index}
              species={species.species}
              task={task}
              queued={
                queued.some((item) =>
                  sameArceusResearchAction(item, {
                    species: species.species,
                    action: 'completeTask',
                    taskIndex: task.index,
                  }),
                ) || speciesQueued
              }
              onApply={onApplyAction}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  )
}
