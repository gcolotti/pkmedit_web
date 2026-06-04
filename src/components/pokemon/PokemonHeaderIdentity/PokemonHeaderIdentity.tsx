import type { ReactNode } from 'react'
import { useMemo } from 'react'

import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { PokemonSummary } from '../../../core/types/pokemon/pokemon'
import { getPokemonSpriteCandidates } from '../../../core/utils/sprites/sprites'
import { SpriteImage } from '../../ui/SpriteImage/SpriteImage'

export function PokemonHeaderIdentity({
  compact = false,
  endAdornment,
  slot,
  suffix,
  t,
}: {
  compact?: boolean
  endAdornment?: ReactNode
  slot: PokemonSummary | null
  suffix?: string
  t: Translator
}) {
  const candidates = useMemo(
    () => (slot ? getPokemonSpriteCandidates(slot) : []),
    [slot],
  )
  const cacheKey = candidates.join('|')

  if (!slot) {
    return (
      <h2
        className={
          compact ? 'min-w-0 text-lg font-black' : 'min-w-0 text-xl font-black'
        }
      >
        {t('noSlot')}
      </h2>
    )
  }

  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={`${compact ? 'h-8 w-8' : 'h-9 w-9'} grid shrink-0 place-items-center overflow-hidden rounded-md bg-white/70 ring-1 ring-stone-200 dark:bg-stone-950/50 dark:ring-stone-800`}
        >
          <SpriteImage
            key={cacheKey}
            alt={t('spriteAlt', { name: slot.speciesName })}
            candidates={candidates}
            className={compact ? 'h-7 w-7' : 'h-8 w-8'}
          />
        </span>
        <h2
          className={`${compact ? 'text-lg' : 'text-xl'} min-w-0 truncate font-black`}
        >
          {slot.speciesName}
          {suffix ? (
            <span className="ml-1 text-stone-500 dark:text-stone-300/75">
              {suffix}
            </span>
          ) : null}
        </h2>
      </div>
      {endAdornment}
    </div>
  )
}
