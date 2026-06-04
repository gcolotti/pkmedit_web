import { ArrowUp, Crown } from 'lucide-react'

const controlBase =
  'flex h-9 min-h-9 w-full flex-col items-center justify-center rounded border leading-none transition'
const controlNeutral =
  'border-black/10 bg-white/80 text-stone-400 hover:border-stone-400 hover:text-stone-600 dark:border-white/10 dark:bg-white/10 dark:text-stone-500 dark:hover:text-stone-300'
const controlActive =
  'border-lagoon/60 bg-lagoon/20 text-lagoon dark:bg-lagoon/20'

export function HyperTrainControl({
  active,
  hyperTrainLabel,
  onClick,
  perfect,
  perfectLabel,
}: {
  active: boolean
  hyperTrainLabel: string
  onClick: () => void
  perfect: boolean
  perfectLabel: string
}) {
  const className = `${controlBase} ${perfect || active ? controlActive : controlNeutral} !rounded-l-none border-l-0`
  if (perfect)
    return (
      <span
        aria-label={perfectLabel}
        className={`${className} cursor-default`}
        role="img"
        title={perfectLabel}
      >
        <Crown fill="currentColor" size={13} />
      </span>
    )

  return (
    <button
      aria-label={hyperTrainLabel}
      aria-pressed={active}
      className={className}
      type="button"
      onClick={onClick}
    >
      <ArrowUp size={8} strokeWidth={3} />
      <span className="text-[0.5rem] font-bold leading-none">H</span>
    </button>
  )
}
