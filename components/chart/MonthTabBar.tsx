import { ScrollView, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

interface MonthTabBarProps {
  months: string[];
  selectedMonth: string;
  onSelect: (month: string) => void;
}

export function MonthTabBar({ months, selectedMonth, onSelect }: MonthTabBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      style={styles.scroll}
    >
      {months.map((month) => {
        const isActive = selectedMonth === month;
        return (
          <Pressable
            key={month}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(month);
            }}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <Text style={[styles.text, isActive && styles.textActive]}>{month}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    maxHeight: 44,
  },
  content: {
    paddingHorizontal: Spacing.screen_horizontal,
    gap: Spacing.sm,
  },
  tab: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.bg_card,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 36,
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  text: {
    ...Typography.label,
    color: Colors.text_secondary,
    fontSize: 11,
  },
  textActive: {
    color: Colors.text_inverse,
  },
});
