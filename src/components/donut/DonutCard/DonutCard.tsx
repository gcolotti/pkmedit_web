import { ArrowDown } from 'lucide-react'
import { useRef, useState } from 'react'

export function DonutCard({
  title,
  subtitle,
  duplicateLabel,
  onDuplicate,
}: {
  title: string
  subtitle: string
  duplicateLabel: string
  onDuplicate: (times: number) => void
}) {
  const [qty, setQty] = useState(1)
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div className="flex items-center gap-2 rounded-md border border-stone-200 bg-white/60 px-3 py-2 text-sm dark:border-stone-800 dark:bg-stone-950/30">
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold">{title}</div>
        <div className="truncate text-xs text-stone-500 dark:text-stone-400">
          {subtitle}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <input
          ref={inputRef}
          aria-label={duplicateLabel}
          className="field w-12 text-center text-xs"
          min={1}
          max={999}
          type="number"
          value={qty}
          onChange={(e) =>
            setQty(
              Math.max(1, Math.min(999, Number(e.currentTarget.value) || 1)),
            )
          }
        />
        <button
          aria-label={duplicateLabel}
          className="btn min-h-7 px-2"
          title={duplicateLabel}
          type="button"
          onClick={() => onDuplicate(qty)}
        >
          <ArrowDown size={14} />
        </button>
      </div>
    </div>
  )
}
