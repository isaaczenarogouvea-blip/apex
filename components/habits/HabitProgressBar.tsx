import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from '../common/ProgressBar';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { TOTAL_POSSIBLE_POINTS } from '../../constants/habits';

interface HabitProgressBarProps {
  pointsEarned: number;
}

export function HabitProgressBar({ pointsEarned }: HabitProgressBarProps) {
  const progress = pointsEarned / TOTAL_POSSIBLE_POINTS;
  const color =
    progress >= 0.9
      ? Colors.color_elite
      : progress >= 0.7
        ? Colors.color_good
        : progress >= 0.5
          ? Colors.color_average
          : Colors.color_bad;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>PROGRESSO DIÁRIO</Text>
        <Text style={[styles.points, { color }]}>
          {pointsEarned}/{TOTAL_POSSIBLE_POINTS}
        </Text>
      </View>
      <ProgressBar progress={progress} color={color} height={6} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  label: {
    ...Typography.label,
    color: Colors.text_secondary,
  },
  points: {
    ...Typography.body_bold,
  },
});
