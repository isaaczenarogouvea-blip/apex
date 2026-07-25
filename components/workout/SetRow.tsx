import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

interface SetRowProps {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
  onWeightChange: (value: number) => void;
  onRepsChange: (value: number) => void;
  onToggle: () => void;
}

export function SetRow({
  setNumber,
  weightKg,
  reps,
  completed,
  onWeightChange,
  onRepsChange,
  onToggle,
}: SetRowProps) {
  return (
    <View style={[styles.container, completed && styles.completedContainer]}>
      <Text style={styles.setNum}>S{setNumber}</Text>
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          value={weightKg > 0 ? String(weightKg) : ''}
          onChangeText={(t) => onWeightChange(Number(t) || 0)}
          keyboardType="numeric"
          placeholder="kg"
          placeholderTextColor={Colors.text_muted}
        />
        <Text style={styles.times}>×</Text>
        <TextInput
          style={styles.input}
          value={reps > 0 ? String(reps) : ''}
          onChangeText={(t) => onRepsChange(Number(t) || 0)}
          keyboardType="numeric"
          placeholder="reps"
          placeholderTextColor={Colors.text_muted}
        />
      </View>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onToggle();
        }}
        style={styles.checkBtn}
      >
        <MaterialCommunityIcons
          name={completed ? 'check-circle' : 'circle-outline'}
          size={28}
          color={completed ? Colors.green : Colors.text_muted}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  completedContainer: {
    opacity: 0.5,
  },
  setNum: {
    ...Typography.label,
    color: Colors.text_secondary,
    width: 28,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.sm,
  },
  input: {
    ...Typography.body,
    color: Colors.text_primary,
    backgroundColor: Colors.bg_input,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minWidth: 60,
    textAlign: 'center',
  },
  times: {
    ...Typography.body,
    color: Colors.text_muted,
  },
  checkBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
