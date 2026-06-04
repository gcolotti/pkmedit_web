export type StatKey = 'atk' | 'def' | 'spa' | 'spd' | 'spe'

export type NatureModifier = { up: StatKey; down: StatKey } | null

// Backend CatalogEntry.upStat/downStat are amp stat indices over the order
// [Atk, Def, Spe, SpA, SpD]. This index→key map is display glue; the rule itself
// (which nature raises/lowers which stat) is served by the catalog, not hard-coded.
const AMP_STAT_KEYS: readonly StatKey[] = ['atk', 'def', 'spe', 'spa', 'spd']

/** Resolve a nature's ↑/↓ stats from its catalog modifiers. null = neutral. */
export function natureModifier(
  upStat?: number | null,
  downStat?: number | null,
): NatureModifier {
  if (upStat == null || downStat == null) return null
  const up = AMP_STAT_KEYS[upStat]
  const down = AMP_STAT_KEYS[downStat]
  return up && down ? { up, down } : null
}
