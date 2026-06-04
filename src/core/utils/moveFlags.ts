import type { MoveDetail } from '../types/index'

export type MoveFlag =
  | 'moveFlagAuthentic'
  | 'moveFlagBallistics'
  | 'moveFlagBite'
  | 'moveFlagCharge'
  | 'moveFlagContact'
  | 'moveFlagDance'
  | 'moveFlagDefrost'
  | 'moveFlagDistance'
  | 'moveFlagGravity'
  | 'moveFlagHeal'
  | 'moveFlagMental'
  | 'moveFlagMirror'
  | 'moveFlagNonSkyBattle'
  | 'moveFlagPowder'
  | 'moveFlagProtect'
  | 'moveFlagPulse'
  | 'moveFlagPunch'
  | 'moveFlagRecharge'
  | 'moveFlagReflectable'
  | 'moveFlagSlicing'
  | 'moveFlagSnatch'
  | 'moveFlagSound'
  | 'moveFlagWind'

export const MOVE_FLAGS: Array<{ flag: string; labelKey: MoveFlag }> = [
  { flag: 'protect', labelKey: 'moveFlagProtect' },
  { flag: 'contact', labelKey: 'moveFlagContact' },
  { flag: 'reflectable', labelKey: 'moveFlagReflectable' },
  { flag: 'mirror', labelKey: 'moveFlagMirror' },
  { flag: 'snatch', labelKey: 'moveFlagSnatch' },
  { flag: 'punch', labelKey: 'moveFlagPunch' },
  { flag: 'sound', labelKey: 'moveFlagSound' },
  { flag: 'slicing', labelKey: 'moveFlagSlicing' },
  { flag: 'wind', labelKey: 'moveFlagWind' },
  { flag: 'dance', labelKey: 'moveFlagDance' },
  { flag: 'heal', labelKey: 'moveFlagHeal' },
  { flag: 'charge', labelKey: 'moveFlagCharge' },
  { flag: 'recharge', labelKey: 'moveFlagRecharge' },
  { flag: 'defrost', labelKey: 'moveFlagDefrost' },
  { flag: 'gravity', labelKey: 'moveFlagGravity' },
  { flag: 'powder', labelKey: 'moveFlagPowder' },
  { flag: 'pulse', labelKey: 'moveFlagPulse' },
  { flag: 'bite', labelKey: 'moveFlagBite' },
  { flag: 'ballistics', labelKey: 'moveFlagBallistics' },
  { flag: 'mental', labelKey: 'moveFlagMental' },
  { flag: 'authentic', labelKey: 'moveFlagAuthentic' },
  { flag: 'distance', labelKey: 'moveFlagDistance' },
  { flag: 'non-sky-battle', labelKey: 'moveFlagNonSkyBattle' },
]

export function getActiveFlags(detail: MoveDetail) {
  const interactions = detail.current.interactions
  const richFlags = new Set<string>()

  if (interactions.protectDetect === 'blocked') richFlags.add('protect')
  if (interactions.substitute === 'bypasses-substitute')
    richFlags.add('authentic')
  if (interactions.contact === true) richFlags.add('contact')
  if (interactions.magicCoat === true) richFlags.add('reflectable')
  if (interactions.mirrorMove === true) richFlags.add('mirror')
  if (interactions.snatch === true) richFlags.add('snatch')
  for (const flag of [
    'sound',
    'punch',
    'slicing',
    'wind',
    'dance',
    'heal',
    'charge',
    'recharge',
    'defrost',
    'gravity',
    'powder',
    'pulse',
    'bite',
    'bullet',
  ] as const) {
    if (interactions[flag] === true) richFlags.add(flag)
  }

  return MOVE_FLAGS.filter((flag) => richFlags.has(flag.flag))
}
