import { useWorkspaceRevertCommands } from './useWorkspaceRevertCommands'
import { useWorkspaceValidationCommand } from './useWorkspaceValidationCommand'
import { useWorkspaceViewCommands } from './useWorkspaceViewCommands'
import { useWorkspaceWriteCommand } from './useWorkspaceWriteCommand'
import type { WorkspaceCommandsInput } from './workspaceCommandTypes'

export function useWorkspaceCommands(input: WorkspaceCommandsInput) {
  const checkDraft = useWorkspaceValidationCommand(input)
  const { changeDatabaseView, changeView } = useWorkspaceViewCommands(input)
  const { writeWorkspaceSave, writeWorkspaceSaveZip } =
    useWorkspaceWriteCommand(input)
  const { revertAll, revertChange } = useWorkspaceRevertCommands(input)

  return {
    changeDatabaseView,
    changeView,
    checkDraft,
    revertAll,
    revertChange,
    writeWorkspaceSave,
    writeWorkspaceSaveZip,
  }
}
