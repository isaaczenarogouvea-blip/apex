import { useCallback } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApexHeader } from '../../components/common/ApexHeader';
import { HabitItem } from '../../components/habits/HabitItem';
import { HabitProgressBar } from '../../components/habits/HabitProgressBar';
import { useHabits } from '../../lib/hooks/useHabits';
import { useScore } from '../../lib/hooks/useScore';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { HabitDefinition } from '../../constants/habits';

export default function HabitsScreen() {
  const { habits, habitLogs, toggleHabit, loadHabits } = useHabits();
  const { score, loadScore } = useScore();

  useFocusEffect(
    useCallback(() => {
      loadHabits();
      loadScore();
    }, [])
  );

  const renderItem = ({ item }: { item: HabitDefinition }) => (
    <HabitItem
      habit={item}
      completed={habitLogs[item.id] ?? false}
      onToggle={toggleHabit}
    />
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ApexHeader title="HÁBITOS" subtitle="MARQUE CADA HÁBITO COMPLETADO" />
      <View style={styles.progressContainer}>
        <HabitProgressBar pointsEarned={score?.pointsEarned ?? 0} />
      </View>
      <FlatList
        data={habits}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg_primary,
  },
  progressContainer: {
    paddingHorizontal: Spacing.screen_horizontal,
  },
  list: {
    paddingHorizontal: Spacing.screen_horizontal,
    paddingBottom: Spacing.xxxl,
  },
});
