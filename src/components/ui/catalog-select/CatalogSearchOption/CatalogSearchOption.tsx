import { ComboboxOption } from '@headlessui/react'

import type { CatalogEntry } from '../../../../core/types/index/index'

export function CatalogSearchOption({
  entry,
  imageUrl,
  showImage,
}: {
  entry: CatalogEntry
  imageUrl?: string
  showImage: boolean
}) {
  return (
    <ComboboxOption
      className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-[0.7rem] text-stone-100 data-[focus]:bg-white/10 data-[selected]:text-lagoon"
      value={entry}
    >
      {showImage ? (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          {imageUrl ? (
            <img
              alt=""
              aria-hidden="true"
              className="h-full w-full object-contain"
              decoding="async"
              loading="lazy"
              src={imageUrl}
            />
          ) : null}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 truncate">{entry.name}</span>
      <span className="shrink-0 text-[0.6rem] font-bold text-stone-400">
        #{entry.id}
      </span>
    </ComboboxOption>
  )
}
