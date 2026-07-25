import { useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApexHeader } from '../../components/common/ApexHeader';
import { ApexCard } from '../../components/common/ApexCard';
import { SectionTitle } from '../../components/common/SectionTitle';
import { DailyScoreRing } from '../../components/dashboard/DailyScoreRing';
import { StreakCard } from '../../components/dashboard/StreakCard';
import { QuickHabitRow } from '../../components/dashboard/QuickHabitRow';
import { MiniWeekChart } from '../../components/dashboard/MiniWeekChart';
import { PunishmentBanner } from '../../components/punishment/PunishmentBanner';
import { useHabits } from '../../lib/hooks/useHabits';
import { useScore } from '../../lib/hooks/useScore';
import { useStreak } from '../../lib/hooks/useStreak';
import { usePunishment } from '../../lib/hooks/usePunishment';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DashboardScreen() {
  const { habits, habitLogs, toggleHabit, loadHabits } = useHabits();
  const { score, loadScore, weekScores, loadWeekScores } = useScore();
  const { currentStreak, bestStreak, loadStreak } = useStreak();
  const { activePunishments, loadPunishments } = usePunishment();

  useFocusEffect(
    useCallback(() => {
      loadHabits();
      loadScore();
      loadWeekScores();
      loadStreak();
      loadPunishments();
    }, [])
  );

  const today = new Date();
  const dateLabel = format(today, "EEEE, dd 'de' MMMM", { locale: ptBR });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <ApexHeader title="APEX" subtitle={dateLabel.toUpperCase()} />

        <View style={styles.content}>
          {activePunishments.map((p) => (
            <PunishmentBanner
              key={p.id}
              label={p.label}
              dueDate={p.dueDate}
              punishmentId={p.id}
            />
          ))}

          <ApexCard>
            <View style={styles.scoreCenter}>
              <DailyScoreRing
                scorePercent={score?.scorePercent ?? 0}
                dayStatus={score?.dayStatus ?? 'pending'}
              />
            </View>
          </ApexCard>

          <StreakCard currentStreak={currentStreak} bestStreak={bestStreak} />

          <SectionTitle title="HÁBITOS DE HOJE" rightText={`${Object.values(habitLogs).filter(Boolean).length}/${habits.length}`} />
          <ApexCard noPadding>
            {habits.map((habit) => (
              <QuickHabitRow
                key={habit.id}
                habit={habit}
                completed={habitLogs[habit.id] ?? false}
                onToggle={toggleHabit}
              />
            ))}
          </ApexCard>

          <SectionTitle title="ÚLTIMOS 7 DIAS" />
          <ApexCard>
            <MiniWeekChart weekScores={weekScores} />
          </ApexCard>
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.screen_horizontal,
    paddingBottom: Spacing.xxxl,
  },
  scoreCenter: {
    alignItems: 'center',
    paddingVertical: Spacing.base,
  },
});
