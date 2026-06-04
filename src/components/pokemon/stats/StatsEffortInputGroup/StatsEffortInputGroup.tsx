import { parseClampedNumberInput } from '../../../../core/utils/numberInput/numberInput'
import { inputClassName } from '../StatsGroupControls/StatsGroupControls'

const controlBase =
  'flex h-9 min-h-9 w-full flex-col items-center justify-center rounded border leading-none transition'
const controlNeutral =
  'border-black/10 bg-white/80 text-stone-400 hover:border-stone-400 hover:text-stone-600 dark:border-white/10 dark:bg-white/10 dark:text-stone-500 dark:hover:text-stone-300'

function StackedLabel({ label }: { label: string }) {
  return Array.from(label.toUpperCase()).map((letter, index) => (
    <span
      key={`${letter}-${index}`}
      className="text-[0.4rem] font-bold leading-tight"
    >
      {letter}
    </span>
  ))
}

export function EffortInputGroup({
  fieldClassName,
  invalid,
  label,
  max,
  maxLabel,
  maxText,
  minLabel,
  minText,
  onValueChange,
  value,
}: {
  fieldClassName: string
  invalid: boolean
  label: string
  max: number
  maxLabel: string
  maxText: string
  minLabel: string
  minText: string
  onValueChange: (value: number) => void
  value: number
}) {
  return (
    <div className="col-span-3 grid h-9 grid-cols-[1.25rem_minmax(2.25rem,3.75rem)_1.25rem] items-stretch">
      <button
        aria-label={minLabel}
        className={`${controlBase} ${controlNeutral} !rounded-r-none`}
        type="button"
        onClick={() => onValueChange(0)}
      >
        <StackedLabel label={minText} />
      </button>
      <input
        aria-invalid={invalid || undefined}
        aria-label={label}
        className={`${inputClassName}${fieldClassName} !rounded-none border-l-0`}
        max={max}
        min={0}
        type="number"
        value={value}
        onChange={(event) =>
          onValueChange(
            parseClampedNumberInput(event.currentTarget.value, { max, min: 0 }),
          )
        }
      />
      <button
        aria-label={maxLabel}
        className={`${controlBase} ${controlNeutral} !rounded-l-none border-l-0`}
        type="button"
        onClick={() => onValueChange(max)}
      >
        <StackedLabel label={maxText} />
      </button>
    </div>
  )
}
