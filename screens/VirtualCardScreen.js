import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../theme';
import PrimaryButton from '../components/PrimaryButton';
import SectionTitle from '../components/SectionTitle';

export default function VirtualCardScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cardWrapper}>
        <SectionTitle>Frente</SectionTitle>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.logoMark}>
              <Text style={styles.logoHeart}>♥</Text>
            </View>
            <Text style={styles.logoTitle}>HEMOPE</Text>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Nome do doador</Text>
              <Text style={styles.value}>Caio Martins Ferraz</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoColumn}>
                <Text style={styles.label}>Cód. doador</Text>
                <Text style={styles.valueSmall}>1234567891</Text>
              </View>
              <View style={styles.infoColumnRight}>
                <Text style={styles.label}>Tipo sanguíneo</Text>
                <Text style={styles.bloodType}>O+</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.footerLeft}>
              <Text style={styles.footerText}>Doação voluntária de sangue</Text>
              <Text style={styles.footerTextMuted}>Fundação HEMOPE • Recife - PE</Text>
            </View>
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrText}>QR</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.cardWrapper}>
        <SectionTitle>Verso</SectionTitle>
        <View style={styles.card}>
          <Text style={styles.backText}>
            Este documento identifica o doador voluntário de sangue cadastrado na Fundação HEMOPE.
          </Text>
          <Text style={styles.backText}>
            Em caso de dúvidas, entre em contato com a nossa central de atendimento.
          </Text>
          <Text style={[styles.backText, styles.backTextSmall]}>
            Documento sem valor para fins de identidade civil.
          </Text>
        </View>
      </View>

      <PrimaryButton title="Imprimir carteirinha" style={styles.printButton} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  cardWrapper: {
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#C00017',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoHeart: {
    color: '#C00017',
    fontSize: 16,
  },
  logoTitle: {
    ...typography.heading2,
    color: colors.primary,
    letterSpacing: 1,
  },
  cardBody: {
    marginBottom: 12,
  },
  infoBlock: {
    marginBottom: 10,
  },
  label: {
    fontSize: 11,
    color: '#777',
    marginBottom: 2,
  },
  value: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoColumn: {
    flex: 1,
    paddingRight: 8,
  },
  infoColumnRight: {
    width: 100,
    alignItems: 'flex-end',
  },
  valueSmall: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  bloodType: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
    marginTop: 4,
  },
  footerLeft: {
    flex: 1,
    paddingRight: 8,
  },
  footerText: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  footerTextMuted: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  qrPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C00017',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C00017',
  },
  backText: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  backTextSmall: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  printButton: {
    marginTop: spacing.sm,
  },
});

