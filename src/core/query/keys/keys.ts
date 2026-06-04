import type { Language } from '../../types/index/index'

export const qk = {
  // Global (no session)
  apiStatus: (apiBase: string) => ['apiStatus', apiBase] as const,
  savesList: (apiBase: string) => ['savesList', apiBase] as const,
  catalogs: (apiBase: string, language: Language) =>
    ['catalogs', apiBase, language] as const,
  moveDetails: (apiBase: string, ids: readonly number[]) =>
    ['moveDetails', apiBase, ids] as const,
  abilityDetailsByIds: (apiBase: string, ids: readonly number[]) =>
    ['abilityDetails', 'byIds', apiBase, ids] as const,
  abilityDetailsBySlugs: (apiBase: string, slugs: readonly string[]) =>
    ['abilityDetails', 'bySlugs', apiBase, slugs] as const,

  // Per-session
  summary: (sessionId: string) => ['summary', sessionId] as const,
  party: (sessionId: string) => ['party', sessionId] as const,
  boxes: (sessionId: string) => ['boxes', sessionId] as const,
  pokemon: (sessionId: string, slotId: string) =>
    ['pokemon', sessionId, slotId] as const,
  trainerBase: (sessionId: string) => ['trainerBase', sessionId] as const,
  itemsBase: (sessionId: string) => ['itemsBase', sessionId] as const,
  undergroundBase: (sessionId: string) =>
    ['undergroundBase', sessionId] as const,
  raidsBase: (sessionId: string) => ['raidsBase', sessionId] as const,
  donutsBase: (sessionId: string) => ['donutsBase', sessionId] as const,

  // Search / preview (stateless, per-query)
  encounterSearch: (sessionId: string, query: object) =>
    ['encounterSearch', sessionId, query] as const,
  mysteryGiftSearch: (sessionId: string, query: object) =>
    ['mysteryGiftSearch', sessionId, query] as const,
}
