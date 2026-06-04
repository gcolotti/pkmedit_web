import type {
  PokemonHyperTrain,
  PokemonStats,
} from '../../../../core/types/pokemon/pokemon'

export function HyperTrainAllButton({
  ivs,
  label,
  onChange,
}: {
  ivs: PokemonStats
  label: string
  onChange: (ht: PokemonHyperTrain) => void
}) {
  return (
    <button
      aria-label={label}
      className="flex h-7 w-full items-center justify-center rounded border border-amber-400/60 bg-amber-400/20 text-amber-500 transition hover:bg-amber-400/40 dark:border-amber-300/40 dark:bg-amber-300/10 dark:text-amber-300"
      title={label}
      type="button"
      onClick={() =>
        onChange({
          hp: ivs.hp < 31,
          atk: ivs.atk < 31,
          def: ivs.def < 31,
          spa: ivs.spa < 31,
          spd: ivs.spd < 31,
          spe: ivs.spe < 31,
        })
      }
    >
      <img
        alt=""
        className="h-6 w-6 object-contain"
        draggable={false}
        src="/gold-bottle-cap.png"
      />
    </button>
  )
}
