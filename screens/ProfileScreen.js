import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';
import PrimaryButton from '../components/PrimaryButton';

export default function ProfileScreen({ navigation }) {
  function handleLogout() {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarInitials}>CM</Text>
      </View>
      <Text style={styles.name}>Caio Martins Ferraz</Text>

      <PrimaryButton title="Sair" onPress={handleLogout} style={styles.logoutButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    backgroundColor: colors.surface,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  name: {
    ...typography.heading2,
    marginBottom: 32,
  },
  logoutButton: {
    marginTop: spacing.lg,
    minWidth: 200,
  },
});


