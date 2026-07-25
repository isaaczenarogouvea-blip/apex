import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { ApexCard } from '../common/ApexCard';
import { ApexButton } from '../common/ApexButton';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

interface WeightEntryProps {
  currentWeight: number | null;
  onSave: (weight: number) => void;
}

export function WeightEntry({ currentWeight, onSave }: WeightEntryProps) {
  const [value, setValue] = useState(currentWeight?.toString() ?? '');

  const handleSave = () => {
    const weight = parseFloat(value);
    if (weight > 0 && weight < 200) {
      onSave(weight);
    }
  };

  return (
    <ApexCard>
      <Text style={styles.label}>PESO HOJE (kg)</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          keyboardType="decimal-pad"
          placeholder="0.0"
          placeholderTextColor={Colors.text_muted}
        />
        <ApexButton title="SALVAR" onPress={handleSave} compact variant="gold" />
      </View>
    </ApexCard>
  );
}

const styles = StyleSheet.create({
  label: {
    ...Typography.label,
    color: Colors.text_secondary,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  input: {
    ...Typography.h2,
    color: Colors.text_primary,
    backgroundColor: Colors.bg_input,
    borderRadius: 8,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    flex: 1,
    textAlign: 'center',
  },
});
