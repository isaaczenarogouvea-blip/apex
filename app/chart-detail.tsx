import { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ApexHeader } from '../components/common/ApexHeader';
import { ApexCard } from '../components/common/ApexCard';
import { ApexButton } from '../components/common/ApexButton';
import { ConsistencyChart } from '../components/chart/ConsistencyChart';
import { MonthTabBar } from '../components/chart/MonthTabBar';
import { getDatabase } from '../lib/db/database';
import { getScoresForRange } from '../lib/db/scoreRepository';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { format, startOfMonth, endOfMonth, subMonths, getDaysInMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ChartDetailScreen() {
  const router = useRouter();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [chartData, setChartData] = useState<Array<{ date: string; day: number; scorePercent: number; dayStatus: string }>>([]);
  const [averageScore, setAverageScore] = useState(0);

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(new Date(), i);
    return {
      key: format(d, 'yyyy-MM'),
      label: format(d, 'MMM yyyy', { locale: ptBR }).toUpperCase(),
      date: d,
    };
  });

  const loadData = useCallback(async () => {
    try {
      const db = await getDatabase();
      const month = months[selectedMonthIndex];
      const start = format(startOfMonth(month.date), 'yyyy-MM-dd');
      const end = format(endOfMonth(month.date), 'yyyy-MM-dd');
      const scores = await getScoresForRange(db, start, end);

      const daysInMonth = getDaysInMonth(month.date);
      const data = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dateStr = `${month.key}-${String(day).padStart(2, '0')}`;
        const score = scores.find((s: { date: string }) => s.date === dateStr);
        return {
          date: dateStr,
          day,
          scorePercent: score?.scorePercent ?? 0,
          dayStatus: score?.dayStatus ?? 'pending',
        };
      });

      setChartData(data);

      const scored = data.filter((d) => d.scorePercent > 0);
      const avg = scored.length > 0 ? scored.reduce((s, d) => s + d.scorePercent, 0) / scored.length : 0;
      setAverageScore(avg);
    } catch (error) {
      console.error('Failed to load chart data:', error);
    }
  }, [selectedMonthIndex]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const eliteDays = chartData.filter((d) => d.dayStatus === 'elite').length;
  const goodDays = chartData.filter((d) => d.dayStatus === 'good').length;
  const badDays = chartData.filter((d) => d.dayStatus === 'bad').length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <ApexButton title="VOLTAR" onPress={() => router.back()} variant="ghost" compact />
        </View>
        <ApexHeader title="CONSISTÊNCIA" subtitle="HISTÓRICO MENSAL DE PERFORMANCE" />

        <MonthTabBar
          months={months.map((m) => m.label)}
          selectedMonth={months[selectedMonthIndex].label}
          onSelect={(label) => {
            const idx = months.findIndex((m) => m.label === label);
            if (idx >= 0) setSelectedMonthIndex(idx);
          }}
        />

        <View style={styles.content}>
          <ApexCard>
            <ConsistencyChart data={chartData} />
          </ApexCard>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: Colors.gold }]}>{Math.round(averageScore)}%</Text>
              <Text style={styles.statLabel}>MÉDIA</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: Colors.color_elite }]}>{eliteDays}</Text>
              <Text style={styles.statLabel}>ELITE</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: Colors.color_good }]}>{goodDays}</Text>
              <Text style={styles.statLabel}>BONS</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: Colors.color_bad }]}>{badDays}</Text>
              <Text style={styles.statLabel}>RUINS</Text>
            </View>
          </View>
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
  topBar: {
    paddingHorizontal: Spacing.screen_horizontal,
    paddingTop: Spacing.md,
    alignItems: 'flex-start',
  },
  content: {
    paddingHorizontal: Spacing.screen_horizontal,
    paddingBottom: Spacing.xxxl,
    marginTop: Spacing.base,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.base,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...Typography.h2,
  },
  statLabel: {
    ...Typography.label,
    color: Colors.text_secondary,
    fontSize: 9,
  },
});
