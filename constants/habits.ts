export type HabitWeight = 'critical' | 'high' | 'medium' | 'low';

export interface HabitDefinition {
  id: string;
  name: string;
  description: string;
  weight: HabitWeight;
  points: number;
  scheduledTime: string;
  category: 'routine' | 'work' | 'fitness' | 'nutrition';
  icon: string;
}

export const HABITS: HabitDefinition[] = [
  {
    id: 'prospecting',
    name: 'Prospecção de Clientes',
    description: 'Prospecção ativa 14h–15h30 (Instagram, e-mail, DM direto)',
    weight: 'critical',
    points: 20,
    scheduledTime: '14:00',
    category: 'work',
    icon: 'briefcase-outline',
  },
  {
    id: 'gym',
    name: 'Academia / Calistenia',
    description: 'Treino completo executado, nenhuma série pulada',
    weight: 'critical',
    points: 20,
    scheduledTime: '15:30',
    category: 'fitness',
    icon: 'dumbbell',
  },
  {
    id: 'wake_up',
    name: 'Acordar às 06:00',
    description: 'Levantar da cama até 06:05, sem volta',
    weight: 'high',
    points: 10,
    scheduledTime: '06:00',
    category: 'routine',
    icon: 'alarm',
  },
  {
    id: 'class',
    name: 'Ir às Aulas',
    description: 'Comparecer e manter atenção nas aulas',
    weight: 'high',
    points: 10,
    scheduledTime: '07:00',
    category: 'routine',
    icon: 'school-outline',
  },
  {
    id: 'work_block2',
    name: 'Trabalho Bloco 2',
    description: 'Criação de site ou edição de vídeo 17h15–18h45',
    weight: 'high',
    points: 10,
    scheduledTime: '17:15',
    category: 'work',
    icon: 'monitor-edit',
  },
  {
    id: 'calorie_goal',
    name: 'Meta Calórica (3140 kcal)',
    description: 'Bater meta diária de calorias para o bulking',
    weight: 'high',
    points: 10,
    scheduledTime: '22:00',
    category: 'nutrition',
    icon: 'food-variant',
  },
  {
    id: 'reading',
    name: 'Leitura',
    description: 'Mínimo 30 minutos de leitura',
    weight: 'medium',
    points: 5,
    scheduledTime: '09:00',
    category: 'routine',
    icon: 'book-open-outline',
  },
  {
    id: 'screens_off',
    name: 'Desligar Telas às 22:30',
    description: 'Celular, PC e TV desligados pontualmente',
    weight: 'medium',
    points: 5,
    scheduledTime: '22:30',
    category: 'routine',
    icon: 'monitor-off',
  },
  {
    id: 'sleep',
    name: 'Dormir às 23:00',
    description: 'Na cama e dormindo até 23:00',
    weight: 'medium',
    points: 5,
    scheduledTime: '22:50',
    category: 'routine',
    icon: 'sleep',
  },
  {
    id: 'creatine',
    name: 'Creatina Pós-Treino',
    description: '2g de creatina após o treino',
    weight: 'low',
    points: 2,
    scheduledTime: '17:05',
    category: 'nutrition',
    icon: 'pill',
  },
  {
    id: 'breakfast',
    name: 'Café da Manhã Completo',
    description: '3 pães + 3 ovos + 200ml leite (~740 kcal)',
    weight: 'low',
    points: 2,
    scheduledTime: '06:05',
    category: 'nutrition',
    icon: 'egg-outline',
  },
];

export const TOTAL_POSSIBLE_POINTS = 99;
