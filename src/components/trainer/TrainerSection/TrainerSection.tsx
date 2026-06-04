import type { ReactNode } from 'react'

export function TrainerSection({
  children,
  title,
}: {
  children: ReactNode
  title?: string
}) {
  return (
    <section className="grid gap-3">
      {title && <h3 className="label text-[0.65rem] font-bold">{title}</h3>}
      {children}
    </section>
  )
}
