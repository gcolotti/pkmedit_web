import type {
  DonutFlavorBudgets,
  DonutFlavorEntry,
  DonutPreview,
} from '../types/donut'

const BUDGET_BY_FLAVOR: Record<string, keyof DonutFlavorBudgets> = {
  spicy: 'spicy',
  fresh: 'fresh',
  sweet: 'sweet',
  bitter: 'bitter',
  sour: 'sour',
}

export function availableHighestFlavorLevels(
  flavors: DonutFlavorEntry[],
  preview: DonutPreview,
): DonutFlavorEntry[] {
  const best = new Map<string, DonutFlavorEntry>()
  for (const flavor of flavors) {
    if (!isAvailableFlavor(flavor, preview.budgets)) continue
    const key = flavorIdentityKey(flavor)
    const current = best.get(key)
    if (!current || flavor.level > current.level) best.set(key, flavor)
  }
  return [...best.values()]
}

export function hasSelectedFlavorCategory(
  selected: string[],
  flavors: DonutFlavorEntry[],
  category: string,
): boolean {
  return selected.some(
    (hash) =>
      flavors.find((flavor) => flavor.hash === hash)?.category === category,
  )
}

function isAvailableFlavor(
  flavor: DonutFlavorEntry,
  budgets: DonutFlavorBudgets,
): boolean {
  if (flavor.flavor === 'sp') return false
  const budgetKey = BUDGET_BY_FLAVOR[flavor.flavor]
  const flavorBudget = budgetKey ? budgets[budgetKey] : 0
  const maxCost = Math.min(Number(flavorBudget), budgets.total)
  return flavor.cost > 0 && flavor.cost <= maxCost
}

function flavorIdentityKey(flavor: DonutFlavorEntry): string {
  return `${flavor.flavor}_${flavor.name.split('_')[1] ?? flavor.name}`
}
