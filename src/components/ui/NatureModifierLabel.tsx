import type { Translator } from '../../core/i18n/i18n'
import { natureModifier } from '../../core/utils/natureData'

export function NatureModifierLabel({
  upStat,
  downStat,
  t,
}: {
  upStat?: number | null
  downStat?: number | null
  t: Translator
}) {
  const mod = natureModifier(upStat, downStat)
  if (!mod) return null
  return (
    <span className="shrink-0 text-[0.65rem]">
      <span className="text-red-400">↑{t(mod.up)}</span>
      <span className="text-stone-500">/</span>
      <span className="text-sky-400">↓{t(mod.down)}</span>
    </span>
  )
}
