export function CatalogImagePreview({ src }: { src: string | undefined }) {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-md border border-black/10 bg-white/60 shadow-inner dark:border-white/10 dark:bg-black/20">
      {src && (
        <img
          alt=""
          aria-hidden="true"
          className="max-h-9 max-w-9 object-contain"
          decoding="async"
          loading="lazy"
          src={src}
        />
      )}
    </span>
  )
}
