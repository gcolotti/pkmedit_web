import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '../../../test/server'
import { requestJson } from '../apiHttp/apiHttp'
import { PokemonApi } from './pokemonApi'

const make = () =>
  new PokemonApi((path, opts) =>
    requestJson('http://api.test', 'en', path, opts),
  )

describe('PokemonApi', () => {
  it('getParty fetches /api/saves/:id/party', async () => {
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

  it('getBoxes fetches /api/saves/:id/boxes', async () => {
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

  it('getPokemon fetches /api/saves/:id/pokemon/:slotId', async () => {
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

  it('previewPokemonUpdate POSTs the payload to /api/saves/:id/pokemon/:slotId/preview', async () => {
    let receivedMethod = ''
    let receivedBody: unknown = null
    server.use(
      http.post(
        '*/api/saves/:id/pokemon/:slotId/preview',
        async ({ request }) => {
          receivedMethod = request.method
          receivedBody = await request.json()
          return HttpResponse.json({})
        },
      ),
    )
    await make().previewPokemonUpdate('ses-1', 'slot-7', { nickname: 'X' })
    expect(receivedMethod).toBe('POST')
    expect(receivedBody).toEqual({ nickname: 'X' })
  })

  it('checkDraft POSTs { allowIllegalChanges, changes } to /api/saves/:id/legality/check-draft', async () => {
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
    const result = await make().checkDraft('ses-1', [{ slotId: 'a' }], true)
    expect(receivedBody).toEqual({
      allowIllegalChanges: true,
      changes: [{ slotId: 'a' }],
    })
    expect(result).toEqual({ reports: [], violations: [], blocked: false })
  })

  it('getTrainerInfo fetches /api/saves/:id/trainer', async () => {
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
})
