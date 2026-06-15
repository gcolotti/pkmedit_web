import type { Translator } from '../../../../core/i18n/i18n/i18n'

// Shiny / Alpha objectives. Both are targets (default = current value): toggling
// records intent that is sent to "Generate legal"; it does not mutate the draft.
export function LegalityObjectives({
  onTargetAlphaChange,
  onTargetShinyChange,
  supportsAlpha,
  t,
  targetAlpha,
  targetShiny,
}: {
  onTargetAlphaChange: (value: boolean) => void
  onTargetShinyChange: (value: boolean) => void
  supportsAlpha: boolean
  t: Translator
  targetAlpha: boolean
  targetShiny: boolean
}) {
  const toggles = [
    {
      key: 'shiny',
      label: t('shiny'),
      checked: targetShiny,
      onChange: onTargetShinyChange,
      show: true,
    },
    {
      key: 'alpha',
      label: t('alpha'),
      checked: targetAlpha,
      onChange: onTargetAlphaChange,
      show: supportsAlpha,
    },
  ]

  return (
    <div className="grid gap-1.5">
      {toggles
        .filter((toggle) => toggle.show)
        .map((toggle) => (
          <label
            key={toggle.key}
            className="flex items-center justify-between gap-2 rounded-md border border-black/10 px-3 py-2 text-sm font-semibold dark:border-white/10"
          >
            <span>{toggle.label}</span>
            <input
              checked={toggle.checked}
              type="checkbox"
              onChange={(event) => toggle.onChange(event.currentTarget.checked)}
            />
          </label>
        ))}
    </div>
  )
}
