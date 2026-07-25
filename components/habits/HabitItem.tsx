import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ApexCard } from '../common/ApexCard';
import { HabitWeightBadge } from './HabitWeightBadge';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { HabitDefinition, HabitWeight } from '../../constants/habits';

interface HabitItemProps {
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

export function HabitItem({ habit, completed, onToggle }: HabitItemProps) {
  const weightColor = getWeightColor(habit.weight);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggle(habit.id, !completed);
  };

  return (
    <ApexCard
      style={completed ? { borderColor: Colors.green_dim, backgroundColor: Colors.green_dim + '30' } : undefined}
    >
      <Pressable onPress={handleToggle} style={styles.pressable}>
        <View style={styles.topRow}>
          <View style={styles.left}>
            <MaterialCommunityIcons
              name={habit.icon as keyof typeof MaterialCommunityIcons.glyphMap}
              size={24}
              color={completed ? Colors.green : weightColor}
            />
            <View style={styles.textCol}>
              <Text
                style={[styles.name, completed && styles.completedName]}
                numberOfLines={1}
              >
                {habit.name}
              </Text>
              <Text style={styles.time}>{habit.scheduledTime}</Text>
            </View>
          </View>
          <View style={styles.right}>
            <HabitWeightBadge weight={habit.weight} />
            <MaterialCommunityIcons
              name={completed ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
              size={28}
              color={completed ? Colors.green : Colors.text_muted}
            />
          </View>
        </View>
        <Text style={styles.description}>{habit.description}</Text>
        <View style={styles.pointsRow}>
          <Text style={[styles.points, { color: weightColor }]}>+{habit.points} pts</Text>
        </View>
      </Pressable>
    </ApexCard>
  );
}

const styles = StyleSheet.create({
  pressable: {
    minHeight: 44,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  textCol: {
    flex: 1,
  },
  name: {
    ...Typography.h4,
    color: Colors.text_primary,
  },
  completedName: {
    color: Colors.text_secondary,
    textDecorationLine: 'line-through',
  },
  time: {
    ...Typography.caption,
    color: Colors.text_secondary,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  description: {
    ...Typography.caption,
    color: Colors.text_secondary,
    marginTop: Spacing.sm,
  },
  pointsRow: {
    marginTop: Spacing.sm,
  },
  points: {
    ...Typography.body_bold,
    fontSize: 12,
  },
});
