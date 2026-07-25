export const DAILY_CALORIE_GOAL = 3140;
export const DAILY_PROTEIN_GOAL = 180;
export const CURRENT_WEIGHT_KG = 53;
export const TARGET_WEIGHT_KG = 60;

export interface PresetMeal {
  id: string;
  name: string;
  time: string;
  kcal: number;
  protein: number;
  items: string[];
}

export const PRESET_MEALS: PresetMeal[] = [
  {
    id: 'breakfast',
    name: 'Café da Manhã',
    time: '06:00',
    kcal: 740,
    protein: 25,
    items: ['3 pães', '3 ovos', '200ml leite'],
  },
  {
    id: 'lunch',
    name: 'Almoço',
    time: '13:00',
    kcal: 690,
    protein: 42,
    items: ['Arroz', 'Feijão', 'Frango', 'Legumes', 'Azeite'],
  },
  {
    id: 'pre_workout',
    name: 'Pré-Treino',
    time: '14:00',
    kcal: 354,
    protein: 8,
    items: ['2 pães', '1 maçã'],
  },
  {
    id: 'post_workout',
    name: 'Pós-Treino',
    time: '17:00',
    kcal: 211,
    protein: 10,
    items: ['200ml leite', '1 banana', '2g creatina'],
  },
  {
    id: 'dinner',
    name: 'Jantar',
    time: '19:50',
    kcal: 690,
    protein: 42,
    items: ['Arroz', 'Feijão', 'Frango', 'Legumes', 'Azeite'],
  },
  {
    id: 'supper',
    name: 'Ceia',
    time: '22:00',
    kcal: 275,
    protein: 17,
    items: ['200ml leite', '2 ovos'],
  },
];

export const TOTAL_PRESET_CALORIES = PRESET_MEALS.reduce((sum, m) => sum + m.kcal, 0);
export const TOTAL_PRESET_PROTEIN = PRESET_MEALS.reduce((sum, m) => sum + m.protein, 0);
