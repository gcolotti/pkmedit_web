import type { ReactNode } from 'react'

export function EditorGroup({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) {
  return (
    <section
      aria-label={title}
      className="rounded-md border border-black/10 bg-white/50 p-3 dark:border-white/10 dark:bg-white/[0.04]"
    >
      <div className="grid gap-2 sm:grid-cols-2">{children}</div>
    </section>
  )
}
