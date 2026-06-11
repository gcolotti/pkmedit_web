import type { ReactNode } from 'react'

import { useWorkspace } from '../../../core/hooks/workspaceContext/workspaceContext'
import { AppHeader } from '../AppHeader/AppHeader'

export function AppShell({ children }: { children: ReactNode }) {
  const { actions, state } = useWorkspace()

  return (
    <div className="app-shell min-h-screen text-ink dark:text-stone-100 xl:grid xl:h-screen xl:grid-rows-[auto_minmax(0,1fr)] xl:overflow-hidden">
      <AppHeader
        apiBase={state.apiBase}
        apiRegistration={state.apiRegistration}
        language={state.language}
        t={state.t}
        theme={state.theme}
        onApiBaseChange={actions.setApiBase}
        onApiKeyRotate={actions.rotateApiKey}
        onLanguageChange={actions.setLanguage}
        onThemeChange={actions.setTheme}
      />
      {children}
      <div
        className={`fixed bottom-5 left-1/2 max-w-toast -translate-x-1/2 rounded-md bg-ink px-4 py-3 text-sm text-white shadow-2xl transition ${state.toast ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        {state.toast}
      </div>
    </div>
  )
}
