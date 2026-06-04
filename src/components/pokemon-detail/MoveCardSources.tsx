import type { Translator } from '../../core/i18n/i18n'
import type { SourceUrls } from '../../core/utils/moveParsers'

export function MoveCardSources({
  sourceUrls,
  t,
}: {
  sourceUrls: SourceUrls
  t: Translator
}) {
  if (!sourceUrls.wikidex && !sourceUrls.bulbapedia) return null
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[0.6rem] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
        {t('moveSources')}
      </span>
      {sourceUrls.wikidex && (
        <a
          className="rounded border border-black/10 bg-white/60 px-1.5 py-0.5 text-[0.65rem] font-semibold text-stone-600 transition hover:bg-black/5 dark:border-white/10 dark:bg-white/[0.06] dark:text-stone-300 dark:hover:bg-white/10"
          href={sourceUrls.wikidex}
          rel="noreferrer"
          target="_blank"
        >
          {t('wikidex')}
        </a>
      )}
      {sourceUrls.bulbapedia && (
        <a
          className="rounded border border-black/10 bg-white/60 px-1.5 py-0.5 text-[0.65rem] font-semibold text-stone-600 transition hover:bg-black/5 dark:border-white/10 dark:bg-white/[0.06] dark:text-stone-300 dark:hover:bg-white/10"
          href={sourceUrls.bulbapedia}
          rel="noreferrer"
          target="_blank"
        >
          {t('bulbapedia')}
        </a>
      )}
    </div>
  )
}
