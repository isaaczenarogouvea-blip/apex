import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { HabitDefinition, HabitWeight } from '../../constants/habits';

interface QuickHabitRowProps {
  habit: HabitDefinition;
  completed: boolean;
  onToggle: (habitId: string, completed: boolean) => void;
}

function getWeightColor(weight: HabitWeight): string {
  switch (weight) {
    case 'critical': return Colors.color_critical;
    case 'high': return Colors.color_high;
    case 'medium': return Colors.color_medium;
    case 'low': return Colors.color_low;
  }
}

export function QuickHabitRow({ habit, completed, onToggle }: QuickHabitRowProps) {
  const weightColor = getWeightColor(habit.weight);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(habit.id, !completed);
  };

  return (
    <Pressable onPress={handleToggle} style={styles.container}>
      <View style={[styles.weightBar, { backgroundColor: weightColor }]} />
      <MaterialCommunityIcons
        name={habit.icon as keyof typeof MaterialCommunityIcons.glyphMap}
        size={20}
        color={completed ? Colors.green : Colors.text_secondary}
        style={styles.icon}
      />
      <Text
        style={[styles.name, completed && styles.completedText]}
        numberOfLines={1}
      >
        {habit.name}
      </Text>
      <View style={styles.right}>
        <Text style={[styles.points, { color: weightColor }]}>+{habit.points}</Text>
        <MaterialCommunityIcons
          name={completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
          size={24}
          color={completed ? Colors.green : Colors.text_muted}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingVertical: Spacing.sm,
    paddingRight: Spacing.base,
  },
  weightBar: {
    width: 3,
    height: 32,
    borderRadius: 2,
    marginRight: Spacing.md,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  name: {
    ...Typography.body,
    color: Colors.text_primary,
    flex: 1,
  },
  completedText: {
    color: Colors.text_secondary,
    textDecorationLine: 'line-through',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  points: {
    ...Typography.caption,
    fontFamily: 'Rajdhani_700Bold',
  },
});
