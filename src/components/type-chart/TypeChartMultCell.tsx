import { TYPE_CHART_MULTIPLIER_IMAGE_URLS } from '../../core/utils/wikiDexAssets'

type Props = {
  label: string
  size?: 'legend' | 'table'
  value: number
}

const SIZE_CLASSES = {
  legend: 'h-5 w-5',
  table: 'h-6 w-6',
} as const

export function TypeChartMultCell({ label, size = 'table', value }: Props) {
  const imageUrl = TYPE_CHART_MULTIPLIER_IMAGE_URLS[value]
  const sizeClass = SIZE_CLASSES[size]

  if (imageUrl) {
    return (
      <img
        alt={label}
        className={`${sizeClass} object-contain drop-shadow-sm`}
        decoding="async"
        loading="lazy"
        src={imageUrl}
        title={label}
      />
    )
  }

  return (
    <span
      aria-label={label}
      className={`inline-flex ${sizeClass} items-center justify-center text-sm font-bold text-zinc-950`}
      title={label}
    >
      ·
    </span>
  )
}
