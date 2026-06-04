import { useMemo } from 'react'

import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { PokemonSummary } from '../../../core/types/pokemon/pokemon'
import { getPokemonSpriteCandidates } from '../../../core/utils/sprites/sprites'
import { SpriteImage } from '../SpriteImage/SpriteImage'

export function PokemonSprite({
  compact = false,
  slot,
  t,
}: {
  compact?: boolean
  slot: PokemonSummary
  t: Translator
}) {
  const candidates = useMemo(() => getPokemonSpriteCandidates(slot), [slot])
  const cacheKey = candidates.join('|')

  return (
    <span
      className={`${compact ? 'h-12 w-12' : 'h-14 w-14'} grid shrink-0 place-items-center rounded-md bg-white/70 ring-1 ring-stone-200 dark:bg-stone-950/50 dark:ring-stone-800`}
    >
      <SpriteImage
        key={cacheKey}
        alt={t('spriteAlt', { name: slot.speciesName })}
        candidates={candidates}
      />
    </span>
  )
}
