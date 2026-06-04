import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { Translator } from '../../../../../core/i18n/i18n/i18n'
import type { ApiClient } from '../../../../../core/services/api/api'
import type {
  ArceusResearchActionKey,
  ArceusResearchDexSummary,
  ArceusResearchSpeciesEntry,
} from '../../../../../core/types/index/index'
import { ArceusResearchSpeciesDetail } from '../ArceusResearchSpeciesDetail/ArceusResearchSpeciesDetail'
import { ArceusResearchSpeciesRow } from '../ArceusResearchSpeciesRow/ArceusResearchSpeciesRow'

export function ArceusResearchRegionView({
  api,
  dex,
  drafts,
  expandedSpecies,
  language,
  onApplyAction,
  onToggleSpecies,
  sessionId,
  species,
  t,
}: {
  api: ApiClient
  dex: ArceusResearchDexSummary
  drafts: ArceusResearchActionKey[]
  expandedSpecies: number | null
  language: string
  onApplyAction: (key: ArceusResearchActionKey) => void
  onToggleSpecies: (species: number | null) => void
  sessionId: string | null
  species: ArceusResearchSpeciesEntry[]
  t: Translator
}) {
  const [speciesSearchState, setSpeciesSearchState] = useState({
    dexId: dex.id,
    value: '',
  })
  const speciesSearch =
    speciesSearchState.dexId === dex.id ? speciesSearchState.value : ''

  const filteredSpecies = useMemo(() => {
    const query = speciesSearch.trim().toLocaleLowerCase()
    if (!query) return species
    return species.filter((entry) =>
      entry.speciesName.toLocaleLowerCase().includes(query),
    )
  }, [species, speciesSearch])

  return (
    <div className="grid gap-3 p-4">
      <header className="border-base-300 flex flex-wrap items-center justify-between gap-2 border-b pb-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <h3 className="text-base-content truncate text-lg font-semibold">
            {dex.label}
          </h3>
          {species.length > 0 && (
            <label className="relative w-32 max-w-full sm:w-36">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-2 top-1.5 text-stone-400"
                size={12}
              />
              <input
                aria-label={t('arceusResearchSearchSpeciesLabel', {
                  dex: dex.label,
                })}
                className="field h-7 min-h-7 w-full rounded px-2 py-0 pl-6 text-xs"
                placeholder={t('arceusResearchSearchSpeciesPlaceholder')}
                type="search"
                value={speciesSearch}
                onChange={(event) =>
                  setSpeciesSearchState({
                    dexId: dex.id,
                    value: event.currentTarget.value,
                  })
                }
              />
            </label>
          )}
        </div>
        <span className="text-base-content/70 whitespace-nowrap font-mono text-xs">
          {dex.perfect}★ · {dex.completed}✓ · {dex.totalSpecies}
        </span>
      </header>

      {species.length === 0 ? (
        <p className="text-base-content/60 text-sm">
          {t('arceusResearchEmpty')}
        </p>
      ) : (
        <div className="grid gap-2">
          {filteredSpecies.length === 0 && (
            <p className="text-base-content/60 text-sm">
              {t('arceusResearchNoSpeciesMatches')}
            </p>
          )}
          {filteredSpecies.map((entry) => {
            const expanded = expandedSpecies === entry.species
            return (
              <div
                key={entry.species}
                className={`overflow-hidden rounded border transition ${
                  expanded ? 'border-primary' : 'border-base-300'
                }`}
              >
                <ArceusResearchSpeciesRow
                  expanded={expanded}
                  species={entry}
                  t={t}
                  onToggle={() =>
                    onToggleSpecies(expanded ? null : entry.species)
                  }
                />
                {expanded && (
                  <div className="border-base-300 border-t">
                    <ArceusResearchSpeciesDetail
                      api={api}
                      language={language}
                      queued={drafts}
                      sessionId={sessionId}
                      species={entry}
                      t={t}
                      onApplyAction={onApplyAction}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
