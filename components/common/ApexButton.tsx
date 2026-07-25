import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

type ButtonVariant = 'primary' | 'danger' | 'ghost' | 'gold';

interface ApexButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  compact?: boolean;
}

const variantStyles: Record<ButtonVariant, { bg: string; text: string; border: string }> = {
  primary: { bg: Colors.green, text: Colors.text_inverse, border: Colors.green },
  danger: { bg: Colors.red, text: '#FFFFFF', border: Colors.red },
  ghost: { bg: 'transparent', text: Colors.text_primary, border: Colors.border },
  gold: { bg: Colors.gold, text: Colors.text_inverse, border: Colors.gold },
};

export function ApexButton({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  compact,
}: ApexButtonProps) {
  const colors = variantStyles[variant];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        compact && styles.compact,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <Text style={[styles.text, { color: colors.text }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    borderRadius: Spacing.card_radius,
    borderWidth: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compact: {
    minHeight: 36,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  text: {
    ...Typography.h4,
    textTransform: 'uppercase',
  },
});
