import { useState } from 'react'

import { publicAssetUrl } from '../../../core/utils/publicAssetUrl/publicAssetUrl'

export function SpriteImage({
  alt,
  candidates,
  className = 'h-10 w-10 sm:h-12 sm:w-12',
}: {
  alt: string
  candidates: string[]
  className?: string
}) {
  const [index, setIndex] = useState(0)
  const src = candidates[index] ? publicAssetUrl(candidates[index]) : undefined

  if (!src) {
    return (
      <span
        className={`${className} block rounded bg-stone-200/70 dark:bg-stone-800`}
      />
    )
  }

  return (
    <img
      alt={alt}
      className={`${className} object-contain object-center drop-shadow-sm`}
      loading="lazy"
      src={src}
      onError={() => setIndex((value) => value + 1)}
    />
  )
}
