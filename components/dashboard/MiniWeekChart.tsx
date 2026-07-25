import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DayScore {
  date: string;
  scorePercent: number;
  dayStatus: string;
}

interface MiniWeekChartProps {
  weekScores: DayScore[];
}

function getBarColor(status: string): string {
  switch (status) {
    case 'elite': return Colors.color_elite;
    case 'good': return Colors.color_good;
    case 'average': return Colors.color_average;
    case 'bad': return Colors.color_bad;
    default: return Colors.text_muted;
  }
}

export function MiniWeekChart({ weekScores }: MiniWeekChartProps) {
  const router = useRouter();
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const score = weekScores.find((s) => s.date === dateStr);
    return {
      label: format(date, 'EEE', { locale: ptBR }).substring(0, 3).toUpperCase(),
      dateStr,
      score: score?.scorePercent ?? 0,
      status: score?.dayStatus ?? 'pending',
    };
  });

  return (
    <Pressable onPress={() => router.push('/chart-detail')} style={styles.container}>
      <View style={styles.barsRow}>
        {days.map((day) => (
          <View key={day.dateStr} style={styles.barCol}>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    height: `${Math.max(day.score, 3)}%`,
                    backgroundColor: getBarColor(day.status),
                  },
                ]}
              />
            </View>
            <Text style={styles.dayLabel}>{day.label}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 44,
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    width: 20,
    height: 60,
    backgroundColor: Colors.bg_input,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  dayLabel: {
    ...Typography.caption,
    color: Colors.text_muted,
    fontSize: 9,
    marginTop: Spacing.xs,
  },
});
