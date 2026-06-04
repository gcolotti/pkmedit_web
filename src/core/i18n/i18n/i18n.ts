import type { Language } from '../../types/index/index'
import { en } from '../locales/en/en'
import { es } from '../locales/es/es'
import { ja } from '../locales/ja/ja'

export const languages: Array<{
  code: Language
  label: string
  native: string
}> = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'es', label: 'Spanish', native: 'Espa\u00f1ol' },
  { code: 'ja', label: 'Japanese', native: '\u65e5\u672c\u8a9e' },
]

const dictionary = { en, es, ja } satisfies Record<
  Language,
  Record<keyof typeof en, string>
>

export type I18nKey = keyof typeof en

export type Translator = ReturnType<typeof createTranslator>

export function createTranslator(language: Language) {
  return (key: I18nKey, params: Record<string, string | number> = {}) => {
    const template = dictionary[language][key] ?? dictionary.en[key] ?? key
    return Object.entries(params).reduce(
      (value, [paramKey, paramValue]) =>
        value.replaceAll(`{${paramKey}}`, String(paramValue)),
      template,
    )
  }
}

export type LocalizedText = {
  en: string
  es: string | null
  jp: string | null
}

export function localizedText(
  obj: LocalizedText | null | undefined,
  language: Language,
): string | null {
  if (!obj) return null
  if (language === 'ja') return obj.en
  return obj[language] ?? null
}
