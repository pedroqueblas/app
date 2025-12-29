import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, typography } from '../theme';
import { LocalStorage } from '../services/LocalStorage';
import PrimaryButton from '../components/PrimaryButton';

export default function AgendamentoScreen({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasAppointment, setHasAppointment] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estado temporário para iOS
  const [tempDate, setTempDate] = useState(new Date());

  useEffect(() => {
    checkExistingAppointment();
  }, []);

  const checkExistingAppointment = async () => {
    try {
      const appointment = await LocalStorage.getAppointment();
      if (appointment) {
        setHasAppointment(true);
        Alert.alert(
          'Atenção',
          'Você já possui um agendamento ativo. Não é possível realizar outro.',
          [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
        );
      }
    } catch (error) {
      console.error('Erro ao verificar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const isWeekend = (d) => {
    const day = d.getDay();
    return day === 0 || day === 6; // 0 = Domingo, 6 = Sábado
  };

  const isPastDate = (d) => {
    const now = new Date();
    // Zera as horas para comparar apenas o dia
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return target < today;
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (selectedDate) {
        setDate(selectedDate);
      }
    } else {
      // iOS
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const confirmDateIos = () => {
    setDate(tempDate);
    setShowDatePicker(false);
  };

  const cancelDateIos = () => {
    setShowDatePicker(false);
    setTempDate(date);
  };

  const handleSchedule = async () => {
    if (isPastDate(date)) {
      Alert.alert('Data Inválida', 'Não é possível agendar para uma data passada.');
      return;
    }

    if (isWeekend(date)) {
      Alert.alert('Data Inválida', 'Agendamentos não são permitidos nos fins de semana.');
      return;
    }

    try {
      // Verificar novamente se já existe (caso o usuário tenha ficado na tela)
      const existing = await LocalStorage.getAppointment();
      if (existing) {
        Alert.alert('Erro', 'Você já possui um agendamento ativo.');
        return;
      }

      const appointmentData = {
        date: date.toISOString(),
        createdAt: new Date().toISOString(),
        status: 'scheduled'
      };

      await LocalStorage.saveAppointment(appointmentData);

      Alert.alert(
        'Sucesso',
        'Seu agendamento foi realizado com sucesso!',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível realizar o agendamento.');
      console.error(error);
    }
  };

  const formatDate = (d) => {
    return d.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Agendar Doação</Text>
        <Text style={styles.description}>
          Escolha uma data para realizar sua doação. Lembre-se que atendemos apenas em dias úteis.
        </Text>

        <View style={styles.dateContainer}>
          <Text style={styles.label}>Data selecionada:</Text>
          <Text style={styles.dateDisplay}>{formatDate(date)}</Text>
          
          <PrimaryButton 
            title="Alterar Data" 
            onPress={() => {
              setTempDate(date);
              setShowDatePicker(true);
            }} 
            style={styles.dateButton}
          />
        </View>

        {showDatePicker && (
          <View>
            <DateTimePicker
              value={Platform.OS === 'ios' ? tempDate : date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
              locale="pt-BR"
            />
            {Platform.OS === 'ios' && (
              <View style={styles.iosButtons}>
                <PrimaryButton 
                  title="Cancelar" 
                  onPress={cancelDateIos} 
                  style={[styles.iosBtn, { backgroundColor: '#999' }]} 
                />
                <PrimaryButton 
                  title="Confirmar" 
                  onPress={confirmDateIos} 
                  style={styles.iosBtn} 
                />
              </View>
            )}
          </View>
        )}

        <View style={styles.spacer} />

        <PrimaryButton
          title="Confirmar Agendamento"
          onPress={handleSchedule}
          disabled={hasAppointment}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typography.heading1,
    color: colors.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  dateContainer: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  dateDisplay: {
    ...typography.heading2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  dateButton: {
    width: '100%',
    backgroundColor: colors.primaryDark,
  },
  spacer: {
    height: spacing.xl,
  },
  iosButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  iosBtn: {
    width: '40%',
  },
});
