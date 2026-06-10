import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '../../../test/server'
import { ApiClient } from './api'

const baseUrl = 'http://api.test'

const make = (language: 'en' | 'es' | 'ja' = 'en') =>
  new ApiClient(
    () => baseUrl,
    () => language,
  )

describe('ApiClient', () => {
  it('composes all sub-API instances', () => {
    const api = make()
    expect(api.save).toBeDefined()
    expect(api.pokemon).toBeDefined()
    expect(api.catalog).toBeDefined()
    expect(api.item).toBeDefined()
    expect(api.database).toBeDefined()
    expect(api.export_).toBeDefined()
  })

  it('getHealth hits /api/health', async () => {
    let url = ''
    server.use(
      http.get('*/api/health', ({ request }) => {
        url = request.url
        return HttpResponse.json({ status: 'ok' })
      }),
    )
    const result = await make().getHealth()
    expect(url).toMatch(/\/api\/health$/)
    expect(result).toEqual({ status: 'ok' })
  })

  it('getCapabilities hits /api/capabilities', async () => {
    let url = ''
    server.use(
      http.get('*/api/capabilities', ({ request }) => {
        url = request.url
        return HttpResponse.json({ pkhexCoreVersion: '1.0.0' })
      }),
    )
    const result = await make().getCapabilities()
    expect(url).toMatch(/\/api\/capabilities$/)
    expect(result).toEqual({ pkhexCoreVersion: '1.0.0' })
  })

  it('listSaves delegates to save.listSaves', async () => {
    let url = ''
    server.use(
      http.get('*/api/saves/files', ({ request }) => {
        url = request.url
        return HttpResponse.json([])
      }),
    )
    await make().listSaves()
    expect(url).toMatch(/\/api\/saves\/files$/)
  })

  it('openSave delegates to save.openSave with the path', async () => {
    let receivedBody: unknown = null
    server.use(
      http.post('*/api/saves/open', async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json({ sessionId: 's', summary: {} })
      }),
    )
    await make().openSave('/p.sav')
    expect(receivedBody).toEqual({ path: '/p.sav' })
  })

  it('uploadAndOpenSave delegates to save.uploadAndOpenSave', async () => {
    let contentType: string | null = null
    server.use(
      http.post('*/api/saves/upload-open', ({ request }) => {
        contentType = request.headers.get('content-type')
        return HttpResponse.json({ sessionId: 's', summary: {} })
      }),
    )
    await make().uploadAndOpenSave(new File(['x'], 'x.sav'))
    expect(contentType).toMatch(/^multipart\/form-data/)
  })

  it('getSummary delegates to save.getSummary', async () => {
    let url = ''
    server.use(
      http.get('*/api/saves/:id/summary', ({ request }) => {
        url = request.url
        return HttpResponse.json({})
      }),
    )
    await make().getSummary('ses-1')
    expect(url).toMatch(/\/api\/saves\/ses-1\/summary$/)
  })

  it('getParty delegates to pokemon.getParty', async () => {
    let url = ''
    server.use(
      http.get('*/api/saves/:id/party', ({ request }) => {
        url = request.url
        return HttpResponse.json({ slots: [] })
      }),
    )
    await make().getParty('ses-1')
    expect(url).toMatch(/\/api\/saves\/ses-1\/party$/)
  })

  it('getBoxes delegates to pokemon.getBoxes', async () => {
    let url = ''
    server.use(
      http.get('*/api/saves/:id/boxes', ({ request }) => {
        url = request.url
        return HttpResponse.json({ boxes: [] })
      }),
    )
    await make().getBoxes('ses-1')
    expect(url).toMatch(/\/api\/saves\/ses-1\/boxes$/)
  })

  it('getPokemon delegates to pokemon.getPokemon', async () => {
    let url = ''
    server.use(
      http.get('*/api/saves/:id/pokemon/:slotId', ({ request }) => {
        url = request.url
        return HttpResponse.json({})
      }),
    )
    await make().getPokemon('ses-1', 'slot-7')
    expect(url).toMatch(/\/api\/saves\/ses-1\/pokemon\/slot-7$/)
  })

  it('previewPokemonUpdate delegates to pokemon.previewPokemonUpdate', async () => {
    let receivedBody: unknown = null
    server.use(
      http.post(
        '*/api/saves/:id/pokemon/:slotId/preview',
        async ({ request }) => {
          receivedBody = await request.json()
          return HttpResponse.json({})
        },
      ),
    )
    await make().previewPokemonUpdate('ses-1', 'slot-7', { x: 1 })
    expect(receivedBody).toEqual({ x: 1 })
  })

  it('checkDraft delegates to pokemon.checkDraft', async () => {
    let receivedBody: unknown = null
    server.use(
      http.post('*/api/saves/:id/legality/check-draft', async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json({
          reports: [],
          violations: [],
          blocked: false,
        })
      }),
    )
    await make().checkDraft('ses-1', [{ slotId: 'a' }], false)
    expect(receivedBody).toEqual({
      allowIllegalChanges: false,
      changes: [{ slotId: 'a' }],
    })
  })

  it('getTrainerInfo delegates to pokemon.getTrainerInfo', async () => {
    let url = ''
    server.use(
      http.get('*/api/saves/:id/trainer', ({ request }) => {
        url = request.url
        return HttpResponse.json({})
      }),
    )
    await make().getTrainerInfo('ses-1')
    expect(url).toMatch(/\/api\/saves\/ses-1\/trainer$/)
  })

  it('getCatalogs delegates to catalog.getCatalogs (and uses the current language)', async () => {
    let url = ''
    server.use(
      http.get('*/api/catalogs', ({ request }) => {
        url = request.url
        return HttpResponse.json({ types: [], moves: [], abilities: [] })
      }),
    )
    await make('es').getCatalogs()
    expect(url).toMatch(/\/api\/catalogs\?lang=es$/)
  })

  it('getItemBag delegates to item.getItemBag', async () => {
    let url = ''
    server.use(
      http.get('*/api/saves/:id/items', ({ request }) => {
        url = request.url
        return HttpResponse.json({})
      }),
    )
    await make().getItemBag('ses-1')
    expect(url).toMatch(/\/api\/saves\/ses-1\/items$/)
  })

  it('getDonuts delegates to item.getDonuts', async () => {
    let url = ''
    server.use(
      http.get('*/api/saves/:id/donuts', ({ request }) => {
        url = request.url
        return HttpResponse.json({})
      }),
    )
    await make().getDonuts('ses-1')
    expect(url).toMatch(/\/api\/saves\/ses-1\/donuts$/)
  })

  it('previewDonut delegates to item.previewDonut', async () => {
    let receivedBody: unknown = null
    server.use(
      http.post('*/api/saves/:id/donuts/preview', async ({ request }) => {
        receivedBody = await request.json()
        return HttpResponse.json({})
      }),
    )
    await make().previewDonut('ses-1', [1], 9)
    expect(receivedBody).toEqual({ berries: [1], berryName: 9 })
  })

  it('getUndergroundItems delegates to item.getUndergroundItems', async () => {
    let url = ''
    server.use(
      http.get('*/api/saves/:id/underground', ({ request }) => {
        url = request.url
        return HttpResponse.json({})
      }),
    )
    await make().getUndergroundItems('ses-1')
    expect(url).toMatch(/\/api\/saves\/ses-1\/underground$/)
  })

  it('getRaids delegates to item.getRaids', async () => {
    let url = ''
    server.use(
      http.get('*/api/saves/:id/raids', ({ request }) => {
        url = request.url
        return HttpResponse.json({})
      }),
    )
    await make().getRaids('ses-1')
    expect(url).toMatch(/\/api\/saves\/ses-1\/raids$/)
  })

  it('searchEncounters delegates to database.searchEncounters', async () => {
    let receivedBody: unknown = null
    server.use(
      http.post(
        '*/api/saves/:id/databases/encounters/search',
        async ({ request }) => {
          receivedBody = await request.json()
          return HttpResponse.json({
            total: 0,
            page: 0,
            pageSize: 0,
            pageCount: 0,
            results: [],
          })
        },
      ),
    )
    await make().searchEncounters('ses-1', { species: 1 } as never)
    expect(receivedBody).toEqual({ species: 1 })
  })

  it('previewEncounter delegates to database.previewEncounter', async () => {
    let receivedBody: unknown = null
    server.use(
      http.post(
        '*/api/saves/:id/databases/encounters/preview',
        async ({ request }) => {
          receivedBody = await request.json()
          return HttpResponse.json({
            entry: {},
            pokemon: {},
            replacement: { dataBase64: '' },
          })
        },
      ),
    )
    await make().previewEncounter('ses-1', { species: 1 } as never, 'res-1')
    expect(receivedBody).toEqual({ search: { species: 1 }, resultId: 'res-1' })
  })

  it('searchMysteryGifts delegates to database.searchMysteryGifts', async () => {
    let receivedBody: unknown = null
    server.use(
      http.post(
        '*/api/saves/:id/databases/mystery-gifts/search',
        async ({ request }) => {
          receivedBody = await request.json()
          return HttpResponse.json({
            total: 0,
            page: 0,
            pageSize: 0,
            pageCount: 0,
            storage: { supported: true, full: false, capacity: 0, used: 0 },
            legalityCounts: { legal: 0, uncertain: 0, illegal: 0 },
            results: [],
          })
        },
      ),
    )
    await make().searchMysteryGifts('ses-1', { format: 1 } as never)
    expect(receivedBody).toEqual({ format: 1 })
  })

  it('previewMysteryGift delegates to database.previewMysteryGift', async () => {
    let receivedBody: unknown = null
    server.use(
      http.post(
        '*/api/saves/:id/databases/mystery-gifts/preview',
        async ({ request }) => {
          receivedBody = await request.json()
          return HttpResponse.json({
            entry: {},
            pokemon: null,
            draft: { giftDataBase64: '', extension: '' },
            replacement: null,
            storage: { supported: true, full: false, capacity: 0, used: 0 },
          })
        },
      ),
    )
    await make().previewMysteryGift('ses-1', 'res-1')
    expect(receivedBody).toEqual({ resultId: 'res-1' })
  })

  it('previewMetDateFixer delegates to database.previewMetDateFixer', async () => {
    let receivedBody: unknown = null
    server.use(
      http.post(
        '*/api/saves/:id/met-date-fixer/preview',
        async ({ request }) => {
          receivedBody = await request.json()
          return HttpResponse.json({})
        },
      ),
    )
    await make().previewMetDateFixer('ses-1', {
      fixInvalidDates: true,
    } as never)
    expect(receivedBody).toEqual({ fixInvalidDates: true })
  })

  it('exportSave delegates to export.exportSave', async () => {
    let url = ''
    server.use(
      http.get('*/api/saves/:id/export', ({ request }) => {
        url = request.url
        return new HttpResponse('x', {
          headers: { 'content-type': 'application/octet-stream' },
        })
      }),
    )
    await make().exportSave('ses-1')
    expect(url).toMatch(/\/api\/saves\/ses-1\/export$/)
  })

  it('exportSave with format=zip appends the query', async () => {
    let url = ''
    server.use(
      http.get('*/api/saves/:id/export', ({ request }) => {
        url = request.url
        return new HttpResponse('x', {
          headers: { 'content-type': 'application/octet-stream' },
        })
      }),
    )
    await make().exportSave('ses-1', 'zip')
    expect(url).toMatch(/\/api\/saves\/ses-1\/export\?format=zip$/)
  })

  it('exportDraft delegates to export.exportDraft with built body', async () => {
    let receivedBody: unknown = null
    server.use(
      http.post('*/api/saves/:id/export-draft', async ({ request }) => {
        receivedBody = await request.json()
        return new HttpResponse('x', {
          headers: { 'content-type': 'application/octet-stream' },
        })
      }),
    )
    await make().exportDraft('ses-1', [{ slotId: 'a' }], true)
    expect(receivedBody).toMatchObject({
      allowIllegalChanges: true,
      changes: [{ slotId: 'a' }],
      pokedexActions: null,
      donutDrafts: null,
      arceusResearchActions: null,
    })
  })
})
