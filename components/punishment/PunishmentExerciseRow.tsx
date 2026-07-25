import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { PunishmentExercise } from '../../constants/punishments';

interface PunishmentExerciseRowProps {
  exercise: PunishmentExercise;
  completed: boolean;
  onToggle: () => void;
}

export function PunishmentExerciseRow({ exercise, completed, onToggle }: PunishmentExerciseRowProps) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        onToggle();
      }}
      style={[styles.container, completed && styles.completedContainer]}
    >
      <MaterialCommunityIcons
        name={completed ? 'check-circle' : 'circle-outline'}
        size={28}
        color={completed ? Colors.green : Colors.red}
      />
      <View style={styles.info}>
        <Text style={[styles.name, completed && styles.completedText]}>
          {exercise.name}
        </Text>
        <Text style={styles.reps}>
          {exercise.reps} {exercise.unit}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
    minHeight: 44,
  },
  completedContainer: {
    opacity: 0.6,
  },
  info: {
    flex: 1,
  },
  name: {
    ...Typography.h4,
    color: Colors.red,
  },
  completedText: {
    color: Colors.text_secondary,
    textDecorationLine: 'line-through',
  },
  reps: {
    ...Typography.body_bold,
    color: Colors.text_primary,
  },
});
