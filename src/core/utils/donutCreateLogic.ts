import type { DonutFlavorEntry, DonutPreview } from '../types/donut'
import { availableHighestFlavorLevels } from './donutFlavorLabels'

export type DonutFlavorOption = {
  hash: string
  category: string
  displayName: string
  level: number
  label: string
}

export function computeVisibleFlavors(
  filter: string,
  preview: DonutPreview | null,
  flavorCatalog: DonutFlavorEntry[],
): DonutFlavorOption[] {
  const query = filter.trim().toLowerCase()
  if (!preview) return []
  return availableHighestFlavorLevels(flavorCatalog, preview)
    .map((f) => ({ ...f, label: f.displayName }))
    .filter((f) => !query || f.label.toLowerCase().includes(query))
    .sort((a, b) => a.label.localeCompare(b.label))
    .slice(0, 80)
}

export function updateBerry(
  prev: number[],
  index: number,
  value: number,
): number[] {
  return prev.map((berry, i) => (i === index ? value : berry))
}

export function toggleFlavor(
  current: string[],
  hash: string,
  _flavorCatalog: DonutFlavorEntry[],
): string[] {
  if (current.includes(hash)) return current.filter((item) => item !== hash)
  if (current.length >= 3) return current
  return [...current, hash]
}
