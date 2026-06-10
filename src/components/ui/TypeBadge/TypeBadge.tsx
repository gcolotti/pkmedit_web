import type { Translator } from '../../../core/i18n/i18n/i18n'
import {
  getTypeBackground,
  getTypeName,
} from '../../../core/utils/typeData/typeData'
import { TypeIcon } from '../TypeIcon/TypeIcon'

export function TypeBadge({
  typeId,
  shape,
  t,
  onClick,
}: {
  typeId: number
  shape: 'pill' | 'square'
  t: Translator
  onClick?: () => void
}) {
  const background = getTypeBackground(typeId)
  const name = getTypeName(t, typeId)
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      className={`flex min-w-0 items-center gap-1 px-2 py-1 font-bold tracking-wider text-white ${shape === 'pill' ? 'rounded-full' : 'rounded-sm'} ${onClick ? 'transition-brightness cursor-pointer hover:brightness-110 active:brightness-90' : ''}`}
      style={{
        background,
        fontSize: '0.65rem',
      }}
      type={onClick ? 'button' : undefined}
      onClick={onClick}
    >
      <TypeIcon className="h-3 w-3 shrink-0" typeId={typeId} />
      <span className="truncate uppercase">{name}</span>
    </Tag>
  )
}
