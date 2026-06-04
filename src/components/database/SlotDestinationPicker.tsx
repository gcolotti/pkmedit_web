import { type ReactNode, useState } from 'react'

import type { Translator } from '../../core/i18n/i18n'
import type { BoxSummary } from '../../core/types/index'
import type { PokemonSummary } from '../../core/types/pokemon'

type SlotDestination = {
  disabled: boolean
  slotId: string
}

export function SlotDestinationPicker({
  boxes,
  children,
  party,
  surface = true,
  t,
}: {
  boxes: BoxSummary[]
  children: (destination: SlotDestination) => ReactNode
  party: PokemonSummary[]
  surface?: boolean
  t: Translator
}) {
  const [targetSource, setTargetSource] = useState<'party' | 'box'>('box')
  const [targetBox, setTargetBox] = useState(0)
  const [targetSlot, setTargetSlot] = useState(0)
  const resolvedBox = boxes[targetBox] ? targetBox : 0
  const box = boxes[resolvedBox]
  const slotOptions = targetSource === 'party' ? party : (box?.slots ?? [])
  const resolvedSlot = slotOptions[targetSlot] ? targetSlot : 0
  const disabled = slotOptions.length === 0
  const slotId =
    targetSource === 'party'
      ? `party-${resolvedSlot}`
      : `box-${resolvedBox}-${resolvedSlot}`

  return (
    <div
      className={[
        'flex flex-wrap items-end gap-2',
        surface ? 'surface-muted rounded-md p-2' : '',
      ].join(' ')}
    >
      <label className="grid basis-20 gap-1.5 sm:basis-24">
        <span className="label text-[0.65rem]">{t('destination')}</span>
        <select
          className="field h-10 w-full"
          value={targetSource}
          onChange={(event) => {
            setTargetSource(event.currentTarget.value as 'party' | 'box')
            setTargetSlot(0)
          }}
        >
          <option value="box">{t('boxes')}</option>
          <option value="party">{t('party')}</option>
        </select>
      </label>
      {targetSource === 'box' ? (
        <label className="grid basis-20 gap-1.5 sm:basis-24">
          <span className="label text-[0.65rem]">{t('box')}</span>
          <select
            className="field h-10 w-full"
            value={resolvedBox}
            onChange={(event) => {
              setTargetBox(Number(event.currentTarget.value))
              setTargetSlot(0)
            }}
          >
            {boxes.map((item) => (
              <option key={item.boxIndex} value={item.boxIndex}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label className="grid min-w-0 flex-1 gap-1.5">
        <span className="label text-[0.65rem]">{t('slot')}</span>
        <select
          className="field h-10"
          disabled={disabled}
          value={resolvedSlot}
          onChange={(event) => setTargetSlot(Number(event.currentTarget.value))}
        >
          {slotOptions.map((slot, index) => (
            <option
              key={slot.slotId}
              value={index}
            >{`${index + 1} - ${slot.speciesName}`}</option>
          ))}
        </select>
      </label>
      {children({ disabled, slotId })}
    </div>
  )
}
