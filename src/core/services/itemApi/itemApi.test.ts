import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '../../../test/server'
import { requestJson } from '../apiHttp/apiHttp'
import { ItemApi } from './itemApi'

const make = () =>
  new ItemApi((path, opts) => requestJson('http://api.test', 'en', path, opts))

describe('ItemApi', () => {
  it('getItemBag fetches /api/saves/:id/items', async () => {
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

  it('getDonuts fetches /api/saves/:id/donuts', async () => {
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

  it('previewDonut POSTs { berries, berryName } to /api/saves/:id/donuts/preview', async () => {
    let receivedMethod = ''
    let receivedBody: unknown = null
    server.use(
      http.post('*/api/saves/:id/donuts/preview', async ({ request }) => {
        receivedMethod = request.method
        receivedBody = await request.json()
        return HttpResponse.json({})
      }),
    )
    await make().previewDonut('ses-1', [1, 2, 3], 10)
    expect(receivedMethod).toBe('POST')
    expect(receivedBody).toEqual({ berries: [1, 2, 3], berryName: 10 })
  })

  it('getUndergroundItems fetches /api/saves/:id/underground', async () => {
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

  it('getRaids fetches /api/saves/:id/raids', async () => {
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
})
