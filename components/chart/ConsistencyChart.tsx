import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

interface DayData {
  date: string;
  day: number;
  scorePercent: number;
  dayStatus: string;
}

interface ConsistencyChartProps {
  data: DayData[];
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'elite': return Colors.color_elite;
    case 'good': return Colors.color_good;
    case 'average': return Colors.color_average;
    case 'bad': return Colors.color_bad;
    default: return Colors.text_muted;
  }
}

const screenWidth = Dimensions.get('window').width;

export function ConsistencyChart({ data }: ConsistencyChartProps) {
  if (data.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Sem dados para este mês</Text>
      </View>
    );
  }

  const chartWidth = screenWidth - Spacing.screen_horizontal * 2 - Spacing.base * 2;
  const barWidth = Math.max((chartWidth / data.length) - 2, 4);
  const chartHeight = 160;

  return (
    <View style={styles.container}>
      <View style={styles.yAxis}>
        <Text style={styles.yLabel}>100%</Text>
        <Text style={styles.yLabel}>50%</Text>
        <Text style={styles.yLabel}>0%</Text>
      </View>
      <View style={[styles.chart, { height: chartHeight }]}>
        <View style={[styles.gridLine, { top: 0 }]} />
        <View style={[styles.gridLine, { top: chartHeight / 2 }]} />
        <View style={[styles.gridLine, { top: chartHeight }]} />
        <View style={styles.barsContainer}>
          {data.map((d) => (
            <View key={d.date} style={[styles.barCol, { width: barWidth }]}>
              <View style={[styles.barTrack, { height: chartHeight }]}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${Math.max(d.scorePercent, 2)}%`,
                      backgroundColor: getStatusColor(d.dayStatus),
                    },
                  ]}
                />
              </View>
              {data.length <= 15 && (
                <Text style={styles.xLabel}>{d.day}</Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: Spacing.base,
  },
  yAxis: {
    justifyContent: 'space-between',
    marginRight: Spacing.sm,
    height: 160,
  },
  yLabel: {
    ...Typography.caption,
    color: Colors.text_muted,
    fontSize: 9,
  },
  chart: {
    flex: 1,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.border,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    gap: 2,
  },
  barCol: {
    alignItems: 'center',
  },
  barTrack: {
    justifyContent: 'flex-end',
  },
  bar: {
    borderRadius: 2,
    width: '100%',
  },
  xLabel: {
    ...Typography.caption,
    color: Colors.text_muted,
    fontSize: 8,
    marginTop: 2,
  },
  empty: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.caption,
    color: Colors.text_muted,
  },
});
