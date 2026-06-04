import { useEffect, useRef, useState } from 'react'

import type { ApiClient } from '../../services/api/api'
import { buildPokemonPayload } from '../../services/pokemonPayload/pokemonPayload'
import type { PokemonDetail } from '../../types/index/index'
import type { PokemonStats } from '../../types/pokemon/pokemon'

const DEBOUNCE_MS = 400
const GLOW_MS = 1200

type StatKey = keyof PokemonStats

const STAT_KEYS: StatKey[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe']

function statsDiffer(a: PokemonStats, b: PokemonStats): StatKey[] {
  return STAT_KEYS.filter((k) => a[k] !== b[k])
}

function reconciliationKey(draft: PokemonDetail): string {
  const { evs, hyperTrainedIvs, ivs, main, summary } = draft
  return JSON.stringify({
    evs,
    hyperTrainedIvs,
    ivs,
    level: summary.level,
    form: summary.form,
    species: summary.species,
    nature: summary.nature,
    statNature: main.statNature,
  })
}

export type StatReconciliation = {
  displayStats: PokemonStats
  glowKeys: ReadonlySet<StatKey>
}

export function useStatReconciliation(
  api: ApiClient,
  sessionId: string | null,
  slotId: string | null,
  draft: PokemonDetail | null,
  localStats: PokemonStats | null,
): StatReconciliation {
  const [overrideStats, setOverrideStats] = useState<PokemonStats | null>(null)
  const [glowKeys, setGlowKeys] = useState<ReadonlySet<StatKey>>(
    () => new Set(),
  )
  const latestKeyRef = useRef<string>('')
  const slotRef = useRef<string | null>(null)

  // Reset overrides when slot changes.
  useEffect(() => {
    if (slotRef.current !== slotId) {
      slotRef.current = slotId
      setOverrideStats(null)
      setGlowKeys(new Set())
    }
  }, [slotId])

  useEffect(() => {
    if (!sessionId || !slotId || !draft || !localStats) return
    const key = reconciliationKey(draft)
    latestKeyRef.current = key
    const requestedSlot = slotId
    const payload = buildPokemonPayload(draft)
    const handle = window.setTimeout(() => {
      void (async () => {
        try {
          const result = await api.previewPokemonUpdate(
            sessionId,
            requestedSlot,
            payload,
          )
          if (latestKeyRef.current !== key) return
          if (slotRef.current !== requestedSlot) return
          const backend = result.calculatedStats
          const diffs = statsDiffer(localStats, backend)
          if (diffs.length === 0) {
            setOverrideStats(null)
            return
          }
          setOverrideStats(backend)
          setGlowKeys(new Set(diffs))
        } catch {
          /* network/parse failure: keep local stats */
        }
      })()
    }, DEBOUNCE_MS)
    return () => window.clearTimeout(handle)
  }, [api, sessionId, slotId, draft, localStats])

  // Clear glow after a short interval.
  useEffect(() => {
    if (glowKeys.size === 0) return
    const handle = window.setTimeout(() => setGlowKeys(new Set()), GLOW_MS)
    return () => window.clearTimeout(handle)
  }, [glowKeys])

  return {
    displayStats: overrideStats ??
      localStats ?? {
        hp: 0,
        atk: 0,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0,
      },
    glowKeys,
  }
}
