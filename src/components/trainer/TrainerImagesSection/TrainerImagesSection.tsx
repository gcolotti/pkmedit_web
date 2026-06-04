import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { TrainerImageInfo } from '../../../core/types/trainer/trainer'
import { TrainerImageCanvas } from '../TrainerImageCanvas/TrainerImageCanvas'

export function TrainerImagesSection({
  images,
  t,
}: {
  images: TrainerImageInfo[]
  t: Translator
}) {
  if (images.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
        {t('noTrainerImages')}
      </div>
    )
  }

  return (
    <section className="grid gap-3">
      <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
        {t('trainerImagesInfo')}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {images.map((image) => (
          <div
            key={image.key}
            className="surface-muted grid gap-2 rounded-md p-3"
          >
            <div className="text-sm font-bold">{imageLabel(image.key, t)}</div>
            <TrainerImageCanvas image={image} />
          </div>
        ))}
      </div>
    </section>
  )
}

function imageLabel(key: string, t: Translator) {
  if (key === 'current') return t('trainerImageCurrent')
  if (key === 'sbc') return t('trainerImageSbc')
  if (key === 'initial') return t('trainerImageInitial')
  return key
}
