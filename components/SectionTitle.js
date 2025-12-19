import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

export default function SectionTitle({ children, style }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    ...typography.caption,
    fontWeight: '600',
    marginBottom: spacing.sm,
    color: colors.textPrimary,
  },
});


