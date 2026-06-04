import { useFieldIssue } from '../../core/forms/FieldIssueContext/FieldIssueContext'

export function TextField({
  label,
  onChange,
  validationPath,
  value,
}: {
  label: string
  onChange: (value: string) => void
  validationPath?: string
  value: string
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
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    </label>
  )
}
