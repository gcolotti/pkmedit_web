// Growth rates match PKHeX's GrowthRate enum: 0=MediumFast, 1=Erratic, 2=Fluctuating, 3=MediumSlow, 4=Fast, 5=Slow
export function expForLevel(level: number, growthRate: number): number {
  if (level <= 1) return 0
  const n = level
  switch (growthRate) {
    case 0: // MediumFast: n^3
      return n ** 3
    case 1: // Erratic
      if (n <= 50) return Math.floor((n ** 3 * (100 - n)) / 50)
      if (n <= 68) return Math.floor((n ** 3 * (150 - n)) / 100)
      if (n <= 98)
        return Math.floor((n ** 3 * Math.floor((1911 - 10 * n) / 3)) / 500)
      return Math.floor((n ** 3 * (160 - n)) / 100)
    case 2: // Fluctuating
      if (n <= 15)
        return Math.floor((n ** 3 * (Math.floor((n + 1) / 3) + 24)) / 50)
      if (n <= 35) return Math.floor((n ** 3 * (n + 14)) / 50)
      return Math.floor((n ** 3 * (Math.floor(n / 2) + 32)) / 50)
    case 3: // MediumSlow: (6/5)n^3 - 15n^2 + 100n - 140
      return Math.max(
        0,
        Math.floor((6 * n ** 3) / 5) - 15 * n ** 2 + 100 * n - 140,
      )
    case 4: // Fast: 4n^3/5
      return Math.floor((4 * n ** 3) / 5)
    case 5: // Slow: 5n^3/4
      return Math.floor((5 * n ** 3) / 4)
    default:
      return n ** 3
  }
}
