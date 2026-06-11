import type { Language } from '../../types/index/index'
import {
  ensureApiRegistration,
  rotateApiRegistration as rotateRegistration,
} from '../apiRegistration/apiRegistration'
import { clearApiRegistration } from '../storage/storage'

export type RequestOptions = RequestInit & {
  // Overrides the default 60s timeout for known-slow requests (big exports).
  timeoutMs?: number
}
export type RequestJsonFn = <T>(
  path: string,
  options?: RequestOptions,
) => Promise<T>
export type RequestBlobFn = (
  path: string,
  options?: RequestOptions,
) => Promise<Blob>

const requestTimeoutMs = 60_000

export async function requestJson<T>(
  baseUrl: string,
  language: Language,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await sendRequest(baseUrl, language, path, options)
  const text = await response.text()
  const body = text ? safeJson(text) : null
  const message = isErrorBody(body) ? body.message : undefined
  if (!response.ok)
    throw new Error(message ?? `${response.status} ${response.statusText}`)
  return body as T
}

export async function requestBlob(
  baseUrl: string,
  language: Language,
  path: string,
  options: RequestOptions = {},
): Promise<Blob> {
  const response = await sendRequest(baseUrl, language, path, options)
  if (!response.ok) {
    const text = await response.text()
    const body = text ? safeJson(text) : null
    const message = isErrorBody(body) ? body.message : undefined
    throw new Error(message ?? `${response.status} ${response.statusText}`)
  }
  return response.blob()
}

export async function rotateApiRegistration(baseUrl: string) {
  return rotateRegistration(baseUrl, requestTimeoutMs)
}

async function sendRequest(
  baseUrl: string,
  language: Language,
  path: string,
  options: RequestOptions,
) {
  const { timeoutMs, ...fetchOptions } = options
  const timeout = timeoutMs ?? requestTimeoutMs
  const registration = await ensureApiRegistration(baseUrl, timeout)
  let response = await sendFetch(
    baseUrl,
    language,
    path,
    fetchOptions,
    timeout,
    registration.apiKey,
  )

  if (response.status === 401 && !isRegisterPath(path)) {
    clearApiRegistration(baseUrl)
    const refreshed = await ensureApiRegistration(baseUrl, timeout, true)
    response = await sendFetch(
      baseUrl,
      language,
      path,
      fetchOptions,
      timeout,
      refreshed.apiKey,
    )
  }

  return response
}

async function sendFetch(
  baseUrl: string,
  language: Language,
  path: string,
  fetchOptions: RequestInit,
  timeout: number,
  apiKey?: string,
) {
  const base = baseUrl.replace(/\/$/, '')
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  const externalSignal = fetchOptions.signal
  const abortFromExternalSignal = () => controller.abort()

  if (externalSignal?.aborted) controller.abort()
  else
    externalSignal?.addEventListener('abort', abortFromExternalSignal, {
      once: true,
    })

  try {
    return await fetch(`${base}${path}`, {
      ...fetchOptions,
      signal: controller.signal,
      headers: buildHeaders(language, fetchOptions, apiKey),
    })
  } catch {
    if (controller.signal.aborted && !externalSignal?.aborted) {
      throw new Error(`API request timed out after ${timeout / 1000} seconds.`)
    }
    if (externalSignal?.aborted) throw new Error('API request was cancelled.')
    throw new Error(`Could not reach the API at ${base}.`)
  } finally {
    clearTimeout(timeoutId)
    externalSignal?.removeEventListener('abort', abortFromExternalSignal)
  }
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

function isErrorBody(value: unknown): value is { message?: string } {
  return typeof value === 'object' && value !== null && 'message' in value
}

function isRegisterPath(path: string) {
  return path === '/api/apps/register'
}

function buildHeaders(
  language: Language,
  options: RequestInit,
  apiKey?: string,
): HeadersInit {
  const headers = new Headers(options.headers)
  headers.set('accept-language', language)
  if (apiKey) headers.set('X-Api-Key', apiKey)

  if (options.body instanceof FormData) {
    return headers
  }
  // Only declare content-type when we actually send a body. ASP.NET otherwise
  // tries to JSON-parse the empty GET body and 400s with
  // "The input does not contain any JSON tokens".
  if (options.body !== undefined && !headers.has('content-type'))
    headers.set('content-type', 'application/json')
  return headers
}
