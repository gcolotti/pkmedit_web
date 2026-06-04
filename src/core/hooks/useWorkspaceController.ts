import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { useTranslator } from '../i18n/useTranslator'
import { qk } from '../query/keys'
import { useApiStatus } from '../query/useApiStatus'
import { useCatalogs } from '../query/useCatalogs'
import { useSavesList } from '../query/useSavesList'
import { ApiClient } from '../services/api'
import { useShellStore } from '../state/shellStore'
import { defaultCatalogs } from '../utils/defaultCatalogs'
import { useSaveWorkspace } from './useSaveWorkspace'
import { buildWorkspaceSubBlocks } from './workspaceSubBlocks'

const toErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error)

export function useWorkspaceController() {
  const {
    allowIllegalChanges,
    apiBase,
    language,
    setAllowIllegalChanges,
    setApiBase,
    setLanguage,
    setTheme,
    theme,
  } = useShellStore(
    useShallow((s) => ({
      allowIllegalChanges: s.allowIllegalChanges,
      apiBase: s.apiBase,
      language: s.language,
      setAllowIllegalChanges: s.setAllowIllegalChanges,
      setApiBase: s.setApiBase,
      setLanguage: s.setLanguage,
      setTheme: s.setTheme,
      theme: s.theme,
    })),
  )
  const [selectedSave, setSelectedSave] = useState('')

  const t = useTranslator()
  const api = useMemo(
    () =>
      new ApiClient(
        () => apiBase,
        () => language,
      ),
    [apiBase, language],
  )
  const queryClient = useQueryClient()
  const apiStatusQuery = useApiStatus(api, apiBase)
  const catalogsQuery = useCatalogs(api, apiBase, language)
  const savesListQuery = useSavesList(api, apiBase)
  const effectiveSelectedSave =
    selectedSave || savesListQuery.data?.[0]?.relativePath || ''
  const refreshSaves = useCallback(
    () => queryClient.invalidateQueries({ queryKey: qk.savesList(apiBase) }),
    [queryClient, apiBase],
  )
  const workspace = useSaveWorkspace(api, t, allowIllegalChanges, refreshSaves)
  const workspaceActionsRef = useRef(workspace.actions)

  useEffect(() => {
    workspaceActionsRef.current = workspace.actions
  }, [workspace.actions])

  const hasRestoredSave = useRef(false)
  useEffect(() => {
    if (!savesListQuery.data || hasRestoredSave.current) return
    hasRestoredSave.current = true
    void workspaceActionsRef.current.restoreLastLocalSave()
  }, [savesListQuery.data])

  const refreshApi = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: qk.apiStatus(apiBase) }),
      queryClient.invalidateQueries({ queryKey: qk.savesList(apiBase) }),
      queryClient.invalidateQueries({
        queryKey: qk.catalogs(apiBase, language),
      }),
    ])
    await workspaceActionsRef.current.restoreLastLocalSave()
  }, [queryClient, apiBase, language])

  const apiStatus = apiStatusQuery.error
    ? toErrorMessage(apiStatusQuery.error)
    : apiStatusQuery.data
      ? `${apiStatusQuery.data.status} / PKHeX.Core ${apiStatusQuery.data.pkhexCoreVersion}`
      : ''

  return {
    api,
    actions: {
      ...workspace.actions,
      checkSelectedSlot: () => workspace.actions.checkDraft(true),
      openSelectedSave: () =>
        workspace.actions.openSelectedSave(effectiveSelectedSave),
      refreshApi,
      refreshSaves,
      setAllowIllegalChanges,
      setApiBase,
      setLanguage,
      setSelectedSave,
      setTheme,
    },
    state: {
      ...workspace.state,
      allowIllegalChanges,
      apiBase,
      apiStatus,
      catalogs: catalogsQuery.data ?? defaultCatalogs,
      language,
      saves: savesListQuery.data ?? [],
      selectedSave: effectiveSelectedSave,
      t,
      theme,
    },
    ...buildWorkspaceSubBlocks(workspace),
  }
}

export type WorkspaceController = ReturnType<typeof useWorkspaceController>
