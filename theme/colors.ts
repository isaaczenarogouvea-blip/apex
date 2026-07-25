export const Colors = {
  bg_primary: '#080808',
  bg_card: '#111111',
  bg_card_elevated: '#1A1A1A',
  bg_input: '#1E1E1E',

  gold: '#FFD700',
  gold_dim: '#B8960C',
  red: '#FF2D2D',
  red_dark: '#1A0000',
  green: '#00E676',
  green_dim: '#003D2B',
  orange: '#FF6B00',
  blue: '#4FC3F7',

  text_primary: '#F5F5F5',
  text_secondary: '#888888',
  text_muted: '#3A3A3A',
  text_inverse: '#080808',

  color_critical: '#FF2D2D',
  color_high: '#FF6B00',
  color_medium: '#4FC3F7',
  color_low: '#888888',

  color_elite: '#FFD700',
  color_good: '#00E676',
  color_average: '#FF6B00',
  color_bad: '#FF2D2D',

  tab_bar: '#0D0D0D',
  border: '#1E1E1E',
} as const;

export type ColorToken = keyof typeof Colors;
