import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '../../../test/server'
import { requestJson } from '../apiHttp/apiHttp'
import { DatabaseApi } from './databaseApi'

const make = () =>
  new DatabaseApi((path, opts) =>
    requestJson('http://api.test', 'en', path, opts),
  )

describe('DatabaseApi', () => {
  it('searchEncounters POSTs the data to /api/saves/:id/databases/encounters/search', async () => {
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
    const data = { species: 1, page: 0, limit: 10 }
    await make().searchEncounters('ses-1', data as never)
    expect(receivedBody).toEqual(data)
  })

  it('previewEncounter POSTs { search, resultId } to /api/saves/:id/databases/encounters/preview', async () => {
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
    const search = { species: 1 }
    await make().previewEncounter('ses-1', search as never, 'res-1')
    expect(receivedBody).toEqual({ search, resultId: 'res-1' })
  })

  it('searchMysteryGifts POSTs the data to /api/saves/:id/databases/mystery-gifts/search', async () => {
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
    const data = { format: 1, page: 0, limit: 10 }
    await make().searchMysteryGifts('ses-1', data as never)
    expect(receivedBody).toEqual(data)
  })

  it('previewMysteryGift POSTs { resultId } to /api/saves/:id/databases/mystery-gifts/preview', async () => {
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

  it('previewMetDateFixer POSTs the request to /api/saves/:id/met-date-fixer/preview', async () => {
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
    const req = { fixInvalidDates: true }
    await make().previewMetDateFixer('ses-1', req as never)
    expect(receivedBody).toEqual(req)
  })
})
