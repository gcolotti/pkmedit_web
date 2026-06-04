import { useQuery } from '@tanstack/react-query'

import type { ApiClient } from '../services/api'
import type { AbilityDetail } from '../types/index'
import { qk } from './keys'

const sortIds = (ids: readonly number[]): number[] =>
  [...ids].sort((a, b) => a - b)

const sortSlugs = (slugs: readonly string[]): string[] => [...slugs].sort()

// By id: used by AbilityListbox for the entries the user can select in the dropdown.
export function useAbilityDetailsByIds(
  api: ApiClient,
  apiBase: string,
  ids: number[],
) {
  return useQuery({
    queryKey: qk.abilityDetailsByIds(apiBase, sortIds(ids)),
    queryFn: async () => {
      const page = await api.catalog.getAbilityDetails({ ids })
      return new Map<number, AbilityDetail>(page.entries.map((e) => [e.id, e]))
    },
    enabled: ids.length > 0,
    staleTime: Infinity,
  })
}

// By slug: used by MoveCardModifiers to look up the description of each ability
// that modifies the currently inspected move. The move data carries slugs (not
// ids) in current.modifiedBy.abilities, so the lookup key has to be slug.
export function useAbilityDetailsBySlugs(
  api: ApiClient,
  apiBase: string,
  slugs: string[],
) {
  return useQuery({
    queryKey: qk.abilityDetailsBySlugs(apiBase, sortSlugs(slugs)),
    queryFn: async () => {
      const page = await api.catalog.getAbilityDetails({ slugs })
      const bySlug = new Map<string, AbilityDetail>()
      for (const e of page.entries) {
        if (e.slug) bySlug.set(e.slug, e)
      }
      return bySlug
    },
    enabled: slugs.length > 0,
    staleTime: Infinity,
  })
}
