import type { Translator } from '../i18n/i18n'
import type { CatalogEntry } from '../types/index'
import { getTypeName } from './typeData'

export type CatalogEntryGroup = {
  key: string
  label: string
  entries: CatalogEntry[]
}

export function sortCatalogEntriesByName(
  entries: CatalogEntry[],
): CatalogEntry[] {
  return [...entries].sort(
    (a, b) => a.name.localeCompare(b.name) || a.id - b.id,
  )
}

export function sortCatalogEntriesByType(
  entries: CatalogEntry[],
): CatalogEntry[] {
  return [...entries].sort(
    (a, b) =>
      (a.typeId ?? Number.MAX_SAFE_INTEGER) -
        (b.typeId ?? Number.MAX_SAFE_INTEGER) ||
      a.name.localeCompare(b.name) ||
      a.id - b.id,
  )
}

export function groupCatalogEntriesByType(
  entries: CatalogEntry[],
  t: Translator,
): CatalogEntryGroup[] {
  return Object.values(
    sortCatalogEntriesByType(entries).reduce<Record<string, CatalogEntryGroup>>(
      (groups, entry) => {
        const key =
          entry.typeId === undefined ? 'unknown' : String(entry.typeId)
        groups[key] ??= {
          key,
          label:
            entry.typeId === undefined
              ? t('typeUnknown')
              : getTypeName(t, entry.typeId),
          entries: [],
        }
        groups[key].entries.push(entry)
        return groups
      },
      {},
    ),
  )
}
