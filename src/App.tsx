import { AppRoutes } from './AppRoutes'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { ErrorFallback } from './components/ui/ErrorFallback'
import { WorkspaceProvider } from './core/hooks/workspaceContext'

export function App() {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <WorkspaceProvider>
        <AppRoutes />
      </WorkspaceProvider>
    </ErrorBoundary>
  )
}
