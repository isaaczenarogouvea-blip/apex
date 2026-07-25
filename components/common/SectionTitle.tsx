import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

interface SectionTitleProps {
  title: string;
  rightText?: string;
}

export function SectionTitle({ title, rightText }: SectionTitleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {rightText && <Text style={styles.right}>{rightText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.screen_horizontal,
  },
  title: {
    ...Typography.label,
    color: Colors.text_secondary,
  },
  right: {
    ...Typography.caption,
    color: Colors.text_muted,
  },
});
