import type { enMetDateFixer } from './enMetDateFixer'

export const esMetDateFixer = {
  changedDates: 'Fechas cambiadas',
  current: 'Actual',
  dateFixerQueued: 'Fechas en cola',
  fixInvalidDates: 'Corregir fechas invalidas',
  includeParty: 'Incluir equipo',
  loading: 'Cargando...',
  metDateFixer: 'Fechas de captura',
  noDateSuggestions: 'No hay sugerencias de fecha',
  postGameEndDate: 'Fin postgame',
  preset: 'Preset',
  preview: 'Previsualizar',
  proposed: 'Propuesta',
  queueChanges: 'Poner en cola',
  queued: 'En cola',
  rewriteAllDates: 'Reescribir todo',
  startDate: 'Fecha de inicio',
  storyEndDate: 'Fin de historia',
  trainerDates: 'Fechas de entrenador',
  updateTrainerDates: 'Fechas de entrenador',
} satisfies Record<keyof typeof enMetDateFixer, string>
