import { TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
  h1: {
    fontFamily: 'Rajdhani_700Bold',
    fontSize: 32,
    letterSpacing: 2,
  },
  h2: {
    fontFamily: 'Rajdhani_700Bold',
    fontSize: 26,
    letterSpacing: 1.5,
  },
  h3: {
    fontFamily: 'Rajdhani_600SemiBold',
    fontSize: 20,
    letterSpacing: 1,
  },
  h4: {
    fontFamily: 'Rajdhani_600SemiBold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  score: {
    fontFamily: 'Rajdhani_700Bold',
    fontSize: 64,
    letterSpacing: 4,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  body_bold: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
};
