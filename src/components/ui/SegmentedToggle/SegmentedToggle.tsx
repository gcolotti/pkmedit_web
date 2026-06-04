export type SegmentOption<T extends string> = {
  value: T
  label: string
  title?: string
  count?: number
}

type Props<T extends string> = {
  label: string
  value: T
  options: Array<SegmentOption<T>>
  onChange: (next: T) => void
}

export function SegmentedToggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: Props<T>) {
  return (
    <div
      aria-label={label}
      className="surface-muted flex w-full gap-1 rounded-md p-1"
      role="group"
    >
      {options.map((option) => {
        const active = option.value === value

        return (
          <button
            key={option.value}
            aria-pressed={active}
            className={`btn min-h-9 flex-1 border-0 px-4 ${active ? 'btn-primary' : ''}`}
            title={option.title ?? option.label}
            type="button"
            onClick={() => onChange(option.value)}
          >
            <span>{option.label}</span>
            {typeof option.count === 'number' ? (
              <span className="min-w-6 rounded-full bg-black/10 px-1.5 py-0.5 text-center text-xs dark:bg-white/15">
                {option.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
