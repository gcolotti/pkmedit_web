import type { Translator } from '../../../core/i18n/i18n/i18n'

export function MoveDetailEmpty({ t }: { t: Translator }) {
  return (
    <div className="flex h-full min-h-[12rem] items-center justify-center">
      <div className="text-center">
        <div className="text-base font-semibold text-stone-600 dark:text-stone-300">
          {t('moveDetails')}
        </div>
        <div className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          {t('moveDetailsHint')}
        </div>
      </div>
    </div>
  )
}
