import { Sparkles } from 'lucide-react'

import type { Translator } from '../../core/i18n/i18n'
import { AlphaIcon } from '../ui/AlphaIcon'

export function PokemonTraitControls({
  alpha,
  className = '',
  disabled = false,
  onAlphaChange,
  onShinyChange,
  shiny,
  supportsAlpha = false,
  t,
}: {
  alpha: boolean
  className?: string
  disabled?: boolean
  onAlphaChange: (value: boolean) => void
  onShinyChange: (value: boolean) => void
  shiny: boolean
  supportsAlpha?: boolean
  t: Translator
}) {
  const baseClassName =
    'grid h-9 w-9 place-items-center rounded-md border transition disabled:cursor-not-allowed disabled:opacity-50'
  const activeClassName = 'border-rose-500/35 bg-rose-500/10 text-rose-500'
  const inactiveClassName =
    'border-black/15 text-stone-500 hover:bg-black/5 dark:border-white/15 dark:text-stone-400 dark:hover:bg-white/5'

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <button
        aria-label={t('shiny')}
        aria-pressed={shiny}
        className={`${baseClassName} ${shiny ? activeClassName : inactiveClassName}`}
        disabled={disabled}
        title={t('shiny')}
        type="button"
        onClick={() => onShinyChange(!shiny)}
      >
        <Sparkles aria-hidden="true" size={18} strokeWidth={3} />
      </button>
      {supportsAlpha ? (
        <button
          aria-label={t('alpha')}
          aria-pressed={alpha}
          className={`${baseClassName} ${alpha ? activeClassName : inactiveClassName}`}
          disabled={disabled}
          title={t('alpha')}
          type="button"
          onClick={() => onAlphaChange(!alpha)}
        >
          <AlphaIcon size={18} />
        </button>
      ) : null}
    </div>
  )
}
