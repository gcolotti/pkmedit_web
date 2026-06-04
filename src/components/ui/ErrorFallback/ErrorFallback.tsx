import { AlertTriangle, RefreshCw } from 'lucide-react'

import { useTranslator } from '../../../core/i18n/useTranslator/useTranslator'

type Props = {
  error: Error
  retry: () => void
}

export function ErrorFallback({ error, retry }: Props) {
  const t = useTranslator()
  const message = error instanceof Error ? error.message : String(error)
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <AlertTriangle aria-hidden="true" className="text-rose-500" size={48} />
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{t('errorBoundaryTitle')}</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {message || t('errorBoundaryMessage')}
        </p>
      </div>
      <button
        className="btn flex items-center gap-2"
        type="button"
        onClick={retry}
      >
        <RefreshCw aria-hidden="true" size={16} />
        {t('errorBoundaryRetry')}
      </button>
    </div>
  )
}
