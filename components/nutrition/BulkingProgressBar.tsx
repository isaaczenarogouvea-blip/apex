import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from '../common/ProgressBar';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { CURRENT_WEIGHT_KG, TARGET_WEIGHT_KG } from '../../constants/meals';

interface BulkingProgressBarProps {
  latestWeight: number | null;
}

export function BulkingProgressBar({ latestWeight }: BulkingProgressBarProps) {
  const current = latestWeight ?? CURRENT_WEIGHT_KG;
  const gained = current - CURRENT_WEIGHT_KG;
  const total = TARGET_WEIGHT_KG - CURRENT_WEIGHT_KG;
  const progress = Math.max(gained / total, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>BULKING PROGRESS</Text>
        <Text style={styles.weight}>
          <Text style={styles.current}>{current.toFixed(1)}</Text>
          <Text style={styles.target}> / {TARGET_WEIGHT_KG} kg</Text>
        </Text>
      </View>
      <ProgressBar progress={progress} color={Colors.gold} height={10} />
      <View style={styles.footer}>
        <Text style={styles.footerText}>{CURRENT_WEIGHT_KG} kg</Text>
        <Text style={styles.gained}>+{gained.toFixed(1)} kg</Text>
        <Text style={styles.footerText}>{TARGET_WEIGHT_KG} kg</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    ...Typography.label,
    color: Colors.text_secondary,
  },
  weight: {
    flexDirection: 'row',
  },
  current: {
    ...Typography.h3,
    color: Colors.gold,
  },
  target: {
    ...Typography.body,
    color: Colors.text_secondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  footerText: {
    ...Typography.caption,
    color: Colors.text_muted,
    fontSize: 10,
  },
  gained: {
    ...Typography.caption,
    color: Colors.green,
    fontSize: 10,
  },
});
