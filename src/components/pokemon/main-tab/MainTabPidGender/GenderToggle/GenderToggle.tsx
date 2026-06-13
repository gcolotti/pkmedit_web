export function GenderToggle({
  value,
  disabled,
  onChange,
}: {
  value: number
  disabled: boolean
  onChange: (gender: number) => void
}) {
  const isGenderless = value === 2
  return (
    <div className="flex h-9 gap-1">
      <button
        aria-label="Male"
        aria-pressed={value === 0}
        className={`btn min-h-9 flex-1 border-0 px-2 text-base ${
          value === 0
            ? 'bg-sky-500/20 text-sky-400 ring-1 ring-sky-400/40'
            : 'text-slate-400'
        }`}
        disabled={disabled || isGenderless}
        title="Male"
        type="button"
        onClick={() => onChange(0)}
      >
        ♂
      </button>
      <button
        aria-label="Female"
        aria-pressed={value === 1}
        className={`btn min-h-9 flex-1 border-0 px-2 text-base ${
          value === 1
            ? 'bg-red-500/20 text-red-400 ring-1 ring-red-400/40'
            : 'text-slate-400'
        }`}
        disabled={disabled || isGenderless}
        title="Female"
        type="button"
        onClick={() => onChange(1)}
      >
        ♀
      </button>
    </div>
  )
}
