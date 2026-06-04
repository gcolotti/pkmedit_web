import type { Translator } from '../../core/i18n/i18n'
import type { DonutFlavorProfile } from '../../core/types/donut'

type DonutFlavorKey = keyof DonutFlavorProfile

export const DONUT_FLAVOR_DISPLAY: Array<{
  key: DonutFlavorKey
  labelKey:
    | 'donutFlavorSpicyShort'
    | 'donutFlavorFreshShort'
    | 'donutFlavorSweetShort'
    | 'donutFlavorBitterShort'
    | 'donutFlavorSourShort'
  className: string
  dimClassName: string
}> = [
  {
    key: 'spicy',
    labelKey: 'donutFlavorSpicyShort',
    className: 'border-yellow-300/60 bg-yellow-300/20 text-yellow-100',
    dimClassName: 'border-yellow-300/20 bg-yellow-300/5 text-yellow-100/30',
  },
  {
    key: 'fresh',
    labelKey: 'donutFlavorFreshShort',
    className: 'border-emerald-300/60 bg-emerald-300/20 text-emerald-100',
    dimClassName: 'border-emerald-300/20 bg-emerald-300/5 text-emerald-100/30',
  },
  {
    key: 'sweet',
    labelKey: 'donutFlavorSweetShort',
    className: 'border-pink-300/60 bg-pink-300/20 text-pink-100',
    dimClassName: 'border-pink-300/20 bg-pink-300/5 text-pink-100/30',
  },
  {
    key: 'bitter',
    labelKey: 'donutFlavorBitterShort',
    className: 'border-sky-300/60 bg-sky-300/20 text-sky-100',
    dimClassName: 'border-sky-300/20 bg-sky-300/5 text-sky-100/30',
  },
  {
    key: 'sour',
    labelKey: 'donutFlavorSourShort',
    className: 'border-lime-300/60 bg-lime-300/20 text-lime-100',
    dimClassName: 'border-lime-300/20 bg-lime-300/5 text-lime-100/30',
  },
]

type Props = {
  profile: DonutFlavorProfile
  t: Translator
  emptyLabel?: string
  showZero?: boolean
  grid?: boolean
}

export function DonutFlavorBadges({
  emptyLabel,
  grid = false,
  profile,
  showZero = false,
  t,
}: Props) {
  const visible = DONUT_FLAVOR_DISPLAY.filter(
    (flavor) => showZero || profile[flavor.key] > 0,
  )
  if (!visible.length)
    return emptyLabel ? (
      <span className="text-xs text-stone-500">{emptyLabel}</span>
    ) : null

  return (
    <div className={grid ? 'grid grid-cols-5 gap-1' : 'flex flex-wrap gap-1'}>
      {visible.map((flavor) => (
        <span
          key={flavor.key}
          className={`rounded border px-1.5 py-0.5 text-center text-[0.68rem] font-bold ${flavor.className}`}
        >
          {t(flavor.labelKey)} {profile[flavor.key]}
        </span>
      ))}
    </div>
  )
}
