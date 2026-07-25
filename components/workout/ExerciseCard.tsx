import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ApexCard } from '../common/ApexCard';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { Exercise } from '../../constants/workouts';

interface ExerciseCardProps {
  exercise: Exercise;
  children?: React.ReactNode;
}

export function ExerciseCard({ exercise, children }: ExerciseCardProps) {
  return (
    <ApexCard>
      <View style={styles.header}>
        <View style={styles.idBadge}>
          <Text style={styles.idText}>{exercise.id}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{exercise.name}</Text>
          <Text style={styles.meta}>
            {exercise.sets}×{exercise.repsMin}
            {exercise.repsMax !== exercise.repsMin ? `–${exercise.repsMax}` : ''}
            {' · '}{exercise.restSeconds}s rest
            {exercise.toFailure ? ' · ATÉ FALHA' : ''}
          </Text>
        </View>
        {exercise.toFailure && (
          <MaterialCommunityIcons name="fire" size={20} color={Colors.orange} />
        )}
      </View>
      {exercise.notes && (
        <Text style={styles.notes}>{exercise.notes}</Text>
      )}
      {children}
    </ApexCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  idBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.bg_input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idText: {
    ...Typography.label,
    color: Colors.text_secondary,
    fontSize: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    ...Typography.body_bold,
    color: Colors.text_primary,
  },
  meta: {
    ...Typography.caption,
    color: Colors.text_secondary,
    marginTop: 2,
  },
  notes: {
    ...Typography.caption,
    color: Colors.blue,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
});
