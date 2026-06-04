let shared = []

for (const specifier of [
  '@gcolotti/frontend-config/eslint',
  '@gcolotti/frontend-config/eslint.config',
  '@gcolotti/frontend-config',
]) {
  try {
    const imported = await import(specifier)
    const config = imported.default ?? imported.config ?? imported
    shared = Array.isArray(config) ? config : [config]
    break
  } catch {
    shared = []
  }
}

export default [
  ...shared,
  {
    name: 'pkmedit/max-lines-locales',
    files: ['src/core/i18n/locales/*.ts', 'src/core/utils/wikiDexAssets.ts'],
    rules: { 'max-lines': 'off' },
  },
]
