import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ApexHeader } from '../../components/common/ApexHeader';
import { ApexCard } from '../../components/common/ApexCard';
import { ApexButton } from '../../components/common/ApexButton';
import { SectionTitle } from '../../components/common/SectionTitle';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

const POMODORO_WORK = 25 * 60;
const POMODORO_BREAK = 5 * 60;
const POMODORO_LONG_BREAK = 15 * 60;

type TimerState = 'idle' | 'work' | 'break' | 'long_break';

export default function FocusScreen() {
  const [timeLeft, setTimeLeft] = useState(POMODORO_WORK);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [mits, setMits] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: '1', text: 'Prospecção — 5 clientes', done: false },
    { id: '2', text: 'Treino completo', done: false },
    { id: '3', text: 'Trabalho bloco 2', done: false },
  ]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            if (timerState === 'work') {
              const newCount = completedPomodoros + 1;
              setCompletedPomodoros(newCount);
              if (newCount % 4 === 0) {
                setTimerState('long_break');
                return POMODORO_LONG_BREAK;
              }
              setTimerState('break');
              return POMODORO_BREAK;
            }
            setTimerState('idle');
            return POMODORO_WORK;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return clearTimer;
  }, [isRunning, timerState, completedPomodoros, clearTimer, timeLeft]);

  const startWork = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimerState('work');
    setTimeLeft(POMODORO_WORK);
    setIsRunning(true);
  };

  const togglePause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRunning((prev) => !prev);
  };

  const reset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    clearTimer();
    setIsRunning(false);
    setTimerState('idle');
    setTimeLeft(POMODORO_WORK);
  };

  const toggleMit = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMits((prev) =>
      prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m))
    );
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const stateLabel = timerState === 'work' ? 'FOCO' : timerState === 'break' ? 'PAUSA' : timerState === 'long_break' ? 'PAUSA LONGA' : 'PRONTO';
  const stateColor = timerState === 'work' ? Colors.red : timerState === 'idle' ? Colors.text_muted : Colors.green;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ApexHeader title="FOCO" subtitle="POMODORO + TAREFAS PRIORITÁRIAS" />

        <View style={styles.content}>
          <ApexCard>
            <View style={styles.timerCenter}>
              <Text style={[styles.stateLabel, { color: stateColor }]}>{stateLabel}</Text>
              <Text style={[styles.timer, { color: stateColor }]}>
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </Text>
              <View style={styles.pomodoroRow}>
                {Array.from({ length: 4 }, (_, i) => (
                  <MaterialCommunityIcons
                    key={i}
                    name={i < completedPomodoros % 4 ? 'circle' : 'circle-outline'}
                    size={12}
                    color={i < completedPomodoros % 4 ? Colors.gold : Colors.text_muted}
                  />
                ))}
                <Text style={styles.pomodoroCount}>{completedPomodoros} total</Text>
              </View>
              <View style={styles.buttonRow}>
                {timerState === 'idle' ? (
                  <ApexButton title="INICIAR FOCO" onPress={startWork} variant="danger" />
                ) : (
                  <>
                    <ApexButton
                      title={isRunning ? 'PAUSAR' : 'CONTINUAR'}
                      onPress={togglePause}
                      variant={isRunning ? 'ghost' : 'primary'}
                      compact
                    />
                    <ApexButton title="RESETAR" onPress={reset} variant="ghost" compact />
                  </>
                )}
              </View>
            </View>
          </ApexCard>

          <SectionTitle title="MITs — TAREFAS PRIORITÁRIAS" />
          <ApexCard noPadding>
            {mits.map((mit) => (
              <Pressable
                key={mit.id}
                onPress={() => toggleMit(mit.id)}
                style={styles.mitRow}
              >
                <MaterialCommunityIcons
                  name={mit.done ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={24}
                  color={mit.done ? Colors.green : Colors.text_muted}
                />
                <Text style={[styles.mitText, mit.done && styles.mitDone]}>
                  {mit.text}
                </Text>
              </Pressable>
            ))}
          </ApexCard>
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
  timerCenter: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  stateLabel: {
    ...Typography.label,
    marginBottom: Spacing.sm,
  },
  timer: {
    ...Typography.score,
    fontSize: 72,
  },
  pomodoroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  pomodoroCount: {
    ...Typography.caption,
    color: Colors.text_muted,
    marginLeft: Spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  mitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    minHeight: 44,
  },
  mitText: {
    ...Typography.body,
    color: Colors.text_primary,
    flex: 1,
  },
  mitDone: {
    textDecorationLine: 'line-through',
    color: Colors.text_secondary,
  },
});
