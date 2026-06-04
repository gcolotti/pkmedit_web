import { ComboboxInput } from '@headlessui/react'
import { X } from 'lucide-react'

import type { Translator } from '../../../../core/i18n/i18n/i18n'

type Props = {
  canClear: boolean
  emptyLabel?: string
  fieldClassName: string
  id: string
  inputText: string
  selectedImageUrl?: string | null
  t: Translator
  onClear: () => void
  onFocus: () => void
  onInputChange: (value: string) => void
}

export function CatalogSearchComboboxInput({
  canClear,
  emptyLabel,
  fieldClassName,
  id,
  inputText,
  onClear,
  onFocus,
  onInputChange,
  selectedImageUrl,
  t,
}: Props) {
  return (
    <div className="relative">
      {selectedImageUrl ? (
        <span className="pointer-events-none absolute left-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center">
          <img
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain"
            decoding="async"
            loading="lazy"
            src={selectedImageUrl}
          />
        </span>
      ) : null}
      <ComboboxInput
        id={id}
        className={`field${fieldClassName} ${
          selectedImageUrl ? 'pl-9' : ''
        } ${canClear ? 'pr-9' : ''}`}
        placeholder={emptyLabel ?? t('blank')}
        value={inputText}
        onChange={(event) => onInputChange(event.currentTarget.value)}
        onFocus={onFocus}
      />
      {canClear ? (
        <button
          aria-label={t('clearSelection')}
          className="absolute right-1 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded text-stone-500 transition hover:bg-black/10 hover:text-rose-500 dark:text-stone-300 dark:hover:bg-white/10"
          type="button"
          onClick={onClear}
          onMouseDown={(event) => event.preventDefault()}
        >
          <X size={15} />
        </button>
      ) : null}
    </div>
  )
}
