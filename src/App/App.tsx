import { AppRoutes } from '../AppRoutes/AppRoutes'
import { ErrorBoundary } from '../components/ui/ErrorBoundary/ErrorBoundary'
import { ErrorFallback } from '../components/ui/ErrorFallback/ErrorFallback'
import { WorkspaceProvider } from '../core/hooks/workspaceContext/workspaceContext'

export function App() {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <WorkspaceProvider>
        <AppRoutes />
      </WorkspaceProvider>
    </ErrorBoundary>
  )
}
