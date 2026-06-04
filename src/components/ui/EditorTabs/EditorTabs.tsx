import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { EditorTab } from '../../../core/types/index/index'

const tabs: EditorTab[] = [
  'main',
  'met',
  'stats',
  'moves',
  'cosmetic',
  'otMisc',
]

export function EditorTabs({
  activeTab,
  onChange,
  t,
}: {
  activeTab: EditorTab
  onChange: (tab: EditorTab) => void
  t: Translator
}) {
  return (
    <div
      aria-label={t('editorTabs')}
      className="mt-4 grid grid-cols-3 gap-1"
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          aria-selected={activeTab === tab}
          className={`rounded-md border px-2 py-2 text-sm font-bold transition ${
            activeTab === tab
              ? 'border-lagoon bg-lagoon/15 text-lagoon'
              : 'border-black/10 bg-white/60 dark:border-white/10 dark:bg-white/5'
          }`}
          role="tab"
          type="button"
          onClick={() => onChange(tab)}
        >
          {t(tab)}
        </button>
      ))}
    </div>
  )
}
