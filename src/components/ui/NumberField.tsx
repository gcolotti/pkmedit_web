import { parseClampedNumberInput } from '../../core/utils/numberInput'
import { useFieldIssue } from '../core/forms/FieldIssueContext'

export function NumberField({
  disabled = false,
  label,
  max,
  min = 0,
  onChange,
  validationPath,
  value,
}: {
  disabled?: boolean
  label: string
  max?: number
  min?: number
  onChange: (value: number) => void
  validationPath?: string
  value: number
}) {
  const issue = useFieldIssue(validationPath)

  return (
    <label className="grid gap-1.5">
      <span className={`label${issue.labelClassName} text-[0.65rem]`}>
        {label}
      </span>
      <input
        aria-invalid={issue.invalid || undefined}
        className={`field${issue.fieldClassName}`}
        disabled={disabled}
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
