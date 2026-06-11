import { http, HttpResponse, type JsonBodyType } from 'msw'

const json = (data: JsonBodyType): Response => HttpResponse.json(data)

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
