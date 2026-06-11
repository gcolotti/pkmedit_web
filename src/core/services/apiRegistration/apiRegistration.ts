import {
  type ApiRegistration,
  clearApiRegistration,
  readApiRegistration,
  readClientInstanceId,
  writeApiRegistration,
} from '../storage/storage'

const registrationSkewMs = 60_000
const registrationPromises = new Map<string, Promise<ApiRegistration>>()

export async function rotateApiRegistration(baseUrl: string, timeoutMs: number) {
  clearApiRegistration(baseUrl)
  return ensureApiRegistration(baseUrl, timeoutMs, true)
}

export async function ensureApiRegistration(
  baseUrl: string,
  timeoutMs: number,
  force = false,
) {
  const current = readApiRegistration(baseUrl)
  if (!force && current && !isExpired(current.expiresAt)) return current

  const pending = registrationPromises.get(baseUrl)
  if (pending && !force) return pending

  const promise = registerClientApp(baseUrl, timeoutMs)
  registrationPromises.set(baseUrl, promise)
  try {
    return await promise
  } finally {
    if (registrationPromises.get(baseUrl) === promise)
      registrationPromises.delete(baseUrl)
  }
}

async function registerClientApp(baseUrl: string, timeoutMs: number) {
  const clientInstanceId = readClientInstanceId()
  const base = baseUrl.replace(/\/$/, '')
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`${base}/api/apps/register`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        clientKind: 'web',
        clientInstanceId,
        clientName: 'pkmedit_web',
      }),
    })
    const text = await response.text()
    const body = text ? safeJson(text) : null
    if (!response.ok) {
      const message = isErrorBody(body) ? body.message : undefined
      throw new Error(message ?? `${response.status} ${response.statusText}`)
    }

    const registration = body as ApiRegistration
    writeApiRegistration(baseUrl, registration)
    return registration
  } catch {
    if (controller.signal.aborted) {
      throw new Error(
        `API registration timed out after ${timeoutMs / 1000} seconds.`,
      )
    }
    throw new Error(`Could not register this client with the API at ${base}.`)
  } finally {
    clearTimeout(timeoutId)
  }
}

function isExpired(expiresAt: string) {
  const expires = Date.parse(expiresAt)
  return !Number.isFinite(expires) || expires - Date.now() <= registrationSkewMs
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
