import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { GOALS } from '../../constants/goals';

interface DailyScoreRingProps {
  scorePercent: number;
  dayStatus: string;
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

function getStatusLabel(status: string): string {
  switch (status) {
    case 'elite': return 'ELITE';
    case 'good': return 'BOM';
    case 'average': return 'MÉDIO';
    case 'bad': return 'RUIM';
    default: return 'PENDENTE';
  }
}

export function DailyScoreRing({ scorePercent, dayStatus }: DailyScoreRingProps) {
  const size = 180;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(scorePercent / 100, 1);
  const strokeDashoffset = circumference * (1 - progress);
  const color = getStatusColor(dayStatus);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.bg_input}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.labelContainer}>
        <Text style={[styles.score, { color }]}>{Math.round(scorePercent)}</Text>
        <Text style={[styles.status, { color }]}>{getStatusLabel(dayStatus)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  score: {
    ...Typography.score,
  },
  status: {
    ...Typography.label,
    marginTop: -8,
  },
});
