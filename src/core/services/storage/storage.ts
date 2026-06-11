import type { Language, Theme } from '../../types/index/index'

const languageCookie = 'pkmedit_language'
const themeKey = 'pkmedit_theme'
const allowIllegalChangesKey = 'pkmedit_allow_illegal_changes'
const apiBaseKey = 'pkmedit_api_base'
const clientInstanceIdKey = 'pkmedit_client_instance_id'
const apiRegistrationPrefix = 'pkmedit_api_registration:'
const defaultApiBase =
  import.meta.env.VITE_API_BASE?.trim() || 'http://localhost:8080'

export type ApiRegistration = {
  apiKey: string
  appId: string
  clientInstanceId: string
  clientKind: string
  clientName: string
  expiresAt: string
}

export function readLanguage(): Language {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${languageCookie}=([^;]*)`),
  )
  const value = decodeURIComponent(match?.[1] ?? '')
  return value === 'es' || value === 'ja' || value === 'en' ? value : 'en'
}

export function writeLanguage(language: Language) {
  document.cookie = `${languageCookie}=${encodeURIComponent(language)}; max-age=31536000; path=/; samesite=lax`
}

export function readTheme(): Theme {
  const stored = localStorage.getItem(themeKey)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function writeTheme(theme: Theme) {
  localStorage.setItem(themeKey, theme)
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function readAllowIllegalChanges() {
  return localStorage.getItem(allowIllegalChangesKey) !== 'false'
}

export function writeAllowIllegalChanges(value: boolean) {
  localStorage.setItem(allowIllegalChangesKey, String(value))
}

export function readApiBase() {
  const urlApi = sanitizeApiBase(
    new URLSearchParams(window.location.search).get('api'),
  )
  if (urlApi) {
    localStorage.setItem(apiBaseKey, urlApi)
    return urlApi
  }

  return sanitizeApiBase(localStorage.getItem(apiBaseKey)) ?? defaultApiBase
}

// The override reaches fetch() as-is, so anything that is not an absolute
// http(s) URL is dropped instead of persisted.
function sanitizeApiBase(value: string | null) {
  const trimmed = value?.trim()
  if (!trimmed) return null
  try {
    const url = new URL(trimmed)
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? trimmed
      : null
  } catch {
    return null
  }
}

export function writeApiBase(value: string) {
  localStorage.setItem(apiBaseKey, value)
}

export function readClientInstanceId() {
  const stored = localStorage.getItem(clientInstanceIdKey)?.trim()
  if (stored) return stored

  const generated = crypto.randomUUID?.() ?? `web-${Date.now().toString(36)}`
  localStorage.setItem(clientInstanceIdKey, generated)
  return generated
}

export function readApiRegistration(apiBase: string): ApiRegistration | null {
  const raw = localStorage.getItem(apiRegistrationKey(apiBase))
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<ApiRegistration>
    if (
      !parsed.apiKey ||
      !parsed.appId ||
      !parsed.clientInstanceId ||
      !parsed.expiresAt
    ) {
      return null
    }
    return {
      apiKey: parsed.apiKey,
      appId: parsed.appId,
      clientInstanceId: parsed.clientInstanceId,
      clientKind: parsed.clientKind ?? 'web',
      clientName: parsed.clientName ?? 'pkmedit_web',
      expiresAt: parsed.expiresAt,
    }
  } catch {
    return null
  }
}

export function writeApiRegistration(
  apiBase: string,
  registration: ApiRegistration,
) {
  localStorage.setItem(apiRegistrationKey(apiBase), JSON.stringify(registration))
  window.dispatchEvent(new Event('pkmedit-api-registration-changed'))
}

export function clearApiRegistration(apiBase: string) {
  localStorage.removeItem(apiRegistrationKey(apiBase))
  window.dispatchEvent(new Event('pkmedit-api-registration-changed'))
}

function apiRegistrationKey(apiBase: string) {
  return `${apiRegistrationPrefix}${encodeURIComponent(apiBase)}`
}
