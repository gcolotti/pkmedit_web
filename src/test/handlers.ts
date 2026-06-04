import { http, HttpResponse } from 'msw'

// Catch-all defaults. Tests override with server.use(...) in beforeEach.
// Returning 200/empty here is intentionally permissive so the test setup
// doesn't fail on requests the suite hasn't explicitly stubbed yet.
export const defaultHandlers = [
  http.all('*', () => HttpResponse.json({})),
]
