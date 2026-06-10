import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  readAllowIllegalChanges,
  readApiBase,
  readLanguage,
  readTheme,
  writeAllowIllegalChanges,
  writeApiBase,
  writeLanguage,
  writeTheme,
} from './storage'

const clearStorage = () => {
  localStorage.clear()
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0]?.trim()
    if (name) {
      document.cookie = `${name}=; max-age=0; path=/`
    }
  })
}

describe('storage', () => {
  beforeEach(() => {
    clearStorage()
    document.documentElement.classList.remove('dark')
  })
  afterEach(() => {
    clearStorage()
    document.documentElement.classList.remove('dark')
  })

  describe('language', () => {
    it('defaults to "en" when no cookie is set', () => {
      expect(readLanguage()).toBe('en')
    })

    it('returns "es" for a valid Spanish cookie', () => {
      document.cookie = 'pkmedit_language=es; path=/'
      expect(readLanguage()).toBe('es')
    })

    it('returns "ja" for a valid Japanese cookie', () => {
      document.cookie = 'pkmedit_language=ja; path=/'
      expect(readLanguage()).toBe('ja')
    })

    it('returns "en" for an invalid cookie value', () => {
      document.cookie = 'pkmedit_language=xx; path=/'
      expect(readLanguage()).toBe('en')
    })

    it('writes the language back to a cookie', () => {
      writeLanguage('es')
      expect(document.cookie).toMatch(/pkmedit_language=es/)
      expect(readLanguage()).toBe('es')
    })

    it('encodes the cookie value', () => {
      document.cookie = `pkmedit_language=${encodeURIComponent('ja')}; path=/`
      expect(readLanguage()).toBe('ja')
    })
  })

  describe('theme', () => {
    it('returns "light" when no preference and system is light', () => {
      window.matchMedia = (query) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }) as MediaQueryList
      expect(readTheme()).toBe('light')
    })

    it('returns "dark" when no preference and system is dark', () => {
      window.matchMedia = (query) =>
        ({
          matches: true,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }) as MediaQueryList
      expect(readTheme()).toBe('dark')
    })

    it('returns the stored value when valid', () => {
      localStorage.setItem('pkmedit_theme', 'dark')
      expect(readTheme()).toBe('dark')
    })

    it('falls back to system preference when stored value is invalid', () => {
      localStorage.setItem('pkmedit_theme', 'sepia')
      window.matchMedia = (query) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }) as MediaQueryList
      expect(readTheme()).toBe('light')
    })

    it('writeTheme persists to localStorage and toggles html.dark', () => {
      writeTheme('dark')
      expect(localStorage.getItem('pkmedit_theme')).toBe('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      writeTheme('light')
      expect(localStorage.getItem('pkmedit_theme')).toBe('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  describe('allowIllegalChanges', () => {
    it('defaults to true when nothing is stored', () => {
      expect(readAllowIllegalChanges()).toBe(true)
    })

    it('returns false when "false" is stored', () => {
      localStorage.setItem('pkmedit_allow_illegal_changes', 'false')
      expect(readAllowIllegalChanges()).toBe(false)
    })

    it('returns true for any other stored value', () => {
      localStorage.setItem('pkmedit_allow_illegal_changes', 'true')
      expect(readAllowIllegalChanges()).toBe(true)
    })

    it('writeAllowIllegalChanges persists the boolean', () => {
      writeAllowIllegalChanges(false)
      expect(localStorage.getItem('pkmedit_allow_illegal_changes')).toBe(
        'false',
      )
      writeAllowIllegalChanges(true)
      expect(localStorage.getItem('pkmedit_allow_illegal_changes')).toBe('true')
    })
  })

  describe('apiBase', () => {
    it('returns the default when nothing is stored', () => {
      expect(readApiBase()).toBe('http://localhost:8080')
    })

    it('returns the stored value', () => {
      localStorage.setItem('pkmedit_api_base', 'https://api.example.com')
      expect(readApiBase()).toBe('https://api.example.com')
    })

    it('persists api base via writeApiBase', () => {
      writeApiBase('https://x.test')
      expect(localStorage.getItem('pkmedit_api_base')).toBe('https://x.test')
    })

    it('ignores an invalid stored api base and falls back to the default', () => {
      localStorage.setItem('pkmedit_api_base', 'not a url')
      expect(readApiBase()).toBe('http://localhost:8080')
    })

    it('ignores a stored api base with a non-http scheme', () => {
      localStorage.setItem('pkmedit_api_base', 'javascript:alert(1)')
      expect(readApiBase()).toBe('http://localhost:8080')
    })

    it('ignores a ?api= param that is not an http(s) URL and does not persist it', () => {
      const originalLocation = window.location
      delete (window as unknown as { location?: unknown }).location
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: {
          ...originalLocation,
          search: '?api=javascript%3Aalert(1)',
        },
      })
      try {
        expect(readApiBase()).toBe('http://localhost:8080')
        expect(localStorage.getItem('pkmedit_api_base')).toBeNull()
      } finally {
        Object.defineProperty(window, 'location', {
          configurable: true,
          value: originalLocation,
        })
      }
    })

    it('uses a ?api= URL param when present and persists it', () => {
      // simulate ?api=... by directly invoking the URL parameter branch via a stubbed location
      const originalLocation = window.location
      delete (window as unknown as { location?: unknown }).location
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: {
          ...originalLocation,
          search: '?api=https%3A%2F%2Fparam.test',
        },
      })
      try {
        const result = readApiBase()
        expect(result).toBe('https://param.test')
        expect(localStorage.getItem('pkmedit_api_base')).toBe(
          'https://param.test',
        )
      } finally {
        Object.defineProperty(window, 'location', {
          configurable: true,
          value: originalLocation,
        })
      }
    })
  })
})
