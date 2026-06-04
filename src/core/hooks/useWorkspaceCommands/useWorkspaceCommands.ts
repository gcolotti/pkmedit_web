import { useWorkspaceRevertCommands } from '../useWorkspaceRevertCommands/useWorkspaceRevertCommands'
import { useWorkspaceValidationCommand } from '../useWorkspaceValidationCommand/useWorkspaceValidationCommand'
import { useWorkspaceViewCommands } from '../useWorkspaceViewCommands/useWorkspaceViewCommands'
import { useWorkspaceWriteCommand } from '../useWorkspaceWriteCommand/useWorkspaceWriteCommand'
import type { WorkspaceCommandsInput } from '../workspaceCommandTypes/workspaceCommandTypes'

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
