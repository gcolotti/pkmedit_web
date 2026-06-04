import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { CatalogEntry } from '../../../core/types/index/index'
import type { TrainerInfo } from '../../../core/types/trainer/trainer'
import { parseClampedNumberInput } from '../../../core/utils/numberInput/numberInput'
import { TrainerSection } from '../TrainerSection/TrainerSection'

export function TrainerIdentitySection({
  catalogs,
  trainer,
  t,
  onChange,
}: {
  catalogs: { languages: CatalogEntry[] }
  trainer: TrainerInfo
  t: Translator
  onChange: <K extends keyof TrainerInfo>(key: K, value: TrainerInfo[K]) => void
}) {
  return (
    <TrainerSection>
      <div className="grid grid-cols-[minmax(0,1fr)_4.75rem_minmax(0,1fr)] gap-2">
        <label className="grid min-w-0 gap-1.5">
          <span className="label text-[0.65rem]">{t('trainerName')}</span>
          <input
            className="field"
            maxLength={24}
            type="text"
            value={trainer.otName}
            onChange={(event) => onChange('otName', event.target.value)}
          />
        </label>
        <label className="grid min-w-0 gap-1.5">
          <span className="label text-[0.65rem]">{t('otGender')}</span>
          <select
            className="field"
            value={trainer.gender}
            onChange={(event) => onChange('gender', Number(event.target.value))}
          >
            <option value={0}>{'\u2642'}</option>
            <option value={1}>{'\u2640'}</option>
          </select>
        </label>
        <label className="grid min-w-0 gap-1.5">
          <span className="label text-[0.65rem]">{t('language')}</span>
          <select
            className="field"
            value={trainer.language}
            onChange={(event) =>
              onChange('language', Number(event.target.value))
            }
          >
            {catalogs.languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div
        className={`grid gap-2 ${trainer.canEditMoney ? 'grid-cols-3' : 'grid-cols-2'}`}
      >
        <label className="grid min-w-0 gap-1.5">
          <span className="label text-[0.65rem]">{t('trainerTid')}</span>
          <input
            className="field"
            max={999999}
            min={0}
            type="number"
            value={trainer.displayTID}
            onChange={(event) =>
              onChange(
                'displayTID',
                parseClampedNumberInput(event.target.value, {
                  max: 999999,
                  min: 0,
                }),
              )
            }
          />
        </label>
        <label className="grid min-w-0 gap-1.5">
          <span className="label text-[0.65rem]">{t('trainerSid')}</span>
          <input
            className="field"
            max={9999}
            min={0}
            type="number"
            value={trainer.displaySID}
            onChange={(event) =>
              onChange(
                'displaySID',
                parseClampedNumberInput(event.target.value, {
                  max: 9999,
                  min: 0,
                }),
              )
            }
          />
        </label>
        {trainer.canEditMoney && (
          <label className="grid min-w-0 gap-1.5">
            <span className="label text-[0.65rem]">{t('money')}</span>
            <input
              className="field"
              max={9999999}
              min={0}
              type="number"
              value={trainer.money}
              onChange={(event) =>
                onChange(
                  'money',
                  parseClampedNumberInput(event.target.value, {
                    max: 9999999,
                    min: 0,
                  }),
                )
              }
            />
          </label>
        )}
      </div>
    </TrainerSection>
  )
}
