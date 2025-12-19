
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, spacing, typography } from '../theme';
import PrimaryButton from '../components/PrimaryButton';

export default function LoginScreen({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleLogin() {
    if (!cpf || !password) {
      setError('Preencha CPF e senha para continuar.');
      return;
    }

    // Aqui você pode futuramente validar CPF/senha (API).
    setError('');
    navigation.navigate('Home');
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>HEMOPE</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Acessar Conta</Text>

          <TextInput
            style={[styles.input, !!error && !cpf && styles.inputError]}
            placeholder="CPF"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={cpf}
            onChangeText={setCpf}
          />

          <TextInput
            style={[styles.input, !!error && !password && styles.inputError]}
            placeholder="Senha"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <PrimaryButton
            title="Entrar"
            disabled={!cpf || !password}
            onPress={handleLogin}
            style={styles.button}
          />

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <Text style={styles.footerText}>
            Ao criar uma conta, você concorda com nossos termos e a nossa política de privacidade.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    ...typography.heading2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    elevation: 4,
  },
  cardTitle: {
    ...typography.heading2,
    marginBottom: 16,
    color: colors.primary,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginBottom: spacing.md,
    ...typography.body,
  },
  inputError: {
    borderColor: colors.error,
  },
  button: {
    marginTop: 4,
  },
  footerText: {
    marginTop: 12,
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    marginTop: 8,
    ...typography.caption,
    color: colors.error,
    textAlign: 'center',
  },
});
