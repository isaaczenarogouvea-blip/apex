import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

interface RestTimerProps {
  restSeconds: number;
}

export function RestTimer({ restSeconds }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const start = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeLeft(restSeconds);
    setIsRunning(true);
  }, [restSeconds]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stop();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, stop]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (!isRunning && timeLeft === 0) {
    return (
      <Pressable onPress={start} style={styles.startBtn}>
        <MaterialCommunityIcons name="timer-outline" size={16} color={Colors.blue} />
        <Text style={styles.startText}>DESCANSO {restSeconds}s</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.timerContainer}>
      <Text style={[styles.timerText, timeLeft <= 5 && styles.timerUrgent]}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </Text>
      <Pressable onPress={stop} style={styles.stopBtn}>
        <MaterialCommunityIcons name="stop" size={16} color={Colors.red} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    minHeight: 44,
  },
  startText: {
    ...Typography.caption,
    color: Colors.blue,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  timerText: {
    ...Typography.h2,
    color: Colors.green,
  },
  timerUrgent: {
    color: Colors.red,
  },
  stopBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
