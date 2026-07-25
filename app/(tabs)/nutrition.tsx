import { useCallback } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApexHeader } from '../../components/common/ApexHeader';
import { ApexCard } from '../../components/common/ApexCard';
import { SectionTitle } from '../../components/common/SectionTitle';
import { CalorieRing } from '../../components/nutrition/CalorieRing';
import { MealRow } from '../../components/nutrition/MealRow';
import { WeightEntry } from '../../components/nutrition/WeightEntry';
import { BulkingProgressBar } from '../../components/nutrition/BulkingProgressBar';
import { useNutrition } from '../../lib/hooks/useNutrition';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';

export default function NutritionScreen() {
  const {
    meals,
    mealLogs,
    toggleMeal,
    loadMeals,
    totalCalories,
    totalProtein,
    weightHistory,
    logWeight,
    loadWeightHistory,
  } = useNutrition();

  useFocusEffect(
    useCallback(() => {
      loadMeals();
      loadWeightHistory();
    }, [])
  );

  const latestWeight = weightHistory.length > 0 ? weightHistory[0].weightKg : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ApexHeader title="NUTRIÇÃO" subtitle="BULKING — 3140 KCAL/DIA" />

        <View style={styles.content}>
          <ApexCard>
            <View style={styles.ringCenter}>
              <CalorieRing consumed={totalCalories} />
            </View>
          </ApexCard>

          <BulkingProgressBar latestWeight={latestWeight} />

          <SectionTitle title="REFEIÇÕES" rightText={`${Object.values(mealLogs).filter(Boolean).length}/${meals.length}`} />
          <ApexCard noPadding>
            {meals.map((meal) => (
              <MealRow
                key={meal.id}
                meal={meal}
                eaten={mealLogs[meal.id] ?? false}
                onToggle={toggleMeal}
              />
            ))}
          </ApexCard>

          <SectionTitle title="REGISTRO DE PESO" />
          <WeightEntry currentWeight={latestWeight} onSave={logWeight} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg_primary,
  },
  content: {
    paddingHorizontal: Spacing.screen_horizontal,
    paddingBottom: Spacing.xxxl,
  },
  ringCenter: {
    alignItems: 'center',
    paddingVertical: Spacing.base,
  },
});
