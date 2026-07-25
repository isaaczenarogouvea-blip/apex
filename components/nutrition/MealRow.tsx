import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { PresetMeal } from '../../constants/meals';

interface MealRowProps {
  meal: PresetMeal;
  eaten: boolean;
  onToggle: (mealId: string, eaten: boolean) => void;
}

export function MealRow({ meal, eaten, onToggle }: MealRowProps) {
  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle(meal.id, !eaten);
  };

  return (
    <Pressable onPress={handleToggle} style={[styles.container, eaten && styles.eatenContainer]}>
      <View style={styles.left}>
        <Text style={styles.time}>{meal.time}</Text>
        <View style={styles.info}>
          <Text style={[styles.name, eaten && styles.eatenText]}>{meal.name}</Text>
          <Text style={styles.items}>{meal.items.join(', ')}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <View style={styles.macros}>
          <Text style={styles.kcal}>{meal.kcal} kcal</Text>
          <Text style={styles.protein}>{meal.protein}g prot</Text>
        </View>
        <MaterialCommunityIcons
          name={eaten ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
          size={28}
          color={eaten ? Colors.green : Colors.text_muted}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    minHeight: 44,
  },
  eatenContainer: {
    backgroundColor: Colors.green_dim + '30',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  time: {
    ...Typography.caption,
    color: Colors.text_muted,
    width: 40,
  },
  info: {
    flex: 1,
  },
  name: {
    ...Typography.body_bold,
    color: Colors.text_primary,
  },
  eatenText: {
    textDecorationLine: 'line-through',
    color: Colors.text_secondary,
  },
  items: {
    ...Typography.caption,
    color: Colors.text_secondary,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  macros: {
    alignItems: 'flex-end',
  },
  kcal: {
    ...Typography.body_bold,
    color: Colors.orange,
    fontSize: 12,
  },
  protein: {
    ...Typography.caption,
    color: Colors.blue,
    fontSize: 10,
  },
});
