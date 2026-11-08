import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'

import { server } from '../../../test/server'
import { ApiClient } from '../../services/api/api'
import { useWorkspaceCatalogs } from './useWorkspaceCatalogs'

const modernItems = [{ id: 5, name: 'Safari Ball' }]
const crystalItems = [{ id: 5, name: 'Poké Ball', spriteId: 4 }]

function renderCatalogs(sessionId: string | undefined) {
  server.use(
    http.get('*/api/catalogs', () =>
      HttpResponse.json({ types: [], items: modernItems }),
    ),
    http.get('*/api/saves/:sessionId/catalogs/items', () =>
      HttpResponse.json({ language: 'en', entries: crystalItems }),
    ),
  )
  const client = new QueryClient()
  const api = new ApiClient(
    () => 'http://api.test',
    () => 'en',
  )
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return renderHook(
    () => useWorkspaceCatalogs(api, 'http://api.test', 'en', sessionId),
    { wrapper },
  )
}

describe('useWorkspaceCatalogs', () => {
  it('names items with the open save catalog (Gen 2 #5 = Poké Ball)', async () => {
    const { result } = renderCatalogs('crystal')

    await waitFor(() => expect(result.current.items).toEqual(crystalItems))
  })

  it('keeps the global item catalog when no save is open', async () => {
    const { result } = renderCatalogs(undefined)

    await waitFor(() => expect(result.current.items).toEqual(modernItems))
  })
})
