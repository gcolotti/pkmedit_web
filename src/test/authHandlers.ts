import { http, HttpResponse } from 'msw'

export const registerClientAppHandler = http.post('*/api/apps/register', () =>
  HttpResponse.json({
    appId: 'web-test',
    apiKey: 'test-api-key',
    clientInstanceId: 'test-client',
    clientKind: 'web',
    clientName: 'pkmedit_web',
    expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
  }),
)
