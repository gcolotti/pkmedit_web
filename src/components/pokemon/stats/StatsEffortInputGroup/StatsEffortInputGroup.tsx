import { parseClampedNumberInput } from '../../../../core/utils/numberInput/numberInput'
import { InputGroupStackedButton } from '../../../ui/InputGroupButton/InputGroupButton'
import { inputClassName } from '../StatsGroupControls/StatsGroupControls'

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
      <InputGroupStackedButton
        className="h-9 min-h-9"
        label={minLabel}
        side="start"
        text={minText}
        onClick={() => onValueChange(0)}
      />
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
