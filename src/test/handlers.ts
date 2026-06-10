import { http, HttpResponse, type JsonBodyType } from 'msw'

const json = (data: JsonBodyType, init?: ResponseInit): Response =>
  HttpResponse.json(data, init)

// Catch-all default. Tests override with server.use(...) in beforeEach.
// Returning 200/empty here is intentionally permissive so the test setup
// doesn't fail on requests the suite hasn't explicitly stubbed yet.
export const defaultHandlers = [
  http.all('*', () => HttpResponse.json({})),
]

// --- Health & capabilities ---

export const healthHandler = http.get('*/api/health', () =>
  json({ status: 'ok' }),
)

export const capabilitiesHandler = http.get('*/api/capabilities', () =>
  json({ pkhexCoreVersion: '1.0.0' }),
)

// --- Saves ---

export const listSavesHandler = http.get('*/api/saves/files', () =>
  json([{ path: '/x/y.sav', name: 'y.sav' }]),
)

export const openSaveHandler = http.post('*/api/saves/open', () =>
  json({ sessionId: 'ses-1', summary: {} }),
)

export const uploadAndOpenSaveHandler = http.post('*/api/saves/upload-open', () =>
  json({ sessionId: 'ses-2', summary: {} }),
)

export const summaryHandler = http.get(
  '*/api/saves/:sessionId/summary',
  () => json({}),
)

export const pokedexStatusHandler = http.get(
  '*/api/saves/:sessionId/pokedex',
  () => json({}),
)

export const arceusResearchStatusHandler = http.get(
  '*/api/saves/:sessionId/pokedex/arceus-research',
  () => json({}),
)

export const arceusResearchSpeciesHandler = http.get(
  '*/api/saves/:sessionId/pokedex/arceus-research/:species',
  () => json({}),
)

// --- Pokemon ---

export const partyHandler = http.get(
  '*/api/saves/:sessionId/party',
  () => json({ slots: [] }),
)

export const boxesHandler = http.get(
  '*/api/saves/:sessionId/boxes',
  () => json({ boxes: [] }),
)

export const pokemonHandler = http.get(
  '*/api/saves/:sessionId/pokemon/:slotId',
  () => json({}),
)

export const previewPokemonHandler = http.post(
  '*/api/saves/:sessionId/pokemon/:slotId/preview',
  () => json({}),
)

export const checkDraftHandler = http.post(
  '*/api/saves/:sessionId/legality/check-draft',
  () => json({ reports: [], violations: [], blocked: false }),
)

export const trainerHandler = http.get(
  '*/api/saves/:sessionId/trainer',
  () => json({}),
)

// --- Catalogs ---

export const catalogsHandler = http.get('*/api/catalogs', () =>
  json({ types: [], moves: [], abilities: [] }),
)

export const moveDetailsHandler = http.get(
  '*/api/catalogs/move-details',
  () => json({ entries: [], total: 0, page: null, pageSize: null, hasNext: null, hasPrevious: null }),
)

export const abilityDetailsHandler = http.get(
  '*/api/catalogs/ability-details',
  () => json({ entries: [], total: 0, page: null, pageSize: null, hasNext: null, hasPrevious: null }),
)

// --- Items ---

export const itemBagHandler = http.get(
  '*/api/saves/:sessionId/items',
  () => json({}),
)

export const donutsHandler = http.get(
  '*/api/saves/:sessionId/donuts',
  () => json({}),
)

export const previewDonutHandler = http.post(
  '*/api/saves/:sessionId/donuts/preview',
  () => json({}),
)

export const undergroundHandler = http.get(
  '*/api/saves/:sessionId/underground',
  () => json({}),
)

export const raidsHandler = http.get(
  '*/api/saves/:sessionId/raids',
  () => json({}),
)

// --- Databases ---

export const searchEncountersHandler = http.post(
  '*/api/saves/:sessionId/databases/encounters/search',
  () => json({ total: 0, page: 0, pageSize: 0, pageCount: 0, results: [] }),
)

export const previewEncounterHandler = http.post(
  '*/api/saves/:sessionId/databases/encounters/preview',
  () => json({ entry: {}, pokemon: {}, replacement: { dataBase64: '' } }),
)

export const searchMysteryGiftsHandler = http.post(
  '*/api/saves/:sessionId/databases/mystery-gifts/search',
  () =>
    json({
      total: 0,
      page: 0,
      pageSize: 0,
      pageCount: 0,
      storage: { supported: true, full: false, capacity: 0, used: 0 },
      legalityCounts: { legal: 0, uncertain: 0, illegal: 0 },
      results: [],
    }),
)

export const previewMysteryGiftHandler = http.post(
  '*/api/saves/:sessionId/databases/mystery-gifts/preview',
  () =>
    json({
      entry: {},
      pokemon: null,
      draft: { giftDataBase64: '', extension: '' },
      replacement: null,
      storage: { supported: true, full: false, capacity: 0, used: 0 },
    }),
)

export const previewMetDateFixerHandler = http.post(
  '*/api/saves/:sessionId/met-date-fixer/preview',
  () => json({}),
)

// --- Export ---

export const exportSaveHandler = http.get(
  '*/api/saves/:sessionId/export',
  () =>
    new HttpResponse(new Blob(['export-bytes']), {
      headers: { 'content-type': 'application/octet-stream' },
    }),
)

export const exportDraftHandler = http.post(
  '*/api/saves/:sessionId/export-draft',
  () =>
    new HttpResponse(new Blob(['export-draft-bytes']), {
      headers: { 'content-type': 'application/octet-stream' },
    }),
)
