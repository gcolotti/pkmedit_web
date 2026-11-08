import { parseClampedNumberInput } from '../../../core/utils/numberInput/numberInput'
import { InputGroupStackedButton } from '../InputGroupButton/InputGroupButton'

// Number input with an attached stacked MAX button (item counts, money).
export function NumberMaxInputGroup({
  inputClassName = '',
  label,
  max,
  maxLabel,
  maxText,
  value,
  onValueChange,
}: {
  // Extra input classes so each form keeps its own alignment/size.
  inputClassName?: string
  label: string
  max: number
  maxLabel: string
  maxText: string
  value: number
  onValueChange: (value: number) => void
}) {
  return (
    <div className="grid h-9 grid-cols-[minmax(0,1fr)_1.25rem] items-stretch">
      <input
        aria-label={label}
        className={`field h-9 !rounded-r-none py-0 ${inputClassName}`}
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
      <InputGroupStackedButton
        className="h-9 min-h-9"
        label={maxLabel}
        side="end"
        text={maxText}
        onClick={() => onValueChange(max)}
      />
    </div>
  )
}
