import { useFieldIssue } from '../core/forms/FieldIssueContext'

export function DateField({
  label,
  onChange,
  validationPath,
  value,
}: {
  label: string
  onChange: (value: string | null) => void
  validationPath?: string
  value: string | null
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
        type="date"
        value={value ?? ''}
        onChange={(event) => onChange(event.currentTarget.value || null)}
      />
    </label>
  )
}
