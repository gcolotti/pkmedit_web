const PLA_VERSION = 47
const ALPHA_VERSIONS = new Set([47, 52])

export function isPla(gameVersion: number): boolean {
  return gameVersion === PLA_VERSION
}

export function supportsAlpha(gameVersion: number): boolean {
  return ALPHA_VERSIONS.has(gameVersion)
}

export function supportsHeldItem(gameVersion: number): boolean {
  return !isPla(gameVersion)
}

export function restrictMovesToLegal(gameVersion: number): boolean {
  return isPla(gameVersion)
}
