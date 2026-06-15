import type { LucideIcon } from 'lucide-react'

// A single Pokemon marking. PKHeX markings are tri-state (MarkingColor):
// 0 = None, 1 = Blue, 2 = Red. The toggle cycles None -> Blue -> Red -> None.
export function MarkingToggle({
  Icon,
  label,
  onChange,
  value,
}: {
  Icon: LucideIcon
  label: string
  onChange: (value: number) => void
  value: number
}) {
  const state = value === 1 ? 'blue' : value === 2 ? 'red' : 'none'
  const styles = {
    none: 'border-black/15 text-stone-400 dark:border-white/15 dark:text-stone-500',
    blue: 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-300',
    red: 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-300',
  } as const

  return (
    <button
      aria-label={label}
      aria-pressed={value !== 0}
      className={`grid h-9 place-items-center rounded-md border transition hover:bg-black/5 dark:hover:bg-white/5 ${styles[state]}`}
      title={label}
      type="button"
      onClick={() => onChange((value + 1) % 3)}
    >
      <Icon
        aria-hidden="true"
        fill={value === 0 ? 'none' : 'currentColor'}
        size={16}
        strokeWidth={2}
      />
    </button>
  )
}
