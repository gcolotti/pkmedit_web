import type { CSSProperties } from 'react'

import type { CatalogEntry } from '../../../../core/types/index/index'
import { hexToRgba } from '../../../../core/utils/color/color'
import { getTypeColor } from '../../../../core/utils/typeData/typeData'

export function getMoveOptionStyle(
  entry: CatalogEntry,
  options: { legal: boolean; selected: boolean },
): CSSProperties | undefined {
  if (options.selected) {
    const color = getTypeColor(entry.typeId)
    return color ? { backgroundColor: hexToRgba(color, 0.25) } : undefined
  }
  if (options.legal) return { backgroundColor: 'rgba(34, 197, 94, 0.12)' }
  return undefined
}
