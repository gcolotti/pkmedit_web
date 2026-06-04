import type { UseQueryResult } from '@tanstack/react-query'

import type { SaveSectionStatus } from '../types/index'

export function mapQueryToSectionStatus(q: UseQueryResult): SaveSectionStatus {
  if (q.isFetching && !q.isFetched) return 'loading'
  if (q.isError) return 'unavailable'
  if (q.isSuccess) return 'ready'
  return 'idle'
}
