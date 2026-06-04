import { getTypeIconUrl } from '../../../core/utils/typeData/typeData'

export function TypeIcon({
  typeId,
  className,
}: {
  typeId: number | undefined
  className?: string
}) {
  const url = getTypeIconUrl(typeId)
  if (!url) return <span className={`inline-block ${className ?? 'h-4 w-4'}`} />
  return (
    <img
      alt=""
      aria-hidden="true"
      className={`${className ?? 'h-4 w-4 shrink-0'} object-contain`}
      src={url}
    />
  )
}
