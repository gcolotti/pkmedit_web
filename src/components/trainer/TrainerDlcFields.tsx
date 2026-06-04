import type { Translator } from '../../core/i18n/i18n'
import type { TrainerDlcInfo } from '../../core/types/trainer'
import { MaxNumberField } from '../ui/MaxNumberField'
import { TrainerSection } from './TrainerSection'

const HYPERSPACE_SURVEY_POINTS_MAX = 100_000

export function TrainerDlcFields({
  dlc,
  t,
  onChange,
}: {
  dlc: TrainerDlcInfo
  t: Translator
  onChange: (dlc: TrainerDlcInfo) => void
}) {
  return (
    <TrainerSection title={t('trainerDlc')}>
      <MaxNumberField
        label={t('hyperspaceSurveyPoints')}
        maxValue={HYPERSPACE_SURVEY_POINTS_MAX}
        value={dlc.hyperspaceSurveyPoints}
        onChange={(hyperspaceSurveyPoints) =>
          onChange({ ...dlc, hyperspaceSurveyPoints })
        }
      />
      <label className="grid gap-1.5">
        <span className="label text-[0.65rem]">{t('streetName')}</span>
        <input
          className="field"
          maxLength={18}
          value={dlc.streetName}
          onChange={(event) =>
            onChange({ ...dlc, streetName: event.currentTarget.value })
          }
        />
      </label>
    </TrainerSection>
  )
}
