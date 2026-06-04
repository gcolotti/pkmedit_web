import { Check, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'

import type { Translator } from '../../../../core/i18n/i18n'
import type { ArceusResearchSpeciesEntry } from '../../../../core/types/index'
import { getPokemonSpeciesSpriteCandidates } from '../../../../core/utils/sprites'
import { SpriteImage } from '../../../ui/SpriteImage'

export function ArceusResearchSpeciesRow({
  expanded,
  onToggle,
  species,
  t,
}: {
  expanded: boolean
  onToggle: () => void
  species: ArceusResearchSpeciesEntry
  t: Translator
}) {
  const speciesNumber = species.species.toString().padStart(4, '0')
  const spriteCandidates = useMemo(
    () =>
      getPokemonSpeciesSpriteCandidates(species.species, species.displayForm),
    [species.displayForm, species.species],
  )
  const spriteCacheKey = spriteCandidates.join('|')

  return (
    <button
      className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition ${
        expanded ? 'bg-base-200/40' : 'hover:bg-base-200/40'
      }`}
      type="button"
      onClick={onToggle}
    >
      <div className="flex min-w-0 items-center gap-2">
        <ChevronRight
          aria-hidden="true"
          className={`text-base-content/60 shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`}
          size={14}
        />
        <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded bg-white/70 ring-1 ring-stone-200 dark:bg-stone-950/50 dark:ring-stone-800">
          <SpriteImage
            key={spriteCacheKey}
            alt={t('spriteAlt', { name: species.speciesName })}
            candidates={spriteCandidates}
            className="h-7 w-7"
          />
        </span>
        <span className="flex min-w-0 items-baseline gap-1">
          <span className="text-base-content min-w-0 truncate text-sm">
            {species.speciesName}
          </span>
          <span className="text-base-content/60 shrink-0 font-mono text-[10px]">
            (#{speciesNumber})
          </span>
        </span>
        {species.perfect && (
          <span className="inline-flex shrink-0 items-center gap-0.5 text-[9px] font-semibold uppercase text-emerald-500 drop-shadow-[0_0_6px_rgba(110,231,183,0.9)] dark:text-emerald-300">
            {t('arceusResearchSpeciesPerfect')}
            <Check aria-hidden="true" className="h-3 w-3" strokeWidth={3} />
          </span>
        )}
        {!species.perfect && species.complete && (
          <span className="inline-flex shrink-0 items-center gap-0.5 text-[9px] font-semibold uppercase text-emerald-500 dark:text-emerald-300">
            {t('arceusResearchSpeciesComplete')}
            <Check aria-hidden="true" className="h-3 w-3" strokeWidth={3} />
          </span>
        )}
      </div>
      <div className="text-base-content/60 flex shrink-0 items-center gap-3 text-xs">
        <span className="font-mono">
          {species.completedTasks}/{species.totalTasks}
        </span>
        <span className="font-mono">
          {Math.min(100, species.researchRate)}%
        </span>
      </div>
    </button>
  )
}
