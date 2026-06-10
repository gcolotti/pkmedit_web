import { http, HttpResponse } from 'msw'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { server } from '../../../test/server'
import { requestBlob, requestJson } from './apiHttp'

const baseUrl = 'http://api.test'
const path = '/api/x'
const urlPattern = `*${path}`

beforeEach(() => {
  server.resetHandlers()
})
afterEach(() => {
  server.resetHandlers()
  vi.useRealTimers()
})

describe('requestJson', () => {
  it('returns parsed JSON on a 2xx response', async () => {
    server.use(
      http.get(urlPattern, () => HttpResponse.json({ value: 42 })),
    )
    await expect(requestJson(baseUrl, 'en', path)).resolves.toEqual({ value: 42 })
  })

  it('returns null on 2xx with an empty body', async () => {
    server.use(
      http.get(urlPattern, () => new HttpResponse(null, { status: 204 })),
    )
    await expect(requestJson(baseUrl, 'en', path)).resolves.toBeNull()
  })

  it('throws the server message when the body is JSON { message }', async () => {
    server.use(
      http.get(urlPattern, () =>
        HttpResponse.json({ message: 'bad input' }, { status: 400 }),
      ),
    )
    await expect(requestJson(baseUrl, 'en', path)).rejects.toThrow('bad input')
  })

  it('throws status text when the body is non-JSON text', async () => {
    server.use(
      http.get(urlPattern, () => new HttpResponse('not-json-at-all', { status: 500 })),
    )
    await expect(requestJson(baseUrl, 'en', path)).rejects.toThrow(/not-json-at-all/)
  })

  it('throws the status text when the body is empty and non-OK', async () => {
    server.use(
      http.get(urlPattern, () => new HttpResponse(null, { status: 503, statusText: 'Service Unavailable' })),
    )
    await expect(requestJson(baseUrl, 'en', path)).rejects.toThrow('503')
  })

  it('sends accept-language header from the language argument', async () => {
    let receivedHeader: string | null = null
    server.use(
      http.get(urlPattern, ({ request }) => {
        receivedHeader = request.headers.get('accept-language')
        return HttpResponse.json({})
      }),
    )
    await requestJson(baseUrl, 'es', path)
    expect(receivedHeader).toBe('es')
  })

  it('sends content-type: application/json when a body is provided', async () => {
    let receivedContentType: string | null = null
    server.use(
      http.post(urlPattern, ({ request }) => {
        receivedContentType = request.headers.get('content-type')
        return HttpResponse.json({})
      }),
    )
    await requestJson(baseUrl, 'en', path, {
      method: 'POST',
      body: JSON.stringify({ a: 1 }),
    })
    expect(receivedContentType).toBe('application/json')
  })

  it('does NOT send content-type when no body is provided', async () => {
    let receivedContentType: string | null = null
    server.use(
      http.get(urlPattern, ({ request }) => {
        receivedContentType = request.headers.get('content-type')
        return HttpResponse.json({})
      }),
    )
    await requestJson(baseUrl, 'en', path)
    expect(receivedContentType).toBeNull()
  })

  it('does NOT send application/json content-type for FormData bodies (browser sets the multipart boundary)', async () => {
    let receivedContentType: string | null = 'not-cleared'
    server.use(
      http.post(urlPattern, ({ request }) => {
        receivedContentType = request.headers.get('content-type')
        return HttpResponse.json({})
      }),
    )
    const form = new FormData()
    form.append('file', new Blob(['x']), 'x.sav')
    await requestJson(baseUrl, 'en', path, { method: 'POST', body: form })
    // The runtime auto-sets multipart/form-data; the assertion is that
    // buildHeaders did not declare application/json for a FormData body.
    expect(receivedContentType).not.toBe('application/json')
    expect(receivedContentType).toMatch(/^multipart\/form-data/)
  })

  it('still sends accept-language when no body is provided', async () => {
    let receivedLang: string | null = null
    server.use(
      http.get(urlPattern, ({ request }) => {
        receivedLang = request.headers.get('accept-language')
        return HttpResponse.json({})
      }),
    )
    await requestJson(baseUrl, 'ja', path)
    expect(receivedLang).toBe('ja')
  })

  it('trims a trailing slash from the base URL', async () => {
    let url = ''
    server.use(
      http.get(urlPattern, ({ request }) => {
        url = request.url
        return HttpResponse.json({})
      }),
    )
    await requestJson(`${baseUrl}/`, 'en', path)
    expect(url).toBe(`${baseUrl}${path}`)
  })

  it('rejects with a cancellation error when the external signal is already aborted', async () => {
    const controller = new AbortController()
    controller.abort()
    server.use(http.get(urlPattern, () => HttpResponse.json({})))
    await expect(
      requestJson(baseUrl, 'en', path, { signal: controller.signal }),
    ).rejects.toThrow('API request was cancelled')
  })

  it('rejects with a cancellation error when the external signal aborts mid-flight', async () => {
    const controller = new AbortController()
    server.use(
      http.get(urlPattern, () => {
        controller.abort()
        return HttpResponse.json({})
      }),
    )
    await expect(
      requestJson(baseUrl, 'en', path, { signal: controller.signal }),
    ).rejects.toThrow('API request was cancelled')
  })

  it('rejects with a timeout error when the request exceeds the timeout', async () => {
    vi.useFakeTimers()
    server.use(
      http.get(urlPattern, async () => {
        // never resolves within the 60s timeout
        await new Promise((r) => setTimeout(r, 70_000))
        return HttpResponse.json({})
      }),
    )
    const promise = requestJson(baseUrl, 'en', path)
    // attach a catch so the unhandled rejection doesn't bubble
    promise.catch(() => undefined)
    await vi.advanceTimersByTimeAsync(60_000)
    await expect(promise).rejects.toThrow('API request timed out')
  })

  it('rejects with a "could not reach" error when fetch throws a generic network error', async () => {
    server.use(
      http.get(urlPattern, () => HttpResponse.error()),
    )
    await expect(requestJson(baseUrl, 'en', path)).rejects.toThrow(/Could not reach the API/)
  })
})

describe('requestBlob', () => {
  it('returns a Blob on a 2xx response', async () => {
    server.use(
      http.get(urlPattern, () =>
        new HttpResponse('hello', {
          headers: { 'content-type': 'application/octet-stream' },
        }),
      ),
    )
    const blob = await requestBlob(baseUrl, 'en', path)
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.size).toBe(5)
  })

  it('throws the server message when the body is JSON { message }', async () => {
    server.use(
      http.get(urlPattern, () =>
        HttpResponse.json({ message: 'forbidden' }, { status: 403 }),
      ),
    )
    await expect(requestBlob(baseUrl, 'en', path)).rejects.toThrow('forbidden')
  })

  it('throws status text when the body is non-JSON text', async () => {
    server.use(
      http.get(urlPattern, () => new HttpResponse('nope', { status: 500 })),
    )
    await expect(requestBlob(baseUrl, 'en', path)).rejects.toThrow(/nope/)
  })

  it('throws the status text when the body is empty and non-OK', async () => {
    server.use(
      http.get(urlPattern, () => new HttpResponse(null, { status: 502, statusText: 'Bad Gateway' })),
    )
    await expect(requestBlob(baseUrl, 'en', path)).rejects.toThrow('502')
  })

  it('rejects with a cancellation error when the external signal is already aborted', async () => {
    const controller = new AbortController()
    controller.abort()
    server.use(http.get(urlPattern, () => HttpResponse.json({})))
    await expect(
      requestBlob(baseUrl, 'en', path, { signal: controller.signal }),
    ).rejects.toThrow('API request was cancelled')
  })
})
