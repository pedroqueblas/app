
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { colors, spacing, typography } from '../theme';
import SectionTitle from '../components/SectionTitle';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.helloText}>Olá, Caio Martins!</Text>
          <Text style={styles.subtitle}>Doador voluntário de sangue</Text>
          <Text style={styles.donorCode}>Cod. Doador: 1234567891</Text>
        </View>
        <TouchableOpacity
          style={styles.profileAvatar}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileInitials}>CM</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => Linking.openURL('http://10.0.0.6:8000/agendar/')}
          >
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionLabel}>Agendar doação</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('VirtualCard')}
          >
            <Text style={styles.actionIcon}>🪪</Text>
            <Text style={styles.actionLabel}>Carteira virtual</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() =>
              Linking.openURL(
                'https://www.google.com/maps/place/Hemope+-+Funda%C3%A7%C3%A3o+de+Hematologia+e+Hemoterapia+de+Pernambuco/@-8.0528651,-34.9074988,16z/data=!4m10!1m2!2m1!1shemope!3m6!1s0x7ab18e7caa3ba43:0x5cacada93b530a37!8m2!3d-8.0528651!4d-34.8979716!15sCgZoZW1vcGWSARVibG9vZF9kb25hdGlvbl9jZW50ZXLgAQA!16s%2Fg%2F1wn33wl4?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D',
              )
            }
          >
            <Text style={styles.actionIcon}>📍</Text>
            <Text style={styles.actionLabel}>Localização</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => Linking.openURL('https://www.hemope.pe.gov.br/')}
          >
            <Text style={styles.actionIcon}>❤️</Text>
            <Text style={styles.actionLabel}>Fidelização</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardRow}>
          <View style={styles.dateCard}>
            <Text style={styles.dateCardLabel}>Última Doação</Text>
            <Text style={styles.dateCardValue}>12/08/2025</Text>
          </View>
          <View style={styles.dateCard}>
            <Text style={styles.dateCardLabel}>Próxima Doação</Text>
            <Text style={styles.dateCardValue}>20/12/2025</Text>
          </View>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Ajude o HEMOPE a salvar vidas</Text>
          <Text style={styles.bannerText}>Seja um doador, doe sangue.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
    paddingRight: 16,
  },
  helloText: {
    color: '#fff',
    ...typography.heading2,
    marginBottom: 4,
  },
  subtitle: {
    color: '#ffe6ea',
    ...typography.caption,
    marginBottom: 4,
  },
  donorCode: {
    color: '#fff',
    ...typography.caption,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    color: colors.primary,
    fontWeight: '700',
  },
  content: {
    padding: spacing.lg,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionLabel: {
    ...typography.caption,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dateCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginHorizontal: 4,
  },
  dateCardLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  dateCardValue: {
    ...typography.heading2,
    color: colors.primary,
  },
  banner: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 4,
  },
  bannerTitle: {
    color: '#fff',
    ...typography.heading2,
    marginBottom: 4,
  },
  bannerText: {
    color: '#ffe6ea',
    ...typography.body,
  },
});
