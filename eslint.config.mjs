import shared from '@gcolotti/frontend-config/eslint'

export default [
  ...(Array.isArray(shared) ? shared : [shared]),
  {
    name: 'pkmedit/max-lines-locales',
    files: ['src/core/i18n/locales/*.ts', 'src/core/utils/wikiDexAssets.ts'],
    rules: { 'max-lines': 'off' },
  },
]
