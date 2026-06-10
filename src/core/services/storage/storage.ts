import type { Language, Theme } from '../../types/index/index'

const languageCookie = 'pkmedit_language'
const themeKey = 'pkmedit_theme'
const allowIllegalChangesKey = 'pkmedit_allow_illegal_changes'
const apiBaseKey = 'pkmedit_api_base'
const defaultApiBase =
  import.meta.env.VITE_API_BASE?.trim() || 'http://localhost:8080'

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
