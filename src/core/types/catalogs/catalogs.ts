import type { Language } from '../index/index'

export type CatalogEntry = {
  id: number
  name: string
  typeId?: number
  power?: number | null
  accuracy?: number | null
  basePp?: number | null
  category?: number | null
  // Nature stat modifiers: amp stat index 0-4 over [Atk, Def, Spe, SpA, SpD].
  // Both null = neutral nature (or a non-nature catalog entry).
  upStat?: number | null
  downStat?: number | null
  color?: number | null
  // Save-scoped items only: Gen 4+ item ID for the icon (Gen 1-3 bags use
  // their own ID space). null = no icon; undefined = id is already Gen 4+.
  spriteId?: number | null
}

export type CatalogBundle = {
  language: Language
  species: CatalogEntry[]
  moves: CatalogEntry[]
  items: CatalogEntry[]
  natures: CatalogEntry[]
  balls: CatalogEntry[]
  versions: CatalogEntry[]
  abilities: CatalogEntry[]
  languages: CatalogEntry[]
  ribbons: CatalogEntry[]
  memories: CatalogEntry[]
  types: CatalogEntry[]
}
