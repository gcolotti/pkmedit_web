import type { Translator } from '../i18n/i18n'
import type { CatalogEntry } from '../types/catalogs'

export const TERA_TYPE_OVERRIDE_NONE = 19
export const TERA_TYPE_STELLAR = 99

const BASE_TYPE_COUNT = 18

// Ordered by typeId 0-17: Normal, Fighting, Flying, Poison, Ground, Rock, Bug,
// Ghost, Steel, Fire, Water, Grass, Electric, Psychic, Ice, Dragon, Dark, Fairy.
const TYPE_ICON_FILES = [
  'type_normal.svg',
  'type_fighting.svg',
  'type_flying.svg',
  'type_poison.svg',
  'type_ground.svg',
  'type_rock.svg',
  'type_bug.svg',
  'type_ghost.svg',
  'type_steel.svg',
  'type_fire.svg',
  'type_water.svg',
  'type_grass.svg',
  'type_electric.svg',
  'type_psychic.svg',
  'type_ice.svg',
  'type_dragon.svg',
  'type_dark.svg',
  'type_fairy.svg',
] as const

export const BASE_TYPE_IDS = Array.from(
  { length: BASE_TYPE_COUNT },
  (_, i) => i,
)

// Type names + colours are served by the backend catalog (/api/catalogs → types),
// the single canonical origin shared with the Switch client. Populated once when
// the catalog bundle loads; until then name/colour resolve to undefined and
// callers fall back. Icons stay client-side assets (mapping below).
const typeCatalog = new Map<number, { name: string; color?: string }>()

export function setTypeCatalog(entries: readonly CatalogEntry[]): void {
  typeCatalog.clear()
  for (const entry of entries) {
    typeCatalog.set(entry.id, {
      name: entry.name,
      color:
        entry.color == null
          ? undefined
          : `#${(entry.color & 0xffffff).toString(16).padStart(6, '0')}`,
    })
  }
}

export function getTypeName(t: Translator, typeId: number | undefined): string {
  if (typeId === undefined) return t('typeUnknown')
  return (
    typeCatalog.get(typeId)?.name ??
    (typeId === TERA_TYPE_STELLAR ? t('typeStellar') : t('typeUnknown'))
  )
}

export function getTypeColor(typeId: number | undefined): string | undefined {
  if (typeId === undefined) return undefined
  return (
    typeCatalog.get(typeId)?.color ??
    (typeId === TERA_TYPE_STELLAR ? '#38bdf8' : undefined)
  )
}

export function getTypeIconUrl(typeId: number | undefined): string | undefined {
  if (typeId === TERA_TYPE_STELLAR) return '/assets/stellar/stellar_icon.png'
  if (typeId === undefined || typeId < 0 || typeId >= TYPE_ICON_FILES.length)
    return undefined
  return `/types/${TYPE_ICON_FILES[typeId]}`
}

export const STELLAR_GRADIENT =
  "url('/assets/stellar/stellar_bg.png') center / 100% 100% no-repeat"

export function getTypeBackground(typeId: number | undefined): string {
  if (typeId === TERA_TYPE_STELLAR) return STELLAR_GRADIENT
  return getTypeColor(typeId) ?? 'rgba(120,120,120,0.6)'
}

/** @deprecated use getTypeIconUrl for img rendering */
export function getTypeIcon(typeId: number | undefined): string {
  return getTypeIconUrl(typeId) ?? '·'
}
