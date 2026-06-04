export function SubPanelTabs<T extends string>({
  active,
  label,
  onChange,
  options,
}: {
  active: T
  label: string
  onChange: (value: T) => void
  options: Array<{ value: T; label: string }>
}) {
  return (
    <div
      aria-label={label}
      className="grid gap-1"
      role="tablist"
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(min-content, 1fr))`,
      }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          aria-selected={active === option.value}
          className={`rounded-md border px-2 py-2 text-xs font-bold transition ${
            active === option.value
              ? 'border-lagoon bg-lagoon/15 text-lagoon'
              : 'border-black/10 bg-white/60 dark:border-white/10 dark:bg-white/5'
          }`}
          role="tab"
          type="button"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
