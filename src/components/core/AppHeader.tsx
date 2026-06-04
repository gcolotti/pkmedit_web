import { Database, Languages, Moon, Sun } from 'lucide-react'

import type { Translator } from '../../core/i18n/i18n'
import { languages } from '../../core/i18n/i18n'
import type { Language, Theme } from '../../core/types/index'

export function AppHeader({
  apiBase,
  language,
  onApiBaseChange,
  onLanguageChange,
  onThemeChange,
  t,
  theme,
}: {
  apiBase: string
  language: Language
  onApiBaseChange: (value: string) => void
  onLanguageChange: (value: Language) => void
  onThemeChange: (value: Theme) => void
  t: Translator
  theme: Theme
}) {
  return (
    <header className="border-b border-black/10 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-ink/55">
      <div className="mx-auto flex max-w-shell flex-col gap-4 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-md bg-ink text-white dark:bg-stone-100 dark:text-ink">
            <Database size={22} />
          </div>
          <h1 className="text-2xl font-black tracking-normal">Pkmedit</h1>
        </div>
        <div className="grid gap-2 md:grid-cols-[minmax(320px,1fr)_minmax(150px,auto)_auto] md:items-center">
          <label className="grid grid-cols-[auto_minmax(220px,1fr)] items-center gap-2">
            <span className="label text-[0.65rem]">{t('api')}</span>
            <input
              className="field"
              spellCheck={false}
              value={apiBase}
              onChange={(event) => onApiBaseChange(event.target.value)}
            />
          </label>
          <label>
            <span className="sr-only">{t('language')}</span>
            <div className="relative">
              <Languages
                className="pointer-events-none absolute left-3 top-2.5 text-stone-500"
                size={16}
              />
              <select
                aria-label={t('language')}
                className="field min-w-40 pl-9"
                value={language}
                onChange={(event) =>
                  onLanguageChange(event.target.value as Language)
                }
              >
                {languages.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.native}
                  </option>
                ))}
              </select>
            </div>
          </label>
          <div
            aria-label={t('theme')}
            className="surface-muted flex h-9 items-center gap-1 rounded-md p-0.5"
            role="group"
          >
            <button
              aria-label={t('themeLight')}
              aria-pressed={theme === 'light'}
              className={`grid h-8 w-8 place-items-center rounded-md border transition ${theme === 'light' ? 'border-lagoon bg-lagoon/15 text-lagoon' : 'border-transparent text-stone-500 hover:bg-black/5 dark:text-stone-400 dark:hover:bg-white/5'}`}
              type="button"
              onClick={() => onThemeChange('light')}
            >
              <Sun size={16} />
            </button>
            <button
              aria-label={t('themeDark')}
              aria-pressed={theme === 'dark'}
              className={`grid h-8 w-8 place-items-center rounded-md border transition ${theme === 'dark' ? 'border-lagoon bg-lagoon/15 text-lagoon' : 'border-transparent text-stone-500 hover:bg-black/5 dark:text-stone-400 dark:hover:bg-white/5'}`}
              type="button"
              onClick={() => onThemeChange('dark')}
            >
              <Moon size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
