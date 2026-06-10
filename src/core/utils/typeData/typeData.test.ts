import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  BASE_TYPE_IDS,
  getTypeBackground,
  getTypeColor,
  getTypeIcon,
  getTypeIconUrl,
  getTypeName,
  setTypeCatalog,
  STELLAR_GRADIENT,
  TERA_TYPE_OVERRIDE_NONE,
  TERA_TYPE_STELLAR,
} from './typeData'

const t = ((key: string) => key) as never

const catalog = (
  entries: { id: number; name?: string; color?: number | null }[],
) => {
  setTypeCatalog(
    entries.map((e) => ({
      id: e.id,
      name: e.name ?? `Type${e.id}`,
      color: e.color ?? null,
    })),
  )
}

describe('typeData constants', () => {
  it('TERA_TYPE_OVERRIDE_NONE is 19', () => {
    expect(TERA_TYPE_OVERRIDE_NONE).toBe(19)
  })

  it('TERA_TYPE_STELLAR is 99', () => {
    expect(TERA_TYPE_STELLAR).toBe(99)
  })

  it('BASE_TYPE_IDS is 0..17', () => {
    expect(BASE_TYPE_IDS).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
    ])
  })

  it('STELLAR_GRADIENT contains the stellar image reference', () => {
    expect(STELLAR_GRADIENT).toContain('/assets/stellar/stellar_bg.png')
  })
})

describe('getTypeName', () => {
  beforeEach(() => setTypeCatalog([]))
  afterEach(() => setTypeCatalog([]))

  it('returns "typeUnknown" when typeId is undefined', () => {
    expect(getTypeName(t, undefined)).toBe('typeUnknown')
  })

  it('returns "typeStellar" for TERA_TYPE_STELLAR (99)', () => {
    expect(getTypeName(t, TERA_TYPE_STELLAR)).toBe('typeStellar')
  })

  it('returns "typeUnknown" for unknown type ids', () => {
    expect(getTypeName(t, 42)).toBe('typeUnknown')
  })

  it('returns the catalog name when present', () => {
    catalog([{ id: 9, name: 'Fire' }])
    expect(getTypeName(t, 9)).toBe('Fire')
  })
})

describe('getTypeColor', () => {
  beforeEach(() => setTypeCatalog([]))
  afterEach(() => setTypeCatalog([]))

  it('returns undefined when typeId is undefined', () => {
    expect(getTypeColor(undefined)).toBeUndefined()
  })

  it('returns the stellar color for TERA_TYPE_STELLAR', () => {
    expect(getTypeColor(TERA_TYPE_STELLAR)).toBe('#38bdf8')
  })

  it('returns undefined for unknown ids', () => {
    expect(getTypeColor(123)).toBeUndefined()
  })

  it('formats a numeric color as a 6-digit hex string', () => {
    catalog([{ id: 1, color: 0xff0000 }]) // red
    expect(getTypeColor(1)).toBe('#ff0000')
  })

  it('returns undefined when color is null in catalog', () => {
    catalog([{ id: 1, color: null }])
    expect(getTypeColor(1)).toBeUndefined()
  })
})

describe('getTypeIconUrl', () => {
  it('returns the stellar icon for TERA_TYPE_STELLAR', () => {
    expect(getTypeIconUrl(TERA_TYPE_STELLAR)).toBe(
      '/assets/stellar/stellar_icon.png',
    )
  })

  it('returns undefined for typeId undefined', () => {
    expect(getTypeIconUrl(undefined)).toBeUndefined()
  })

  it('returns undefined for negative typeId', () => {
    expect(getTypeIconUrl(-1)).toBeUndefined()
  })

  it('returns undefined for typeId out of range', () => {
    expect(getTypeIconUrl(100)).toBeUndefined()
  })

  it('returns the correct icon path for a valid typeId', () => {
    expect(getTypeIconUrl(0)).toBe('/types/type_normal.svg')
    expect(getTypeIconUrl(9)).toBe('/types/type_fire.svg')
    expect(getTypeIconUrl(17)).toBe('/types/type_fairy.svg')
  })
})

describe('getTypeBackground', () => {
  beforeEach(() => setTypeCatalog([]))
  afterEach(() => setTypeCatalog([]))

  it('returns the stellar gradient for TERA_TYPE_STELLAR', () => {
    expect(getTypeBackground(TERA_TYPE_STELLAR)).toBe(STELLAR_GRADIENT)
  })

  it('returns the catalog color when present', () => {
    catalog([{ id: 1, color: 0x00ff00 }])
    expect(getTypeBackground(1)).toBe('#00ff00')
  })

  it('returns the fallback rgba for unknown types', () => {
    expect(getTypeBackground(42)).toBe('rgba(120,120,120,0.6)')
  })

  it('returns the fallback rgba when typeId is undefined', () => {
    expect(getTypeBackground(undefined)).toBe('rgba(120,120,120,0.6)')
  })
})

describe('getTypeIcon (deprecated wrapper)', () => {
  it('returns the icon URL when available', () => {
    expect(getTypeIcon(0)).toBe('/types/type_normal.svg')
  })

  it('returns "·" when icon URL is not available', () => {
    expect(getTypeIcon(undefined)).toBe('·')
  })

  it('returns "·" for out-of-range typeId (but not Stellar 99)', () => {
    expect(getTypeIcon(100)).toBe('·')
  })
})
