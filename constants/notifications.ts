export interface ScheduledNotification {
  id: string;
  time: string;
  title: string;
  body: string;
}

export const SCHEDULED_NOTIFICATIONS: ScheduledNotification[] = [
  {
    id: 'wake',
    time: '06:00',
    title: '⚔️ DESPERTAR',
    body: 'LEVANTA! AGORA! VOCÊ TEM OBJETIVOS OU VEIO AQUI DORMIR A VIDA TODA, COVARDE?',
  },
  {
    id: 'breakfast',
    time: '06:05',
    title: '🍳 CAFÉ DA MANHÃ',
    body: 'COMBUSTÍVEL PRIMEIRO. 3 OVOS, 3 PÃES, LEITE. EXECUTE.',
  },
  {
    id: 'reading',
    time: '09:00',
    title: '📖 LEITURA',
    body: 'ABRE O LIVRO, SOLDADO. QUEM NÃO APRENDE FICA PARA TRÁS.',
  },
  {
    id: 'prospecting',
    time: '14:00',
    title: '💼 PROSPECÇÃO — COMEÇA AGORA',
    body: 'SENTA E PROSPECTA. VOCÊ NÃO VAI FATURAR OLHANDO PRA PAREDE. 1H30 DE FOCO TOTAL.',
  },
  {
    id: 'prospecting_end',
    time: '15:25',
    title: '⏰ PROSPECÇÃO — 5 MINUTOS',
    body: '5 MINUTOS. NÃO PARA ANTES DO TEMPO, COVARDE.',
  },
  {
    id: 'gym',
    time: '15:30',
    title: '🏋️ ACADEMIA',
    body: 'TREINO AGORA. SEU CORPO NÃO VAI MUDAR SOZINHO ENQUANTO VOCÊ PROCRASTINA. EXECUTA.',
  },
  {
    id: 'creatine',
    time: '17:05',
    title: '💊 CREATINA',
    body: '2G DE CREATINA. NÃO ESTRAGUE O TREINO COM PREGUIÇA.',
  },
  {
    id: 'work_block2',
    time: '17:15',
    title: '💻 TRABALHO BLOCO 2',
    body: 'SITE OU VÍDEO. QUEM NÃO PRODUZ NÃO VENDE. VAI LASCAR.',
  },
  {
    id: 'calorie_check',
    time: '21:00',
    title: '🍽️ CHEQUE SUAS CALORIAS',
    body: 'VOCÊ VAI FICAR NOS 53KG PARA SEMPRE SE NÃO COMER DIREITO. CONFERE O APP.',
  },
  {
    id: 'supper',
    time: '22:00',
    title: '🥛 CEIA',
    body: 'ÚLTIMA REFEIÇÃO. FECHA O DIA COM DIGNIDADE.',
  },
  {
    id: 'screens_off',
    time: '22:30',
    title: '📵 TELAS DESLIGADAS',
    body: 'ISSO É UMA ORDEM. DESLIGA AGORA, SOLDADO.',
  },
  {
    id: 'sleep',
    time: '22:50',
    title: '😴 DORMIR',
    body: 'NA CAMA. AMANHÃ TEM GUERRA. DESCANSA AGORA.',
  },
];

export type DayStatus = 'elite' | 'good' | 'average' | 'bad';

export const END_OF_DAY_MESSAGES: Record<DayStatus, string> = {
  elite: '⭐ DIA DE ELITE. VOCÊ MERECEU. REPETE ISSO AMANHÃ.',
  good: '✅ BOM DIA. PODIA SER MELHOR. AMANHÃ MAIS FORTE.',
  average: '⚠️ DIA MEDÍOCRE. VOCÊ PODE MAIS QUE ISSO.',
  bad: '❌ DIA DESTRUÍDO. PUNIÇÃO ATIVADA. PREPARE-SE.',
};
