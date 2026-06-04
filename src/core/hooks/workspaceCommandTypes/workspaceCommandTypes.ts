import type { Translator } from '../../i18n/i18n/i18n'
import type { ApiClient } from '../../services/api/api'
import { checkWorkspaceDraft } from '../../services/legality/legality'
import type { useArceusResearchDrafts } from '../useArceusResearchDrafts/useArceusResearchDrafts'
import type { useDonutDrafts } from '../useDonutDrafts/useDonutDrafts'
import type { useMetDateFixer } from '../useMetDateFixer/useMetDateFixer'
import type { usePokedexDrafts } from '../usePokedexDrafts/usePokedexDrafts'
import type { useSaveWorkspaceDatabases } from '../useSaveWorkspaceDatabases/useSaveWorkspaceDatabases'
import type { useSaveWorkspaceRaids } from '../useSaveWorkspaceRaids/useSaveWorkspaceRaids'
import type { useSectionDrafts } from '../useSectionDrafts/useSectionDrafts'
import type { useWorkspaceDerived } from '../useWorkspaceDerived/useWorkspaceDerived'
import type { useWorkspaceSession } from '../useWorkspaceSession/useWorkspaceSession'
import type {
  useDraftWorkspaceSlices,
  useUiWorkspaceSlices,
} from '../useWorkspaceStoreSlices/useWorkspaceStoreSlices'

export type WorkspaceCheckDraft = (
  selectedOnly?: boolean,
) => ReturnType<typeof checkWorkspaceDraft>

export type WorkspaceCommandsInput = {
  api: ApiClient
  allowIllegalChanges: boolean
  arceusResearch: ReturnType<typeof useArceusResearchDrafts>
  database: ReturnType<typeof useSaveWorkspaceDatabases>
  donuts: ReturnType<typeof useDonutDrafts>
  draftStore: ReturnType<typeof useDraftWorkspaceSlices>
  derived: ReturnType<typeof useWorkspaceDerived>
  metDate: ReturnType<typeof useMetDateFixer>
  pokedex: ReturnType<typeof usePokedexDrafts>
  raids: ReturnType<typeof useSaveWorkspaceRaids>
  sections: ReturnType<typeof useSectionDrafts>
  session: ReturnType<typeof useWorkspaceSession>
  t: Translator
  ui: ReturnType<typeof useUiWorkspaceSlices>
}
