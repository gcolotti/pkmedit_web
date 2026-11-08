import { useMemo } from 'react'

import { useCatalogs } from '../../query/useCatalogs/useCatalogs'
import { useSaveItemCatalog } from '../../query/useSaveItemCatalog/useSaveItemCatalog'
import type { ApiClient } from '../../services/api/api'
import type { CatalogBundle, Language } from '../../types/index/index'
import { defaultCatalogs } from '../../utils/defaultCatalogs/defaultCatalogs'

// Item IDs from the open save (bag, held items) are in its own ID space,
// which differs from the global Gen 4+ list for Gen 1-3 saves.
export function useWorkspaceCatalogs(
  api: ApiClient,
  apiBase: string,
  language: Language,
  sessionId: string | undefined,
): CatalogBundle {
  const baseCatalogs =
    useCatalogs(api, apiBase, language).data ?? defaultCatalogs
  const saveItems = useSaveItemCatalog(api, sessionId, language).data
  return useMemo(
    () =>
      saveItems?.length ? { ...baseCatalogs, items: saveItems } : baseCatalogs,
    [baseCatalogs, saveItems],
  )
}
