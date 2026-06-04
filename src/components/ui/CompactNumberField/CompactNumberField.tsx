import { parseClampedNumberInput } from '../../../core/utils/numberInput/numberInput'
import { useFieldIssue } from '../../core/forms/FieldIssueContext/FieldIssueContext'

export function CompactNumberField({
  ariaLabel,
  label,
  max,
  min = 0,
  onChange,
  validationPath,
  value,
}: {
  ariaLabel?: string
  label: string
  max?: number
  min?: number
  onChange: (value: number) => void
  validationPath?: string
  value: number
}) {
  const issue = useFieldIssue(validationPath)

  return (
    <label className="grid min-w-0 gap-1">
      <span
        className={`label truncate text-[0.65rem] leading-none${issue.labelClassName}`}
      >
        {label}
      </span>
      <input
        aria-label={ariaLabel ?? label}
        aria-invalid={issue.invalid || undefined}
        className={`field h-9 min-w-0 px-2 py-1 text-center text-sm font-bold tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none${issue.fieldClassName}`}
        max={max}
        min={min}
        type="number"
        value={value}
        onChange={(event) =>
          onChange(
            parseClampedNumberInput(event.currentTarget.value, { max, min }),
          )
        }
      />
    </label>
  )
}
