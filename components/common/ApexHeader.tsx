import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

interface ApexHeaderProps {
  title: string;
  subtitle?: string;
}

export function ApexHeader({ title, subtitle }: ApexHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.screen_horizontal,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.base,
  },
  title: {
    ...Typography.h1,
    color: Colors.text_primary,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.text_secondary,
    marginTop: Spacing.xs,
  },
});
