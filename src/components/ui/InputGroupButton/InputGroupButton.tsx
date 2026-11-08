// Buttons attached to a number input (EV MIN/MAX, item count MAX, hyper
// training). Height comes from the caller so each group can match its row.
export const inputGroupControlClassName =
  'flex w-full flex-col items-center justify-center rounded border leading-none transition'
export const inputGroupControlNeutralClassName =
  'border-black/10 bg-white/80 text-stone-400 hover:border-stone-400 hover:text-stone-600 dark:border-white/10 dark:bg-white/10 dark:text-stone-500 dark:hover:text-stone-300'

const attachClassName = {
  start: '!rounded-r-none',
  end: '!rounded-l-none border-l-0',
}

function StackedLabel({ text }: { text: string }) {
  return Array.from(text.toUpperCase()).map((letter, index) => (
    <span
      key={`${letter}-${index}`}
      className="text-[0.4rem] font-bold leading-tight"
    >
      {letter}
    </span>
  ))
}

export function InputGroupStackedButton({
  className = '',
  label,
  side,
  text,
  onClick,
}: {
  className?: string
  label: string
  side: 'start' | 'end'
  text: string
  onClick: () => void
}) {
  return (
    <button
      aria-label={label}
      className={`${inputGroupControlClassName} ${inputGroupControlNeutralClassName} ${attachClassName[side]} ${className}`}
      title={label}
      type="button"
      onClick={onClick}
    >
      <StackedLabel text={text} />
    </button>
  )
}
