export const BYTE_MAX = 255
export const UINT16_MAX = 65_535
export const UINT32_MAX = 4_294_967_295
export const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER

type NumberInputOptions = {
  fallback?: number
  max?: number
  min?: number
}

export function clampNumber(
  value: number,
  { max, min }: NumberInputOptions = {},
) {
  let next = value
  if (min !== undefined && next < min) next = min
  if (max !== undefined && next > max) next = max
  return next
}

export function parseClampedNumberInput(
  value: string,
  options: NumberInputOptions = {},
) {
  const fallback = options.fallback ?? options.min ?? 0
  const parsed = value.trim() === '' ? fallback : Number(value)
  return clampNumber(Number.isFinite(parsed) ? parsed : fallback, options)
}
