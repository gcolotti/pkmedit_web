import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '../../../test/server'
import { requestJson } from '../apiHttp/apiHttp'
import { SaveApi } from './saveApi'

const make = () =>
  new SaveApi((path, opts) => requestJson('http://api.test', 'en', path, opts))

describe('SaveApi', () => {
  it('listSaves fetches /api/saves/files', async () => {
    let url = ''
    server.use(
      http.get('*/api/saves/files', ({ request }) => {
        url = request.url
        return HttpResponse.json([{ path: '/a.sav', name: 'a.sav' }])
      }),
    )
    const api = make()
    const result = await api.listSaves()
    expect(url).toMatch(/\/api\/saves\/files$/)
    expect(result).toEqual([{ path: '/a.sav', name: 'a.sav' }])
  })

  it('openSave POSTs { path } to /api/saves/open', async () => {
    let receivedMethod = ''
    let receivedBody: unknown = null
    server.use(
      http.post('*/api/saves/open', async ({ request }) => {
        receivedMethod = request.method
        receivedBody = await request.json()
        return HttpResponse.json({ sessionId: 's1', summary: {} })
      }),
    )
    const result = await make().openSave('/x.sav')
    expect(receivedMethod).toBe('POST')
    expect(receivedBody).toEqual({ path: '/x.sav' })
    expect(result).toEqual({ sessionId: 's1', summary: {} })
  })

  it('uploadAndOpenSave POSTs a FormData to /api/saves/upload-open', async () => {
    let receivedMethod = ''
    let contentType: string | null = null
    server.use(
      http.post('*/api/saves/upload-open', ({ request }) => {
        receivedMethod = request.method
        contentType = request.headers.get('content-type')
        return HttpResponse.json({ sessionId: 's2', summary: {} })
      }),
    )
    const file = new File(['x'], 'x.sav', { type: 'application/octet-stream' })
    const result = await make().uploadAndOpenSave(file)
    expect(receivedMethod).toBe('POST')
    expect(contentType).toMatch(/^multipart\/form-data/)
    expect(result.sessionId).toBe('s2')
  })

  it('getSummary fetches /api/saves/:id/summary', async () => {
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

  it('getPokedexStatus fetches /api/saves/:id/pokedex', async () => {
    let url = ''
    server.use(
      http.get('*/api/saves/:id/pokedex', ({ request }) => {
        url = request.url
        return HttpResponse.json({})
      }),
    )
    await make().getPokedexStatus('ses-1')
    expect(url).toMatch(/\/api\/saves\/ses-1\/pokedex$/)
  })

  it('getArceusResearchStatus fetches /api/saves/:id/pokedex/arceus-research', async () => {
    let url = ''
    server.use(
      http.get('*/api/saves/:id/pokedex/arceus-research', ({ request }) => {
        url = request.url
        return HttpResponse.json({})
      }),
    )
    await make().getArceusResearchStatus('ses-1')
    expect(url).toMatch(/\/api\/saves\/ses-1\/pokedex\/arceus-research$/)
  })

  it('getArceusResearchSpecies fetches /api/saves/:id/pokedex/arceus-research/:species with encoded lang', async () => {
    let url = ''
    server.use(
      http.get(
        '*/api/saves/:id/pokedex/arceus-research/:species',
        ({ request }) => {
          url = request.url
          return HttpResponse.json({})
        },
      ),
    )
    await make().getArceusResearchSpecies('ses-1', 25, 'es')
    expect(url).toMatch(
      /\/api\/saves\/ses-1\/pokedex\/arceus-research\/25\?lang=es$/,
    )
  })
})
