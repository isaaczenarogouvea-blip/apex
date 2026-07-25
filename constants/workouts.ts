export interface Exercise {
  id: string;
  name: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  restSeconds: number;
  toFailure: boolean;
  notes?: string;
}

export interface WorkoutDay {
  id: string;
  label: string;
  focus: string;
  exercises: Exercise[];
}

export const WORKOUTS: WorkoutDay[] = [
  {
    id: 'A',
    label: 'TREINO A',
    focus: 'Costas Largura + Bíceps + Antebraço',
    exercises: [
      { id: 'A1', name: 'Puxada Aberta Pronada', sets: 4, repsMin: 8, repsMax: 10, restSeconds: 120, toFailure: false, notes: 'Pegada bem larga' },
      { id: 'A2', name: 'Pulldown Unilateral Neutro', sets: 4, repsMin: 10, repsMax: 12, restSeconds: 90, toFailure: false, notes: 'Foco no lat' },
      { id: 'A3', name: 'Puxada Supinada Fechada', sets: 3, repsMin: 8, repsMax: 10, restSeconds: 120, toFailure: false, notes: 'Espessura' },
      { id: 'A4', name: 'Remada Baixa Triângulo', sets: 3, repsMin: 8, repsMax: 10, restSeconds: 120, toFailure: false },
      { id: 'A5', name: 'Rosca Direta Barra Reta', sets: 3, repsMin: 6, repsMax: 8, restSeconds: 120, toFailure: false },
      { id: 'A6', name: 'Rosca Martelo Halteres', sets: 3, repsMin: 8, repsMax: 10, restSeconds: 90, toFailure: false },
      { id: 'A7', name: 'Rosca de Punho Flexor', sets: 4, repsMin: 12, repsMax: 15, restSeconds: 60, toFailure: true },
      { id: 'A8', name: 'Rosca de Punho Invertida', sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60, toFailure: true },
    ],
  },
  {
    id: 'B',
    label: 'TREINO B',
    focus: 'Peito + Deltoide Lateral + Tríceps',
    exercises: [
      { id: 'B1', name: 'Supino Inclinado Halteres', sets: 4, repsMin: 6, repsMax: 8, restSeconds: 150, toFailure: false },
      { id: 'B2', name: 'Peck Deck Voador', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90, toFailure: false },
      { id: 'B3', name: 'Elevação Lateral Halteres', sets: 4, repsMin: 12, repsMax: 15, restSeconds: 90, toFailure: true },
      { id: 'B4', name: 'Elevação Lateral Cabo Unilat.', sets: 4, repsMin: 12, repsMax: 15, restSeconds: 90, toFailure: true },
      { id: 'B5', name: 'Desenvolvimento Halteres', sets: 3, repsMin: 8, repsMax: 10, restSeconds: 120, toFailure: false },
      { id: 'B6', name: 'Tríceps Francês Polia', sets: 3, repsMin: 8, repsMax: 10, restSeconds: 120, toFailure: false },
      { id: 'B7', name: 'Tríceps Pulley Corda', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90, toFailure: true },
    ],
  },
  {
    id: 'C',
    label: 'TREINO C',
    focus: 'Pernas + Panturrilha (Sessão 1)',
    exercises: [
      { id: 'C1', name: 'Agachamento Livre', sets: 4, repsMin: 6, repsMax: 8, restSeconds: 180, toFailure: false },
      { id: 'C2', name: 'Leg Press 45°', sets: 4, repsMin: 8, repsMax: 10, restSeconds: 150, toFailure: false },
      { id: 'C3', name: 'Cadeira Extensora', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 120, toFailure: true },
      { id: 'C4', name: 'Mesa Flexora / Stiff Halt.', sets: 4, repsMin: 8, repsMax: 10, restSeconds: 120, toFailure: false },
      { id: 'C5', name: 'Panturrilha em Pé', sets: 5, repsMin: 12, repsMax: 15, restSeconds: 90, toFailure: true },
      { id: 'C6', name: 'Panturrilha Sentada Sóleo', sets: 4, repsMin: 15, repsMax: 20, restSeconds: 60, toFailure: true },
    ],
  },
  {
    id: 'D',
    label: 'TREINO D',
    focus: 'Costas Espessura + Ombro Post. + Antebraço + Panturrilha',
    exercises: [
      { id: 'D1', name: 'Remada Curvada Supinada', sets: 4, repsMin: 6, repsMax: 8, restSeconds: 150, toFailure: false },
      { id: 'D2', name: 'Remada Cavalinho T-Bar', sets: 3, repsMin: 8, repsMax: 10, restSeconds: 120, toFailure: false },
      { id: 'D3', name: 'Face Pull Polia Alta', sets: 4, repsMin: 12, repsMax: 15, restSeconds: 120, toFailure: true, notes: 'Deltoide posterior' },
      { id: 'D4', name: 'Elevação Lateral Máquina', sets: 4, repsMin: 12, repsMax: 15, restSeconds: 90, toFailure: true },
      { id: 'D5', name: 'Rosca Inversa Barra W', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90, toFailure: false },
      { id: 'D6', name: 'Panturrilha em Pé 2ª Sessão', sets: 5, repsMin: 12, repsMax: 15, restSeconds: 90, toFailure: true },
      { id: 'D7', name: 'Prancha Abdominal', sets: 3, repsMin: 1, repsMax: 1, restSeconds: 60, toFailure: true, notes: 'Registrar tempo em segundos' },
    ],
  },
];
