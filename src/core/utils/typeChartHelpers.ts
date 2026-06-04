import { GEN_TYPES, type GenKey } from './typeChartData'

export const WIKIDEX_TYPE_ORDER = [
  8, 10, 6, 15, 12, 7, 9, 17, 14, 1, 0, 11, 13, 5, 16, 4, 3, 2,
] as const

export type DefensiveRow = {
  key: string
  primaryType: number
  secondaryType?: number
}

export function getOrderedTypes(gen: GenKey): number[] {
  const available = new Set(GEN_TYPES[gen])
  return WIKIDEX_TYPE_ORDER.filter((typeId) => available.has(typeId))
}

export function buildDefensiveRows(
  types: number[],
  defenderType: number,
): DefensiveRow[] {
  const rows: DefensiveRow[] = [
    { key: String(defenderType), primaryType: defenderType },
    ...types
      .filter((typeId) => typeId !== defenderType)
      .map((typeId) => ({
        key: `${defenderType}-${typeId}`,
        primaryType: defenderType,
        secondaryType: typeId,
      })),
  ]
  return rows
}
