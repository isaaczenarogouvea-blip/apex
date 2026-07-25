import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ApexHeader } from '../components/common/ApexHeader';
import { ApexCard } from '../components/common/ApexCard';
import { ApexButton } from '../components/common/ApexButton';
import { PunishmentExerciseRow } from '../components/punishment/PunishmentExerciseRow';
import { usePunishment } from '../lib/hooks/usePunishment';
import { PunishmentExercise } from '../constants/punishments';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';

export default function PunishmentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { activePunishments, loadPunishments, completePunishment } = usePunishment();
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPunishments();
  }, []);

  const punishment = activePunishments.find((p) => p.id === Number(id));

  if (!punishment) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Sem punição ativa</Text>
          <ApexButton title="VOLTAR" onPress={() => router.back()} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  let exercises: PunishmentExercise[] = [];
  try {
    exercises = JSON.parse(punishment.exercises);
  } catch {
    exercises = [];
  }

  const toggleExercise = (name: string) => {
    setCompletedExercises((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const allDone = exercises.length > 0 && exercises.every((e) => completedExercises.has(e.name));

  const handleComplete = async () => {
    await completePunishment(punishment.id);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <ApexButton title="VOLTAR" onPress={() => router.back()} variant="ghost" compact />
        </View>

        <View style={styles.header}>
          <MaterialCommunityIcons name="skull-crossbones" size={48} color={Colors.red} />
          <Text style={styles.label}>{punishment.label}</Text>
        </View>

        <View style={styles.content}>
          <ApexCard style={styles.shameCard}>
            <Text style={styles.shameText}>{punishment.shameMessage}</Text>
          </ApexCard>

          <ApexCard noPadding>
            {exercises.map((exercise) => (
              <PunishmentExerciseRow
                key={exercise.name}
                exercise={exercise}
                completed={completedExercises.has(exercise.name)}
                onToggle={() => toggleExercise(exercise.name)}
              />
            ))}
          </ApexCard>

          {allDone && (
            <ApexButton
              title="PUNIÇÃO CUMPRIDA"
              onPress={handleComplete}
              variant="gold"
              style={styles.completeBtn}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg_primary,
  },
  topBar: {
    paddingHorizontal: Spacing.screen_horizontal,
    paddingTop: Spacing.md,
    alignItems: 'flex-start',
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  label: {
    ...Typography.h1,
    color: Colors.red,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: Spacing.screen_horizontal,
    paddingBottom: Spacing.xxxl,
  },
  shameCard: {
    backgroundColor: Colors.red_dark,
    borderColor: Colors.red,
  },
  shameText: {
    ...Typography.body_bold,
    color: Colors.red,
    textAlign: 'center',
    lineHeight: 22,
  },
  completeBtn: {
    marginTop: Spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  emptyText: {
    ...Typography.h3,
    color: Colors.text_muted,
  },
});
