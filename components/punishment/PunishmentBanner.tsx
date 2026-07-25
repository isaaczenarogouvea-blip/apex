import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

interface PunishmentBannerProps {
  label: string;
  dueDate: string;
  punishmentId: number;
}

export function PunishmentBanner({ label, dueDate, punishmentId }: PunishmentBannerProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        router.push({ pathname: '/punishment', params: { id: punishmentId } });
      }}
      style={styles.container}
    >
      <MaterialCommunityIcons name="alert-octagon" size={24} color={Colors.red} />
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.due}>Vence: {dueDate}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.red} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.red_dark,
    borderWidth: 1,
    borderColor: Colors.red,
    borderRadius: Spacing.card_radius,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    gap: Spacing.md,
    minHeight: 44,
  },
  text: {
    flex: 1,
  },
  label: {
    ...Typography.h4,
    color: Colors.red,
  },
  due: {
    ...Typography.caption,
    color: Colors.text_secondary,
  },
});
