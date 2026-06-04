import type { CSSProperties } from 'react'

import type { CatalogEntry } from '../types/index'

export function getCatalogEntryOptionStyle(
  _entry: CatalogEntry | null | undefined,
  options: { legal?: boolean } = {},
): CSSProperties | undefined {
  if (options.legal) {
    return { backgroundColor: 'rgba(34, 197, 94, 0.12)' }
  }

  return undefined
}

export function getCatalogEntrySelectStyle(
  entry: CatalogEntry | null | undefined,
  options: { legal?: boolean } = {},
): CSSProperties | undefined {
  if (options.legal) {
    return {
      backgroundColor: 'rgb(187 247 208 / 0.34)',
      borderColor: '#22c55e',
      boxShadow:
        'inset 0 0 0 1px rgb(34 197 94 / 0.35), 0 1px 0 rgb(255 255 255 / 0.35)',
    }
  }

  return undefined
}
