import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.subtitle}>Tela não encontrada</Text>
      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>Voltar ao Dashboard</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg_primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.score,
    color: Colors.red,
  },
  subtitle: {
    ...Typography.h3,
    color: Colors.text_secondary,
  },
  link: {
    marginTop: 24,
  },
  linkText: {
    ...Typography.body_bold,
    color: Colors.gold,
  },
});
