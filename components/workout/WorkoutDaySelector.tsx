import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { WORKOUTS } from '../../constants/workouts';

interface WorkoutDaySelectorProps {
  selectedDay: string;
  onSelect: (dayId: string) => void;
}

export function WorkoutDaySelector({ selectedDay, onSelect }: WorkoutDaySelectorProps) {
  return (
    <View style={styles.container}>
      {WORKOUTS.map((day) => {
        const isActive = selectedDay === day.id;
        return (
          <Pressable
            key={day.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(day.id);
            }}
            style={[styles.pill, isActive && styles.pillActive]}
          >
            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
              {day.id}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.screen_horizontal,
    marginBottom: Spacing.base,
  },
  pill: {
    flex: 1,
    minHeight: 44,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.card_radius,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.bg_card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  pillText: {
    ...Typography.h3,
    color: Colors.text_secondary,
  },
  pillTextActive: {
    color: Colors.text_inverse,
  },
});
