import { http, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import { server } from '../../../test/server'
import { requestJson } from '../apiHttp/apiHttp'
import { CatalogApi } from './catalogApi'

// setTypeCatalog is a side-effect inside getCatalogs. Spy on it so we
// can assert it's called with the right argument without depending on
// the rest of typeData.
vi.mock('../../utils/typeData/typeData', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../utils/typeData/typeData')>()
  return {
    ...actual,
    setTypeCatalog: vi.fn(),
  }
})

const setTypeCatalog = (await import('../../utils/typeData/typeData'))
  .setTypeCatalog as unknown as ReturnType<typeof vi.fn>

const make = () =>
  new CatalogApi(
    (path, opts) => requestJson('http://api.test', 'en', path, opts),
    () => 'en' as const,
  )

describe('CatalogApi', () => {
  it('getCatalogs fetches /api/catalogs?lang=<lang> and registers the types via setTypeCatalog', async () => {
    let url = ''
    server.use(
      http.get('*/api/catalogs', ({ request }) => {
        url = request.url
        return HttpResponse.json({
          types: [{ id: 1, name: 'Fire' }],
          moves: [],
          abilities: [],
        })
      }),
    )
    setTypeCatalog.mockClear()
    const result = await make().getCatalogs()
    expect(url).toMatch(/\/api\/catalogs\?lang=en$/)
    expect(setTypeCatalog).toHaveBeenCalledWith([{ id: 1, name: 'Fire' }])
    expect(result).toEqual({
      types: [{ id: 1, name: 'Fire' }],
      moves: [],
      abilities: [],
    })
  })

  it('getMoveDetails omits ?ids when none provided', async () => {
    let url = ''
    server.use(
      http.get('*/api/catalogs/move-details', ({ request }) => {
        url = request.url
        return HttpResponse.json({
          entries: [],
          total: 0,
          page: null,
          pageSize: null,
          hasNext: null,
          hasPrevious: null,
        })
      }),
    )
    await make().getMoveDetails()
    expect(url).toMatch(/\/api\/catalogs\/move-details$/)
  })

  it('getMoveDetails adds ?ids= when ids are provided', async () => {
    let url = ''
    server.use(
      http.get('*/api/catalogs/move-details', ({ request }) => {
        url = request.url
        return HttpResponse.json({
          entries: [],
          total: 0,
          page: null,
          pageSize: null,
          hasNext: null,
          hasPrevious: null,
        })
      }),
    )
    await make().getMoveDetails({ ids: [1, 2, 3] })
    expect(url).toMatch(/\?ids=1%2C2%2C3$/)
  })

  it('getMoveDetails with empty ids array omits the param (matches the source: only set when length > 0)', async () => {
    let url = ''
    server.use(
      http.get('*/api/catalogs/move-details', ({ request }) => {
        url = request.url
        return HttpResponse.json({
          entries: [],
          total: 0,
          page: null,
          pageSize: null,
          hasNext: null,
          hasPrevious: null,
        })
      }),
    )
    await make().getMoveDetails({ ids: [] })
    expect(url).toMatch(/\/api\/catalogs\/move-details$/)
  })

  it('getAbilityDetails adds ?ids= when provided', async () => {
    let url = ''
    server.use(
      http.get('*/api/catalogs/ability-details', ({ request }) => {
        url = request.url
        return HttpResponse.json({
          entries: [],
          total: 0,
          page: null,
          pageSize: null,
          hasNext: null,
          hasPrevious: null,
        })
      }),
    )
    await make().getAbilityDetails({ ids: [7, 8] })
    expect(url).toMatch(/\?ids=7%2C8$/)
  })

  it('getAbilityDetails falls back to ?slugs= when ids is empty and slugs is provided', async () => {
    let url = ''
    server.use(
      http.get('*/api/catalogs/ability-details', ({ request }) => {
        url = request.url
        return HttpResponse.json({
          entries: [],
          total: 0,
          page: null,
          pageSize: null,
          hasNext: null,
          hasPrevious: null,
        })
      }),
    )
    await make().getAbilityDetails({ slugs: ['overgrow', 'blaze'] })
    expect(url).toMatch(/\?slugs=overgrow%2Cblaze$/)
  })

  it('getAbilityDetails adds no query string when both ids and slugs are empty', async () => {
    let url = ''
    server.use(
      http.get('*/api/catalogs/ability-details', ({ request }) => {
        url = request.url
        return HttpResponse.json({
          entries: [],
          total: 0,
          page: null,
          pageSize: null,
          hasNext: null,
          hasPrevious: null,
        })
      }),
    )
    await make().getAbilityDetails({ ids: [], slugs: [] })
    expect(url).toMatch(/\/api\/catalogs\/ability-details$/)
  })
})
