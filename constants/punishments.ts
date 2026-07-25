import { HabitWeight } from './habits';

export const FAILURE_WEIGHT_MAP: Record<HabitWeight, number> = {
  critical: 3,
  high: 1,
  medium: 1,
  low: 0.5,
};

export interface PunishmentExercise {
  name: string;
  reps: number;
  unit: 'reps' | 'km';
}

export interface PunishmentLevel {
  minWeightedFailures: number;
  maxWeightedFailures: number | null;
  label: string;
  level: number;
  exercises: PunishmentExercise[];
  shameMessage: string;
}

export const PUNISHMENT_TABLE: PunishmentLevel[] = [
  {
    minWeightedFailures: 0,
    maxWeightedFailures: 2,
    label: 'ALERTA',
    level: 0,
    exercises: [],
    shameMessage:
      'VOCÊ FALHOU. SEM PUNIÇÃO FÍSICA HOJE. MAS ISSO TEM UM CUSTO NO SEU SCORE.',
  },
  {
    minWeightedFailures: 3,
    maxWeightedFailures: 3,
    label: 'PUNIÇÃO NÍVEL 1',
    level: 1,
    exercises: [{ name: 'Flexões', reps: 100, unit: 'reps' }],
    shameMessage:
      'FALHOU 3 VEZES. AMANHÃ: 100 FLEXÕES. SEM DESCULPA, SOLDADO.',
  },
  {
    minWeightedFailures: 4,
    maxWeightedFailures: 4,
    label: 'PUNIÇÃO NÍVEL 2',
    level: 2,
    exercises: [
      { name: 'Flexões', reps: 120, unit: 'reps' },
      { name: 'Agachamentos', reps: 60, unit: 'reps' },
    ],
    shameMessage:
      'PATÉTICO. 4 FALHAS. AMANHÃ: 120 FLEXÕES + 60 AGACHAMENTOS. ISSO É UMA ORDEM.',
  },
  {
    minWeightedFailures: 5,
    maxWeightedFailures: 5,
    label: 'PUNIÇÃO NÍVEL 3',
    level: 3,
    exercises: [
      { name: 'Flexões', reps: 150, unit: 'reps' },
      { name: 'Agachamentos', reps: 80, unit: 'reps' },
      { name: 'Burpees', reps: 40, unit: 'reps' },
    ],
    shameMessage:
      '5 FALHAS. VOCÊ DESTRUIU O DIA. AMANHÃ: 150 FLEX + 80 AGACH + 40 BURPEES. SEM NEGOCIAÇÃO.',
  },
  {
    minWeightedFailures: 6,
    maxWeightedFailures: null,
    label: 'PUNIÇÃO MÁXIMA',
    level: 4,
    exercises: [
      { name: 'Flexões', reps: 200, unit: 'reps' },
      { name: 'Agachamentos', reps: 100, unit: 'reps' },
      { name: 'Burpees', reps: 60, unit: 'reps' },
      { name: 'Corrida', reps: 3, unit: 'km' },
    ],
    shameMessage:
      'VOCÊ É UMA VERGONHA HOJE. PUNIÇÃO MÁXIMA ATIVADA. AMANHÃ VOCÊ VAI SENTIR NA PELE.',
  },
];

export const SHAME_STREAK_THRESHOLD = 3;
export const SHAME_SCORE_THRESHOLD = 50;

export function getPunishmentForFailures(weightedFailures: number): PunishmentLevel {
  for (let i = PUNISHMENT_TABLE.length - 1; i >= 0; i--) {
    const level = PUNISHMENT_TABLE[i];
    if (weightedFailures >= level.minWeightedFailures) {
      return level;
    }
  }
  return PUNISHMENT_TABLE[0];
}
