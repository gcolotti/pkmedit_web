import type { CatalogEntry } from '../types/index'
import { sortCatalogEntriesByName } from './catalogSort'

const SEARCH_RESULT_LIMIT = 10
const MISSING_MATCH_POSITION = Number.MAX_SAFE_INTEGER

function normalizeCatalogSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase()
}

function scoreEntry(entry: CatalogEntry, query: string) {
  const name = normalizeCatalogSearchText(entry.name)
  const id = String(entry.id)
  const nameIndex = name.indexOf(query)
  const idIndex = id.indexOf(query)
  if (nameIndex < 0 && idIndex < 0) return null

  const matchIndex = Math.min(
    nameIndex < 0 ? MISSING_MATCH_POSITION : nameIndex,
    idIndex < 0 ? MISSING_MATCH_POSITION : idIndex,
  )
  return {
    startsWith: name.startsWith(query) || id.startsWith(query) ? 0 : 1,
    matchIndex,
    length: name.length,
    name,
    id: entry.id,
  }
}

type CatalogSearchScore = NonNullable<ReturnType<typeof scoreEntry>>

export function getCatalogSearchResults(
  entries: CatalogEntry[],
  queryText: string,
  selectedId?: number,
): CatalogEntry[] {
  const query = normalizeCatalogSearchText(queryText.trim())

  if (!query) {
    const sorted = sortCatalogEntriesByName(entries)
    const selected = sorted.find((entry) => entry.id === selectedId)
    const rest = selected
      ? sorted.filter((entry) => entry.id !== selected.id)
      : sorted
    return selected ? [selected, ...rest] : rest
  }

  return entries
    .flatMap(
      (entry): Array<{ entry: CatalogEntry; score: CatalogSearchScore }> => {
        const score = scoreEntry(entry, query)
        return score ? [{ entry, score }] : []
      },
    )
    .sort(
      (a, b) =>
        a.score.startsWith - b.score.startsWith ||
        a.score.matchIndex - b.score.matchIndex ||
        a.score.length - b.score.length ||
        a.score.name.localeCompare(b.score.name) ||
        a.score.id - b.score.id,
    )
    .slice(0, SEARCH_RESULT_LIMIT)
    .map((item) => item.entry)
}
