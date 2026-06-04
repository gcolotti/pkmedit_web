import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { TrainerRoyaleInfo } from '../../../core/types/trainer/trainer'
import { MaxNumberField } from '../../ui/MaxNumberField/MaxNumberField'
import { TrainerSection } from '../TrainerSection/TrainerSection'

export function TrainerRoyaleSection({
  royale,
  t,
  onChange,
}: {
  royale: TrainerRoyaleInfo
  t: Translator
  onChange: (royale: TrainerRoyaleInfo) => void
}) {
  return (
    <TrainerSection title={t('royaleTicketPoints')}>
      <div className="grid grid-cols-2 gap-2">
        <MaxNumberField
          label={t('regular')}
          maxValue={310000}
          value={royale.regularTicketPoints}
          onChange={(regularTicketPoints) =>
            onChange({ ...royale, regularTicketPoints })
          }
        />
        <MaxNumberField
          label={t('infinite')}
          maxValue={50000}
          value={royale.infiniteTicketPoints}
          onChange={(infiniteTicketPoints) =>
            onChange({ ...royale, infiniteTicketPoints })
          }
        />
      </div>
    </TrainerSection>
  )
}
