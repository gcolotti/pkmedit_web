import type { Translator } from '../../../core/i18n/i18n/i18n'

export function PokemonEditorEmpty({ t }: { t: Translator }) {
  return (
    <div className="mt-5 rounded-md border border-dashed border-black/15 p-4 text-sm text-stone-500 dark:border-white/15 dark:text-stone-400">
      {t('noSlot')}
    </div>
  )
}
