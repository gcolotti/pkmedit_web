import type { Translator } from '../../core/i18n/i18n'
import { TypeBadge } from '../ui/TypeBadge'

export function PokemonTypeBadges({
  type1,
  type2,
  teraType,
  t,
  onOpenTypeChart,
}: {
  type1: number
  type2: number
  teraType: number
  t: Translator
  onOpenTypeChart?: (typeId: number) => void
}) {
  const isDualType = type2 >= 0 && type2 !== type1
  const hasTeraType = teraType >= 0
  const handleOpen = onOpenTypeChart
    ? (typeId: number) => () => onOpenTypeChart(typeId)
    : null

  return (
    <div className="grid grid-cols-3 gap-2 sm:col-span-2">
      <TypeBadge
        shape="pill"
        t={t}
        typeId={type1}
        onClick={handleOpen ? handleOpen(type1) : undefined}
      />
      {isDualType && (
        <TypeBadge
          shape="pill"
          t={t}
          typeId={type2}
          onClick={handleOpen ? handleOpen(type2) : undefined}
        />
      )}
      {hasTeraType && (
        <TypeBadge
          shape="square"
          t={t}
          typeId={teraType}
          onClick={handleOpen ? handleOpen(teraType) : undefined}
        />
      )}
    </div>
  )
}
