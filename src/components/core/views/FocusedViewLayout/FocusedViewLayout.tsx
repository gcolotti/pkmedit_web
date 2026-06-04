import type { ReactNode } from 'react'

import { AppShell } from '../../AppShell/AppShell'

export function FocusedViewLayout({
  savesPanel,
  children,
}: {
  savesPanel: ReactNode
  children: ReactNode
}) {
  return (
    <AppShell>
      <main className="mx-auto grid w-full max-w-shell items-start gap-4 p-4 xl:min-h-0 xl:grid-cols-[minmax(17rem,20rem)_minmax(0,1fr)] xl:items-stretch xl:overflow-hidden xl:pb-5">
        {savesPanel}
        {children}
      </main>
    </AppShell>
  )
}
