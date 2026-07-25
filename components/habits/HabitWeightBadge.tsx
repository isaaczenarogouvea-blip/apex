import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { HabitWeight } from '../../constants/habits';

interface HabitWeightBadgeProps {
  weight: HabitWeight;
}

const WEIGHT_CONFIG: Record<HabitWeight, { color: string; label: string }> = {
  critical: { color: Colors.color_critical, label: 'CRÍTICO' },
  high: { color: Colors.color_high, label: 'ALTO' },
  medium: { color: Colors.color_medium, label: 'MÉDIO' },
  low: { color: Colors.color_low, label: 'BAIXO' },
};

export function HabitWeightBadge({ weight }: HabitWeightBadgeProps) {
  const config = WEIGHT_CONFIG[weight];

  return (
    <View style={[styles.badge, { backgroundColor: config.color + '20', borderColor: config.color }]}>
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  text: {
    ...Typography.label,
    fontSize: 9,
  },
});
