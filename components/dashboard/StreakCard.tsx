import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ApexCard } from '../common/ApexCard';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

interface StreakCardProps {
  currentStreak: number;
  bestStreak: number;
}

export function StreakCard({ currentStreak, bestStreak }: StreakCardProps) {
  const isOnFire = currentStreak >= 3;
  const streakColor = isOnFire ? Colors.gold : currentStreak > 0 ? Colors.green : Colors.text_muted;

  return (
    <ApexCard>
      <View style={styles.row}>
        <View style={styles.streakSection}>
          <MaterialCommunityIcons
            name={isOnFire ? 'fire' : 'lightning-bolt'}
            size={28}
            color={streakColor}
          />
          <View style={styles.textCol}>
            <Text style={[styles.count, { color: streakColor }]}>{currentStreak}</Text>
            <Text style={styles.label}>STREAK ATUAL</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.streakSection}>
          <MaterialCommunityIcons name="trophy" size={28} color={Colors.gold_dim} />
          <View style={styles.textCol}>
            <Text style={[styles.count, { color: Colors.gold_dim }]}>{bestStreak}</Text>
            <Text style={styles.label}>MELHOR</Text>
          </View>
        </View>
      </View>
    </ApexCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  streakSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  textCol: {
    alignItems: 'flex-start',
  },
  count: {
    ...Typography.h2,
    lineHeight: 30,
  },
  label: {
    ...Typography.label,
    color: Colors.text_secondary,
    fontSize: 9,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
});
