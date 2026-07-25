import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';

interface ApexCardProps {
  children: React.ReactNode;
  elevated?: boolean;
  style?: ViewStyle;
  noPadding?: boolean;
}

export function ApexCard({ children, elevated, style, noPadding }: ApexCardProps) {
  return (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        noPadding && styles.noPadding,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bg_card,
    borderRadius: Spacing.card_radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  elevated: {
    backgroundColor: Colors.bg_card_elevated,
  },
  noPadding: {
    padding: 0,
  },
});
