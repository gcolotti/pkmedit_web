import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type {
  LegalFix,
  LegalityReport as LegalityReportData,
} from '../../../../core/types/index/index'
import { FocusedEditorShell } from '../../../core/focused/FocusedEditorShell/FocusedEditorShell'
import { LegalityFixCard } from '../LegalityFixCard/LegalityFixCard'
import { LegalityReport } from '../LegalityReport/LegalityReport'

export function LegalityAdvanced({
  applyingFixId,
  fixes,
  fixesError,
  fixesLoading,
  legality,
  onApplyAllSafeFixes,
  onApplyFix,
  onBack,
  t,
}: {
  applyingFixId: string | null
  fixes: LegalFix[]
  fixesError: string | null
  fixesLoading: boolean
  legality: LegalityReportData
  onApplyAllSafeFixes: () => void
  onApplyFix: (fixId: string) => void
  onBack: () => void
  t: Translator
}) {
  const activeFixes = legality.legal ? [] : fixes
  const safeFixes = fixes.filter((fix) => fix.safety === 'safe')
  const applyingAny = applyingFixId !== null

  return (
    <FocusedEditorShell
      backLabel={t('backToLegality')}
      onBack={onBack}
      title={`${t('legality')} · ${t('advanced')}`}
    >
      <div className="grid h-full min-h-0 gap-4 overflow-y-auto p-4">
        <LegalityReport legality={legality} t={t} />

        <section className="grid gap-2">
          <div className="label text-[0.7rem]">{t('fixes')}</div>
          {legality.legal ? (
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {t('alreadyLegalNoFixes')}
            </p>
          ) : fixesLoading ? (
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {t('loadingFixes')}
            </p>
          ) : fixesError ? (
            <p className="text-sm text-rose-600 dark:text-rose-300">
              {fixesError}
            </p>
          ) : activeFixes.length === 0 ? (
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {t('noFixesAvailable')}
            </p>
          ) : (
            <div className="grid gap-2">
              {activeFixes.map((fix) => (
                <LegalityFixCard
                  applying={applyingFixId === fix.id}
                  disabled={applyingAny}
                  fix={fix}
                  key={fix.id}
                  onApply={onApplyFix}
                  t={t}
                />
              ))}
              <button
                className="inline-flex h-10 items-center justify-center rounded-md border border-lagoon bg-lagoon/15 px-3 text-sm font-bold text-lagoon transition hover:bg-lagoon/25 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={safeFixes.length === 0 || applyingAny}
                type="button"
                onClick={onApplyAllSafeFixes}
              >
                {applyingFixId === 'all'
                  ? t('applyingFix')
                  : t('applyAllSafeFixes')}
              </button>
            </div>
          )}
        </section>
      </div>
    </FocusedEditorShell>
  )
}
