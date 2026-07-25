import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ApexButton } from '../components/common/ApexButton';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { GOALS } from '../constants/goals';

export default function ShameScreen() {
  const router = useRouter();

  const handleDismiss = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <MaterialCommunityIcons name="skull" size={80} color={Colors.red} />
        <Text style={styles.title}>VERGONHA</Text>
        <Text style={styles.subtitle}>
          {GOALS.shameConsecutiveDays} DIAS CONSECUTIVOS ABAIXO DE {GOALS.shameScoreThreshold}%
        </Text>
        <Text style={styles.message}>
          VOCÊ ESTÁ DESTRUINDO SEU PROGRESSO.{'\n'}
          CADA DIA QUE VOCÊ FALHA É UM DIA QUE VOCÊ{'\n'}
          ESCOLHE A MEDIOCRIDADE.{'\n\n'}
          PARA DE SE ENGANAR.{'\n'}
          VOLTA PRO CAMPO DE BATALHA.
        </Text>
        <ApexButton
          title="ACEITAR E VOLTAR"
          onPress={handleDismiss}
          variant="danger"
          style={styles.btn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.red_dark,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  title: {
    ...Typography.score,
    color: Colors.red,
    marginTop: Spacing.xl,
  },
  subtitle: {
    ...Typography.label,
    color: Colors.red,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  message: {
    ...Typography.body,
    color: Colors.text_primary,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: Spacing.xxl,
  },
  btn: {
    marginTop: Spacing.xxxl,
    width: '100%',
  },
});
