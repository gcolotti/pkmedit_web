import { describe, expect, it } from 'vitest'

import { createTranslator, languages, localizedText } from './i18n'

describe('createTranslator', () => {
  it('returns the localized string for the given language', () => {
    const t = createTranslator('en')
    expect(t('cancel')).toBe('Cancel')
  })

  it('substitutes named placeholders', () => {
    const t = createTranslator('en')
    expect(t('draftChangesCount', { count: 5 })).toBe('5 draft changes')
  })

  it('replaces the same placeholder multiple times in one string', () => {
    // Sanity check the reduce loop walks the full string and is not confused
    // by repeated keys (most strings only have one, but the loop is generic).
    // The translator is typed to known keys; we cast to test the raw template
    // substitution logic on a synthetic string.
    const t = createTranslator('en') as unknown as (
      template: string,
      params: Record<string, string | number>,
    ) => string
    const out = t('{n} and {n}', { n: 7 })
    expect(out).toBe('7 and 7')
  })

  it('falls back to the key itself when the value is missing in both en and the requested language', () => {
    // The `satisfies` constraint at module load prevents any dictionary drift
    // at compile time, so the runtime fallback to the key name is only
    // reachable for keys that exist in `en` but were never registered in the
    // other dictionaries. We approximate that path by asking for a missing
    // key — TypeScript can't see through dynamic access.
    const dict = createTranslator as unknown as (lang: string) => unknown
    expect(() => dict('xx')).not.toThrow()
    const t = createTranslator('en')
    // Force the runtime fallback by reading a non-existent key.
    expect(t('__missing_key__' as never)).toBe('__missing_key__')
  })
})

describe('languages', () => {
  it('exposes en, es, ja with their native labels', () => {
    expect(languages.map((l) => l.code)).toEqual(['en', 'es', 'ja'])
    expect(languages.find((l) => l.code === 'ja')?.native).toBe('日本語')
  })
})

describe('localizedText', () => {
  it('returns null for null', () => {
    expect(localizedText(null, 'en')).toBeNull()
  })

  it('returns null for undefined', () => {
    expect(localizedText(undefined, 'en')).toBeNull()
  })

  it('returns the en value for language=en', () => {
    expect(localizedText({ en: 'A', es: 'B', jp: null }, 'en')).toBe('A')
  })

  it('returns the es value for language=es', () => {
    expect(localizedText({ en: 'A', es: 'B', jp: null }, 'es')).toBe('B')
  })

  it('returns the en value for language=ja (ja is not stored separately)', () => {
    expect(localizedText({ en: 'A', es: 'B', jp: null }, 'ja')).toBe('A')
  })

  it('returns null when the requested language is missing and so is en', () => {
    // LocalizedText enforces en as `string`, but the runtime function also
    // tolerates a null en — verify the guard with a cast.
    expect(
      localizedText(
        { en: null, es: null, jp: null } as unknown as Parameters<
          typeof localizedText
        >[0],
        'en',
      ),
    ).toBeNull()
  })

  it('returns null when the requested language key is absent', () => {
    expect(localizedText({ en: 'A' } as never, 'es')).toBeNull()
  })
})
