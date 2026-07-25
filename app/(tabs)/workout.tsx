import { useState, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApexHeader } from '../../components/common/ApexHeader';
import { ApexButton } from '../../components/common/ApexButton';
import { ApexCard } from '../../components/common/ApexCard';
import { WorkoutDaySelector } from '../../components/workout/WorkoutDaySelector';
import { ExerciseCard } from '../../components/workout/ExerciseCard';
import { SetRow } from '../../components/workout/SetRow';
import { RestTimer } from '../../components/workout/RestTimer';
import { useWorkout } from '../../lib/hooks/useWorkout';
import { WORKOUTS } from '../../constants/workouts';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

export default function WorkoutScreen() {
  const {
    selectedDay,
    setSelectedDay,
    activeSession,
    sets,
    startSession,
    logSet,
    completeSession,
    loadSession,
  } = useWorkout();

  useFocusEffect(
    useCallback(() => {
      loadSession();
    }, [])
  );

  const currentWorkout = WORKOUTS.find((w) => w.id === selectedDay);
  if (!currentWorkout) return null;

  const getSetData = (exerciseId: string, setNum: number) => {
    return sets.find((s) => s.exerciseId === exerciseId && s.setNumber === setNum) ?? {
      weightKg: 0,
      reps: 0,
      completed: false,
    };
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ApexHeader title="TREINO" subtitle={currentWorkout.focus} />
        <WorkoutDaySelector selectedDay={selectedDay} onSelect={setSelectedDay} />

        <View style={styles.content}>
          {!activeSession ? (
            <ApexButton
              title={`INICIAR ${currentWorkout.label}`}
              onPress={() => startSession(selectedDay)}
              variant="gold"
            />
          ) : (
            <>
              <Text style={styles.sessionInfo}>SESSÃO ATIVA</Text>
              {currentWorkout.exercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise}>
                  <View style={styles.setsContainer}>
                    {Array.from({ length: exercise.sets }, (_, i) => {
                      const setData = getSetData(exercise.id, i + 1);
                      return (
                        <SetRow
                          key={i}
                          setNumber={i + 1}
                          weightKg={setData.weightKg}
                          reps={setData.reps}
                          completed={setData.completed}
                          onWeightChange={(w) => logSet(exercise.id, i + 1, w, setData.reps)}
                          onRepsChange={(r) => logSet(exercise.id, i + 1, setData.weightKg, r)}
                          onToggle={() => logSet(exercise.id, i + 1, setData.weightKg, setData.reps)}
                        />
                      );
                    })}
                    <RestTimer restSeconds={exercise.restSeconds} />
                  </View>
                </ExerciseCard>
              ))}
              <ApexButton
                title="FINALIZAR TREINO"
                onPress={completeSession}
                variant="gold"
                style={styles.finishBtn}
              />
            </>
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
  content: {
    paddingHorizontal: Spacing.screen_horizontal,
    paddingBottom: Spacing.xxxl,
  },
  sessionInfo: {
    ...Typography.label,
    color: Colors.green,
    marginBottom: Spacing.base,
  },
  setsContainer: {
    marginTop: Spacing.md,
  },
  finishBtn: {
    marginTop: Spacing.xl,
  },
});
