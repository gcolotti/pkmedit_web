import { ComboboxOptions } from '@headlessui/react'
import { type UIEvent, useState } from 'react'

import type { Translator } from '../../../core/i18n/i18n'
import type { CatalogEntry } from '../../../core/types/index'
import { CatalogSearchOption } from './CatalogSearchOption'

const INITIAL_VISIBLE_OPTIONS = 80
const VISIBLE_OPTIONS_INCREMENT = 80
const SCROLL_LOAD_THRESHOLD = 96

type Props = {
  getImageUrl?: (id: number) => string | undefined
  isFiltering: boolean
  results: CatalogEntry[]
  t: Translator
}

export function CatalogSearchOptions({
  getImageUrl,
  isFiltering,
  results,
  t,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_OPTIONS)
  const visibleResults = isFiltering ? results : results.slice(0, visibleCount)

  function handleOptionsScroll(event: UIEvent<HTMLDivElement>) {
    if (isFiltering) return
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget
    const nearBottom =
      scrollTop + clientHeight >= scrollHeight - SCROLL_LOAD_THRESHOLD
    if (!nearBottom) return
    setVisibleCount((count) =>
      count >= results.length
        ? count
        : Math.min(count + VISIBLE_OPTIONS_INCREMENT, results.length),
    )
  }

  return (
    <ComboboxOptions
      anchor="bottom start"
      className="z-50 max-h-64 w-[var(--input-width)] overflow-y-auto rounded-md border border-white/10 bg-zinc-900 py-1 shadow-xl outline-none"
      onScroll={handleOptionsScroll}
    >
      {results.length ? (
        visibleResults.map((entry) => (
          <CatalogSearchOption
            key={entry.id}
            entry={entry}
            imageUrl={getImageUrl?.(entry.id)}
            showImage={Boolean(getImageUrl)}
          />
        ))
      ) : (
        <div className="px-3 py-2 text-[0.7rem] font-semibold text-stone-400">
          {t('catalogNoResults')}
        </div>
      )}
    </ComboboxOptions>
  )
}
