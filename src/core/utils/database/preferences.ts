const databasePageSizeKey = 'pkmedit.database.pageSize'
export const defaultDatabasePageSize = 40

export function readDatabasePageSize(): number {
  if (typeof window === 'undefined') return defaultDatabasePageSize

  const value = Number(window.localStorage.getItem(databasePageSizeKey))
  return Number.isFinite(value)
    ? clampDatabasePageSize(value)
    : defaultDatabasePageSize
}

export function writeDatabasePageSize(value: number) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(
    databasePageSizeKey,
    String(clampDatabasePageSize(value)),
  )
}

export function clampDatabasePageSize(value: number): number {
  return Math.min(
    Math.max(Math.trunc(value) || defaultDatabasePageSize, 1),
    600,
  )
}
