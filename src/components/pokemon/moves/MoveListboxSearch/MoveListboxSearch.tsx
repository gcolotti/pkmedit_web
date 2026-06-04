import { useEffect, useRef } from 'react'

import type { Translator } from '../../../../core/i18n/i18n/i18n'

export function MoveListboxSearch({
  query,
  t,
  onQueryChange,
}: {
  query: string
  t: Translator
  onQueryChange: (value: string) => void
}) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <div className="sticky top-0 z-10 bg-zinc-900 px-2 pb-1 pt-0.5">
      <input
        ref={ref}
        aria-label={t('searchMovePlaceholder')}
        className="w-full rounded border border-white/10 bg-zinc-800 px-2 py-1 text-sm outline-none placeholder:text-white/30 focus:border-white/30"
        placeholder={t('searchMovePlaceholder')}
        type="text"
        value={query}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onChange={(e) => onQueryChange(e.target.value)}
      />
    </div>
  )
}
