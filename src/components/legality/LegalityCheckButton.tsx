import { Check, CircleAlert, LoaderCircle } from 'lucide-react'

import type { Translator } from '../../core/i18n/i18n'

export type LegalityCheckState = 'unchecked' | 'checking' | 'legal' | 'illegal'

export function LegalityCheckButton({
  disabled,
  onClick,
  state,
  t,
}: {
  disabled?: boolean
  onClick: () => void
  state: LegalityCheckState
  t: Translator
}) {
  const styles = {
    checking:
      'border-stone-400 text-stone-500 dark:border-stone-500 dark:text-stone-300',
    illegal: 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-300',
    legal:
      'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
    unchecked:
      'border-black/15 text-stone-500 dark:border-white/15 dark:text-stone-400',
  } satisfies Record<LegalityCheckState, string>
  const labels = {
    checking: t('legalityChecking'),
    illegal: t('legalityIllegal'),
    legal: t('legalityLegal'),
    unchecked: t('legalityUnchecked'),
  } satisfies Record<LegalityCheckState, string>
  const Icon =
    state === 'illegal'
      ? CircleAlert
      : state === 'checking'
        ? LoaderCircle
        : Check

  return (
    <button
      aria-label={labels[state]}
      className={`grid h-9 w-9 place-items-center rounded-md border transition ${styles[state]} ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
      disabled={disabled || state === 'checking'}
      title={labels[state]}
      type="button"
      onClick={onClick}
    >
      <Icon
        className={state === 'checking' ? 'animate-spin' : ''}
        size={18}
        strokeWidth={3}
      />
    </button>
  )
}
