import type { Language } from '../../types/index/index'

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

async function sendRequest(
  baseUrl: string,
  language: Language,
  path: string,
  options: RequestOptions,
) {
  const { timeoutMs, ...fetchOptions } = options
  const timeout = timeoutMs ?? requestTimeoutMs
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
      headers: buildHeaders(language, fetchOptions),
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

function buildHeaders(language: Language, options: RequestInit): HeadersInit {
  if (options.body instanceof FormData) {
    return { 'accept-language': language, ...options.headers }
  }
  // Only declare content-type when we actually send a body. ASP.NET otherwise
  // tries to JSON-parse the empty GET body and 400s with
  // "The input does not contain any JSON tokens".
  if (options.body !== undefined) {
    return {
      'content-type': 'application/json',
      'accept-language': language,
      ...options.headers,
    }
  }
  return { 'accept-language': language, ...options.headers }
}
