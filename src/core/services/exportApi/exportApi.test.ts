import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '../../../test/server'
import { requestBlob, requestJson } from '../apiHttp/apiHttp'
import { ExportApi } from './exportApi'

const make = () =>
  new ExportApi(
    (path, opts) => requestBlob('http://api.test', 'en', path, opts),
    (path, opts) => requestJson('http://api.test', 'en', path, opts),
  )

describe('ExportApi', () => {
  it('exportSave fetches /api/saves/:id/export with no query by default', async () => {
    let url = ''
    server.use(
      http.get('*/api/saves/:id/export', ({ request }) => {
        url = request.url
        return new HttpResponse('export', {
          headers: { 'content-type': 'application/octet-stream' },
        })
      }),
    )
    await make().exportSave('ses-1')
    expect(url).toMatch(/\/api\/saves\/ses-1\/export$/)
  })

  it('exportSave appends ?format=zip when format is "zip"', async () => {
    let url = ''
    server.use(
      http.get('*/api/saves/:id/export', ({ request }) => {
        url = request.url
        return new HttpResponse('export', {
          headers: { 'content-type': 'application/octet-stream' },
        })
      }),
    )
    await make().exportSave('ses-1', 'zip')
    expect(url).toMatch(/\/api\/saves\/ses-1\/export\?format=zip$/)
  })

  it('exportDraft POSTs the full body to /api/saves/:id/export-draft with null defaults', async () => {
    let receivedMethod = ''
    let receivedBody: unknown = null
    let receivedContentType: string | null = null
    server.use(
      http.post('*/api/saves/:id/export-draft', async ({ request }) => {
        receivedMethod = request.method
        receivedContentType = request.headers.get('content-type')
        receivedBody = await request.json()
        return new HttpResponse('export-draft', {
          headers: { 'content-type': 'application/octet-stream' },
        })
      }),
    )
    await make().exportDraft('ses-1', [], false)
    expect(receivedMethod).toBe('POST')
    expect(receivedContentType).toBe('application/json')
    expect(receivedBody).toEqual({
      allowIllegalChanges: false,
      changes: [],
      trainerUpdate: null,
      itemsUpdate: null,
      mysteryGifts: null,
      pokedexActions: null,
      donutDrafts: null,
      metDateFixer: null,
      undergroundItemsUpdate: null,
      raidsUpdate: null,
      arceusResearchActions: null,
    })
  })

  it('exportDraft builds pokedexActions targets when pokedexActions is non-empty', async () => {
    let receivedBody: unknown = null
    server.use(
      http.post('*/api/saves/:id/export-draft', async ({ request }) => {
        receivedBody = await request.json()
        return new HttpResponse('', { headers: { 'content-type': 'application/octet-stream' } })
      }),
    )
    await make().exportDraft('ses-1', [], false, null, null, null, [
      { dexId: 'national', action: 'seen' },
    ])
    expect((receivedBody as { pokedexActions: unknown }).pokedexActions).toEqual({
      targets: [{ dexId: 'national', action: 'seen' }],
    })
  })

  it('exportDraft builds donutDrafts payload when donutDrafts is non-empty', async () => {
    let receivedBody: unknown = null
    server.use(
      http.post('*/api/saves/:id/export-draft', async ({ request }) => {
        receivedBody = await request.json()
        return new HttpResponse('', { headers: { 'content-type': 'application/octet-stream' } })
      }),
    )
    const donut = {
      id: 'a',
      label: 'X',
      berries: [1, 2],
      berryName: 10,
      flavor0: 0,
      flavor1: 1,
      flavor2: 2,
    } as never
    await make().exportDraft('ses-1', [], false, null, null, null, null, [donut])
    expect((receivedBody as { donutDrafts: unknown }).donutDrafts).toEqual([
      { berries: [1, 2], berryName: 10, flavor0: 0, flavor1: 1, flavor2: 2 },
    ])
  })

  it('exportDraft builds arceusResearchActions payload when given', async () => {
    let receivedBody: unknown = null
    server.use(
      http.post('*/api/saves/:id/export-draft', async ({ request }) => {
        receivedBody = await request.json()
        return new HttpResponse('', { headers: { 'content-type': 'application/octet-stream' } })
      }),
    )
    await make().exportDraft(
      'ses-1',
      [],
      false,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      [{ species: 25, action: 'completeTask', taskIndex: 2 }],
      ['markAllPerfect'],
    )
    expect((receivedBody as { arceusResearchActions: unknown }).arceusResearchActions).toEqual({
      targets: [{ species: 25, action: 'completeTask', taskIndex: 2 }],
      markAllPerfect: true,
      markAllComplete: false,
    })
  })

  it('exportDraft appends ?format=zip when format is "zip"', async () => {
    let url = ''
    server.use(
      http.post('*/api/saves/:id/export-draft', ({ request }) => {
        url = request.url
        return new HttpResponse('', { headers: { 'content-type': 'application/octet-stream' } })
      }),
    )
    await make().exportDraft('ses-1', [], false, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'zip')
    expect(url).toMatch(/\/api\/saves\/ses-1\/export-draft\?format=zip$/)
  })
})
