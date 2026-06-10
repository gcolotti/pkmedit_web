import { type ReactNode } from 'react'

import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { I18nKey } from '../../../core/i18n/i18n/i18n'
import {
  getTypeBackground,
  TERA_TYPE_STELLAR,
} from '../../../core/utils/typeData/typeData'
import { FocusedEditorShell } from '../../core/focused/FocusedEditorShell/FocusedEditorShell'
import { TypeIcon } from '../../ui/TypeIcon/TypeIcon'

const SECTIONS: { label: I18nKey; body: I18nKey }[] = [
  { label: 'stellarInfoDefenseLabel', body: 'stellarInfoDefense' },
  { label: 'stellarInfoOffenseLabel', body: 'stellarInfoBoost' },
  { label: 'stellarInfoMovesLabel', body: 'stellarInfoMoves' },
  { label: 'stellarInfoNoteLabel', body: 'stellarInfoNote' },
]

const TOKEN_RE = /(\*\*.*?\*\*|\{type:(?:\d+|stellar)\})/

function parseTypeToken(token: string): number {
  const value = token.slice(6, -1)
  return value === 'stellar' ? TERA_TYPE_STELLAR : Number(value)
}

function renderRichText(text: string): ReactNode[] {
  return text.split(TOKEN_RE).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('{type:') && part.endsWith('}')) {
      const typeId = parseTypeToken(part)
      if (typeId === TERA_TYPE_STELLAR) {
        return (
          <span
            key={i}
            className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm align-text-bottom"
            style={{ background: getTypeBackground(typeId) }}
          >
            <TypeIcon className="h-3 w-3" typeId={typeId} />
          </span>
        )
      }
      return (
        <TypeIcon
          key={i}
          className="inline-block h-4 w-4 align-text-bottom"
          typeId={typeId}
        />
      )
    }
    return part
  })
}

export function StellarTypeInfoPage({
  t,
  onBack,
}: {
  t: Translator
  onBack: () => void
}) {
  const background = getTypeBackground(TERA_TYPE_STELLAR)

  return (
    <FocusedEditorShell backLabel={t('backToSaveEditor')} onBack={onBack}>
      <div className="overflow-auto p-6">
        <div className="mb-6 flex items-center gap-3">
          <span
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold tracking-wider text-white"
            style={{ background }}
          >
            <TypeIcon className="h-4 w-4 shrink-0" typeId={TERA_TYPE_STELLAR} />
            <span className="uppercase">{t('typeStellar')}</span>
          </span>
        </div>
        <div className="flex flex-col gap-5">
          {SECTIONS.map(({ label, body }) => (
            <div key={label}>
              <div className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {t(label)}
              </div>
              <div className="space-y-2">
                {t(body)
                  .split('\n\n')
                  .map((p, i) => (
                    <p key={i} className="text-sm leading-relaxed">
                      {renderRichText(p)}
                    </p>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </FocusedEditorShell>
  )
}
