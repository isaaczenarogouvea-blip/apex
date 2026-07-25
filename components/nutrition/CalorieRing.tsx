import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { DAILY_CALORIE_GOAL } from '../../constants/meals';

interface CalorieRingProps {
  consumed: number;
}

export function CalorieRing({ consumed }: CalorieRingProps) {
  const size = 140;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(consumed / DAILY_CALORIE_GOAL, 1);
  const strokeDashoffset = circumference * (1 - progress);
  const remaining = Math.max(DAILY_CALORIE_GOAL - consumed, 0);
  const color = progress >= 1 ? Colors.green : progress >= 0.7 ? Colors.orange : Colors.red;

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
        <Text style={[styles.consumed, { color }]}>{consumed}</Text>
        <Text style={styles.label}>/ {DAILY_CALORIE_GOAL}</Text>
        <Text style={styles.remaining}>faltam {remaining}</Text>
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
  consumed: {
    ...Typography.h1,
    fontSize: 28,
  },
  label: {
    ...Typography.caption,
    color: Colors.text_secondary,
    marginTop: -4,
  },
  remaining: {
    ...Typography.caption,
    color: Colors.text_muted,
    fontSize: 10,
  },
});
