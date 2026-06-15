import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { LegalFix, PokemonDetail } from '../../../../core/types/index/index'
import { FocusedEditorShell } from '../../../core/focused/FocusedEditorShell/FocusedEditorShell'
import { LegalityReport } from '../LegalityReport/LegalityReport'

// Descriptive stubs until "Apply Fix" (Feature B) lands. Apply buttons only log.
const STUB_FIXES: LegalFix[] = [
  {
    id: 'reroll-pid-compatible',
    label: 'Regenerate compatible PID',
    description:
      'Updates PID, gender, nature, and ability slot to match the encounter.',
    safety: 'safe',
    fields: ['main.pid', 'main.gender', 'main.nature', 'abilityNumber'],
  },
  {
    id: 'fix-relearn-moves',
    label: 'Fix relearn moves',
    description: 'Replaces invalid relearn moves with the encounter defaults.',
    safety: 'safe',
    fields: ['moves'],
  },
  {
    id: 'change-met-location',
    label: 'Change met location',
    description: 'Sets a met location compatible with the encounter.',
    safety: 'risky',
    fields: ['origin.metLocation'],
  },
]

const safetyClass = {
  safe: 'border-emerald-500 text-emerald-600 dark:text-emerald-300',
  risky: 'border-amber-500 text-amber-600 dark:text-amber-300',
  manual: 'border-stone-400 text-stone-500 dark:text-stone-400',
} as const

export function LegalityAdvanced({
  draft,
  onBack,
  t,
}: {
  draft: PokemonDetail
  onBack: () => void
  t: Translator
}) {
  const legality = draft.legality
  const fixes = legality.legal ? [] : STUB_FIXES
  const safeFixes = fixes.filter((fix) => fix.safety === 'safe')
  const safetyLabel = {
    safe: t('fixSafetySafe'),
    risky: t('fixSafetyRisky'),
    manual: t('fixSafetyManual'),
  } as const

  return (
    <FocusedEditorShell backLabel={t('backToLegality')} onBack={onBack} title={`${t('legality')} · ${t('advanced')}`}>
      <div className="grid h-full min-h-0 gap-4 overflow-y-auto p-4">
        <LegalityReport legality={legality} t={t} />

        <section className="grid gap-2">
          <div className="label text-[0.7rem]">{t('fixes')}</div>
          {legality.legal ? (
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {t('alreadyLegalNoFixes')}
            </p>
          ) : fixes.length === 0 ? (
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {t('noFixesAvailable')}
            </p>
          ) : (
            <div className="grid gap-2">
              {fixes.map((fix) => (
                <div
                  key={fix.id}
                  className="grid gap-1.5 rounded-md border border-black/10 p-3 dark:border-white/10"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold">{fix.label}</span>
                    <span
                      className={`rounded border px-1.5 py-0.5 text-[0.65rem] font-bold uppercase ${safetyClass[fix.safety]}`}
                    >
                      {safetyLabel[fix.safety]}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {fix.description}
                  </p>
                  <div>
                    <button
                      className="btn inline-flex h-8 items-center px-2.5 text-xs"
                      type="button"
                      onClick={() => console.info('apply fix (stub):', fix.id)}
                    >
                      {t('applyFix')}
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="inline-flex h-10 items-center justify-center rounded-md border border-lagoon bg-lagoon/15 px-3 text-sm font-bold text-lagoon transition hover:bg-lagoon/25 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={safeFixes.length === 0}
                type="button"
                onClick={() => console.info('apply all safe fixes (stub)')}
              >
                {t('applyAllSafeFixes')}
              </button>
            </div>
          )}
        </section>
      </div>
    </FocusedEditorShell>
  )
}
