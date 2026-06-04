import { createContext, type ReactNode, useContext } from 'react'

import {
  useWorkspaceController,
  type WorkspaceController,
} from './useWorkspaceController'

const WorkspaceContext = createContext<WorkspaceController | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const workspace = useWorkspaceController()
  return (
    <WorkspaceContext.Provider value={workspace}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const workspace = useContext(WorkspaceContext)
  if (!workspace) throw new Error('useWorkspace must be used within provider')
  return workspace
}
