import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Platform, Modal, StatusBar, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '../theme';
import { LocalStorage } from '../services/LocalStorage';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation, route }) {
  const [user, setUser] = useState(route?.params?.user || null);
  // Estado inicial com a data "hardcoded" de exemplo (12/08/2025)
  // Nota: Meses em JS começam em 0, então 08 (Agosto) é 7
  const [lastDonationDate, setLastDonationDate] = useState(new Date(2025, 7, 12));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const LAST_DONATION_KEY = '@hemope_last_donation';
  
  // Estado temporário para o picker do iOS
  const [tempDate, setTempDate] = useState(new Date());

  // Animação de pulsação para o ícone usando API nativa
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const animatedIconStyle = {
    transform: [{ scale: scaleAnim }],
  };

  useEffect(() => {
    loadUserData();
    loadLastDonationDate();
  }, []);

  const loadUserData = async () => {
    if (!user) {
      const sessionUser = await LocalStorage.getSession();
      if (sessionUser) {
        setUser(sessionUser);
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return 'HP'; // Hemope
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  const loadLastDonationDate = async () => {
    try {
      const storedDate = await AsyncStorage.getItem(LAST_DONATION_KEY);
      if (storedDate) {
        const date = new Date(storedDate);
        setLastDonationDate(date);
        setTempDate(date);
      }
    } catch (e) {
      console.error("Falha ao carregar data", e);
    }
  };

  // Função para formatar a data (dd/mm/aaaa)
  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR');
  };

  // Calcula a próxima doação (3 meses depois)
  const getNextDonationDate = (date) => {
    const nextDate = new Date(date);
    nextDate.setMonth(nextDate.getMonth() + 3);
    return nextDate;
  };

  const handleDateChange = async (event, selectedDate) => {
    if (Platform.OS === 'android') {
        setShowDatePicker(false);
        if (selectedDate) {
            setLastDonationDate(selectedDate);
            try {
                await AsyncStorage.setItem(LAST_DONATION_KEY, selectedDate.toISOString());
            } catch (e) {
                console.error("Falha ao salvar data", e);
            }
        }
    } else {
        // No iOS, apenas atualiza o estado temporário
        if (selectedDate) {
            setTempDate(selectedDate);
        }
    }
  };

  const confirmDateIos = async () => {
      setLastDonationDate(tempDate);
      setShowDatePicker(false);
      try {
          await AsyncStorage.setItem(LAST_DONATION_KEY, tempDate.toISOString());
      } catch (e) {
          console.error("Falha ao salvar data", e);
      }
  };

  const cancelDateIos = () => {
      setShowDatePicker(false);
      setTempDate(lastDonationDate); // Restaura data original
  };

  const showDatepicker = () => {
    setTempDate(lastDonationDate); // Inicializa com a data atual
    setShowDatePicker(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Modal para iOS */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={cancelDateIos}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={cancelDateIos} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Selecione a Data</Text>
                <TouchableOpacity onPress={confirmDateIos} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                  <Text style={styles.modalDoneText}>Concluído</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
                style={styles.datePickerIos}
                textColor="#000"
                themeVariant="light"
              />
            </View>
          </View>
        </Modal>
      )}

      {/* DateTimePicker para Android */}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={lastDonationDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.helloText}>Olá, {user ? user.nome_completo.split(' ')[0] : 'Doador'}!</Text>
          <Text style={styles.subtitle}>Doador voluntário de sangue</Text>
          <Text style={styles.donorCode}>Cod. Doador: {user ? (user.codigo_doador || user.cpf || '---') : '---'}</Text>
        </View>
        <TouchableOpacity
          style={styles.profileAvatar}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileInitials}>{user ? getInitials(user.nome_completo) : 'HP'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Agendamento')}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.actionIcon}>📅</Text>
            </View>
            <Text style={styles.actionLabel}>Agendar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('VirtualCard')}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.actionIcon}>🪪</Text>
            </View>
            <Text style={styles.actionLabel}>Carteira</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Locations')}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.actionIcon}>📍</Text>
            </View>
            <Text style={styles.actionLabel}>Localização</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => Linking.openURL('https://www.hemope.pe.gov.br/')}
          >
             <View style={styles.iconContainer}>
              <Text style={styles.actionIcon}>❤️</Text>
            </View>
            <Text style={styles.actionLabel}>Fidelização</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Sua Doação</Text>
          <View style={styles.cardRow}>
            <TouchableOpacity 
              style={[styles.dateCard, styles.lastDonationCard]}
              onPress={showDatepicker}
              activeOpacity={0.7}
            >
              <Text style={styles.dateCardLabel}>Última Doação</Text>
              <Text style={styles.dateCardValue}>{formatDate(lastDonationDate)}</Text>
              <Text style={styles.tapToEditText}>Toque para alterar</Text>
            </TouchableOpacity>
            <View style={styles.dateCard}>
              <Text style={styles.dateCardLabel}>Próxima Doação</Text>
              <Text style={styles.dateCardValue}>{formatDate(getNextDonationDate(lastDonationDate))}</Text>
              <Text style={styles.infoText}>Previsão</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Dicas para o Doador</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tipsContainer}>
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>💧</Text>
              <Text style={styles.tipTitle}>Hidratação</Text>
              <Text style={styles.tipText}>Beba bastante água antes e depois de doar.</Text>
            </View>
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>🥗</Text>
              <Text style={styles.tipTitle}>Alimentação</Text>
              <Text style={styles.tipText}>Evite alimentos gordurosos 4h antes.</Text>
            </View>
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>😴</Text>
              <Text style={styles.tipTitle}>Descanso</Text>
              <Text style={styles.tipText}>Durma pelo menos 6h na noite anterior.</Text>
            </View>
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>🚭</Text>
              <Text style={styles.tipTitle}>Evite Fumar</Text>
              <Text style={styles.tipText}>Não fume 2h antes da doação.</Text>
            </View>
          </ScrollView>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'android' ? 40 : 20, // Adjustment for custom header
    paddingHorizontal: 24,
    paddingBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginBottom: 10,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 16,
  },
  helloText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginBottom: 4,
  },
  donorCode: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileInitials: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 20,
  },
  content: {
    padding: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  actionIcon: {
    fontSize: 24,
  },
  actionLabel: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
    marginLeft: 4,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 16,
  },
  dateCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  lastDonationCard: {
    borderColor: colors.primary,
    borderWidth: 1,
    backgroundColor: '#fffafa',
  },
  dateCardLabel: {
    color: colors.textSecondary,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateCardValue: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tapToEditText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '500',
  },
  infoText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  banner: {
    // backgroundColor removed in favor of LinearGradient
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bannerContent: {
    flex: 1,
    paddingRight: 16,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bannerText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  modalDoneText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalCancelText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  datePickerIos: {
    height: 200,
    width: '100%',
    backgroundColor: 'white',
  },
  tipsContainer: {
    paddingVertical: 10,
    paddingRight: 20,
  },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  tipIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    lineHeight: 14,
  },
});
