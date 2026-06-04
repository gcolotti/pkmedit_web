import { Info } from 'lucide-react'
import { type ReactNode, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const TOOLTIP_WIDTH = 288

export function AbilityInfoTooltip({
  text,
  children,
}: {
  text: string
  children?: ReactNode
}) {
  const anchorRef = useRef<HTMLSpanElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  const show = () => {
    const rect = anchorRef.current?.getBoundingClientRect()
    if (!rect) return
    const left = Math.max(
      8,
      Math.min(
        window.innerWidth - TOOLTIP_WIDTH - 8,
        rect.right - TOOLTIP_WIDTH,
      ),
    )
    setPos({ top: rect.bottom + 4, left })
  }

  const hide = () => setPos(null)

  return (
    <>
      <span
        ref={anchorRef}
        aria-label={text}
        className={
          children
            ? 'inline-flex cursor-help'
            : 'ml-auto inline-flex shrink-0 opacity-60 hover:opacity-100'
        }
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children ?? <Info className="h-4 w-4" />}
      </span>
      {pos &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              width: TOOLTIP_WIDTH,
            }}
            className="pointer-events-none z-[1000] whitespace-pre-line rounded-md border border-white/10 bg-zinc-900 p-2 text-left text-[0.65rem] font-normal leading-snug text-stone-200 shadow-xl"
          >
            {text}
          </div>,
          document.body,
        )}
    </>
  )
}
