import { useCallback } from 'react'

import type { DatabaseView, View } from '../types/index'
import type { WorkspaceCommandsInput } from './workspaceCommandTypes'

export function useWorkspaceViewCommands(input: WorkspaceCommandsInput) {
  const { setDatabaseView, setView, view } = input.ui
  const { setDatabasePreview } = input.database.setters

  const changeView = useCallback(
    (next: View) => {
      setView(next)
      if (next !== view && next !== 'database') setDatabasePreview(null)
    },
    [setDatabasePreview, setView, view],
  )

  const changeDatabaseView = useCallback(
    (next: DatabaseView) => {
      setDatabaseView(next)
      setDatabasePreview(null)
    },
    [setDatabasePreview, setDatabaseView],
  )

  return { changeDatabaseView, changeView }
}
