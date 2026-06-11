import { ModalDialog } from '../../ModalDialog/ModalDialog'

export type FieldHelpContent = {
  body: string
  example?: string
  range: string
  risk?: string
  sourceLabel?: string
  sourceUrl?: string
  title: string
}

export function FieldHelpDialog({
  allowedValuesLabel,
  closeLabel,
  content,
  exampleLabel,
  riskLabel,
  onClose,
}: {
  allowedValuesLabel: string
  closeLabel: string
  content: FieldHelpContent
  exampleLabel: string
  riskLabel: string
  onClose: () => void
}) {
  return (
    <ModalDialog
      closeLabel={closeLabel}
      title={content.title}
      width="lg"
      onClose={onClose}
    >
      <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-300">
        {content.body}
      </p>
      <dl className="mt-4 grid gap-3 text-sm">
        <div>
          <dt className="font-semibold">{allowedValuesLabel}</dt>
          <dd className="mt-1 font-mono text-xs text-stone-600 dark:text-stone-300">
            {content.range}
          </dd>
        </div>
        {content.example && (
          <div>
            <dt className="font-semibold">{exampleLabel}</dt>
            <dd className="mt-1 text-stone-600 dark:text-stone-300">
              {content.example}
            </dd>
          </div>
        )}
        {content.risk && (
          <div>
            <dt className="font-semibold">{riskLabel}</dt>
            <dd className="mt-1 text-stone-600 dark:text-stone-300">
              {content.risk}
            </dd>
          </div>
        )}
      </dl>
      {content.sourceUrl && content.sourceLabel && (
        <a
          className="mt-4 inline-flex text-sm font-semibold text-sky-700 underline dark:text-sky-300"
          href={content.sourceUrl}
          rel="noreferrer"
          target="_blank"
        >
          {content.sourceLabel}
        </a>
      )}
    </ModalDialog>
  )
}
