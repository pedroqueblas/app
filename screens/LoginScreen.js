
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';
import PrimaryButton from '../components/PrimaryButton';
import { LocalStorage } from '../services/LocalStorage';

export default function LoginScreen({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!cpf || !password) {
      setError('Preencha CPF/Código e senha para continuar.');
      return;
    }

    try {
      setError('');
      setLoading(true);

      // Validação local
      const user = await LocalStorage.loginUser(cpf, password);
      
      // Salva sessão
      await LocalStorage.saveSession(user);

      // Se sucesso:
      navigation.navigate('Home', { user });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erro ao realizar login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
              title={loading ? 'Entrando...' : 'Entrar'}
              disabled={!cpf || !password || loading}
              onPress={handleLogin}
              style={styles.button}
            />

            <TouchableOpacity
              style={styles.signUpLink}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.signUpText}>
                Ainda não tem conta?{' '}
                <Text style={styles.signUpTextStrong}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <Text style={styles.footerText}>
              Ao criar uma conta, você concorda com nossos termos e a nossa política de privacidade.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  inner: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
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
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  logoText: {
    color: '#fff',
    ...typography.heading2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardTitle: {
    ...typography.heading2,
    marginBottom: 20,
    color: colors.primary,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.md,
    ...typography.body,
    backgroundColor: '#fafafa',
    height: 50,
  },
  inputError: {
    borderColor: colors.error,
  },
  button: {
    marginTop: 8,
    height: 50,
    borderRadius: 8,
  },
  signUpLink: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  signUpText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 14,
  },
  signUpTextStrong: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.primary,
  },
  footerText: {
    marginTop: 24,
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    opacity: 0.8,
  },
  errorText: {
    marginTop: 12,
    ...typography.caption,
    color: colors.error,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
