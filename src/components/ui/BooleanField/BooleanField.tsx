import { useFieldIssue } from '../../core/forms/FieldIssueContext/FieldIssueContext'

export function BooleanField({
  label,
  onChange,
  validationPath,
  value,
}: {
  label: string
  onChange: (value: boolean) => void
  validationPath?: string
  value: boolean
}) {
  const issue = useFieldIssue(validationPath)

  return (
    <label
      className={`flex min-h-9 items-center gap-2 text-sm font-semibold${issue.labelClassName}`}
    >
      <input
        aria-invalid={issue.invalid || undefined}
        checked={value}
        type="checkbox"
        onChange={(event) => onChange(event.currentTarget.checked)}
      />
      {label}
    </label>
  )
}
