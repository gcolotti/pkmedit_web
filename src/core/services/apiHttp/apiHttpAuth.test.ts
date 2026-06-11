import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { server } from '../../../test/server'
import { requestJson } from './apiHttp'

describe('apiHttp auth registration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('registers the web client and sends X-Api-Key', async () => {
    let apiKey = ''
    server.use(
      http.post('*/api/apps/register', () =>
        HttpResponse.json({
          appId: 'web-a',
          apiKey: 'key-1',
          clientInstanceId: 'browser-a',
          clientKind: 'web',
          clientName: 'pkmedit_web',
          expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
        }),
      ),
      http.get('*/api/saves/files', ({ request }) => {
        apiKey = request.headers.get('X-Api-Key') ?? ''
        return HttpResponse.json([])
      }),
    )

    await requestJson('http://api.test', 'en', '/api/saves/files')

    expect(apiKey).toBe('key-1')
  })

  it('re-registers and retries once when the API key is rejected', async () => {
    let registrations = 0
    const seenKeys: string[] = []
    server.use(
      http.post('*/api/apps/register', () => {
        registrations += 1
        return HttpResponse.json({
          appId: 'web-a',
          apiKey: `key-${registrations}`,
          clientInstanceId: 'browser-a',
          clientKind: 'web',
          clientName: 'pkmedit_web',
          expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
        })
      }),
      http.get('*/api/saves/files', ({ request }) => {
        const apiKey = request.headers.get('X-Api-Key') ?? ''
        seenKeys.push(apiKey)
        if (apiKey === 'key-1') {
          return HttpResponse.json(
            { code: 'InvalidApiKey', message: 'API key is invalid.' },
            { status: 401 },
          )
        }
        return HttpResponse.json([])
      }),
    )

    await requestJson('http://api.test', 'en', '/api/saves/files')

    expect(registrations).toBe(2)
    expect(seenKeys).toEqual(['key-1', 'key-2'])
  })
})
