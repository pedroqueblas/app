import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { colors, spacing, typography } from '../theme';
import PrimaryButton from '../components/PrimaryButton';
import SectionTitle from '../components/SectionTitle';
import { LocalStorage } from '../services/LocalStorage';

export default function VirtualCardScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const sessionUser = await LocalStorage.getSession();
    setUser(sessionUser);
  };

  const handleExport = async () => {
    if (!user) return;

    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Helvetica', sans-serif; -webkit-print-color-adjust: exact; padding: 20px; }
            .card {
              width: 350px;
              height: 220px;
              border-radius: 16px;
              border: 1px solid #eee;
              background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
              position: relative;
              margin-bottom: 20px;
              overflow: hidden;
            }
            .header {
              display: flex;
              justify-content: space-between;
              padding: 16px;
              border-bottom: 1px solid #f0f0f0;
            }
            .logo {
              display: flex;
              align-items: center;
            }
            .logo-mark {
              width: 30px;
              height: 30px;
              border-radius: 15px;
              border: 2px solid #C00017;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #C00017;
              font-weight: bold;
              margin-right: 8px;
            }
            .logo-text h1 { margin: 0; font-size: 14px; color: #C00017; }
            .logo-text p { margin: 0; font-size: 8px; color: #666; text-transform: uppercase; }
            .badge {
              background: #C00017;
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 8px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .body { padding: 16px; }
            .label { font-size: 9px; color: #888; text-transform: uppercase; margin-bottom: 2px; font-weight: 600; }
            .value-name { font-size: 18px; font-weight: bold; color: #222; margin-bottom: 12px; }
            .row { display: flex; align-items: flex-end; justify-content: space-between; }
            .col { margin-right: 10px; }
            .value { font-size: 14px; font-weight: 600; color: #333; }
            .footer {
              position: absolute;
              bottom: 10px;
              right: 16px;
              text-align: right;
            }
            .barcode { display: flex; align-items: flex-end; justify-content: flex-end; height: 25px; margin-bottom: 2px; }
            .bar { background: black; display: inline-block; }
            .barcode-text { font-size: 9px; font-family: monospace; letter-spacing: 2px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="logo">
                <div class="logo-mark">♥</div>
                <div class="logo-text">
                  <h1>HEMOPE</h1>
                  <p>Fundação Hemope</p>
                </div>
              </div>
              <div class="badge">DOADOR VOLUNTÁRIO</div>
            </div>
            <div class="body">
              <div class="label">NOME DO DOADOR</div>
              <div class="value-name">${user.nome_completo}</div>
              
              <div class="row">
                <div class="col">
                  <div class="label">CPF</div>
                  <div class="value">${user.cpf || '---'}</div>
                </div>
                <div class="col">
                  <div class="label">NASCIMENTO</div>
                  <div class="value">${user.data_nascimento}</div>
                </div>
                 <div class="col" style="text-align: center; border: 1px solid #ffcdd2; background: #ffebee; padding: 4px 8px; border-radius: 8px;">
                  <div class="label" style="color: #d32f2f; margin: 0;">TIPO</div>
                  <div class="value" style="font-size: 18px; color: #d32f2f; font-weight: 900;">${user.tipo_sanguineo}</div>
                </div>
              </div>
            </div>
            <div class="footer">
              <div class="barcode">
                <!-- Simples representação visual -->
                <div class="bar" style="width:2px; height:25px; margin-right:1px"></div>
                <div class="bar" style="width:1px; height:25px; margin-right:1px"></div>
                <div class="bar" style="width:3px; height:25px; margin-right:1px"></div>
                <div class="bar" style="width:1px; height:25px; margin-right:1px"></div>
                <div class="bar" style="width:2px; height:25px; margin-right:1px"></div>
                <div class="bar" style="width:1px; height:25px; margin-right:1px"></div>
                <div class="bar" style="width:3px; height:25px; margin-right:1px"></div>
                 <div class="bar" style="width:2px; height:25px; margin-right:1px"></div>
                <div class="bar" style="width:1px; height:25px; margin-right:1px"></div>
                <div class="bar" style="width:3px; height:25px; margin-right:1px"></div>
              </div>
              <div class="barcode-text">${user.codigo_doador || user.cpf}</div>
            </div>
          </div>
          <p style="text-align: center; color: #666; font-size: 10px;">Gerado via App Hemope</p>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível exportar a carteira.');
      console.error(error);
    }
  };

  // Simulação visual de código de barras
  const renderBarcode = (code) => {
    // Se não tiver código, usa um padrão
    const seed = code || '1234567890';
    const bars = [];
    
    // Gera barras baseadas nos caracteres (menor quantidade e altura)
    for (let i = 0; i < 25; i++) {
      const width = (i % 3 === 0) ? 2 : (i % 2 === 0 ? 1 : 1.5);
      const marginRight = (i % 5 === 0) ? 1.5 : 1;
      
      bars.push(
        <View 
          key={i} 
          style={{
            width: width,
            height: 25, // Altura reduzida
            backgroundColor: 'black',
            marginRight: marginRight
          }} 
        />
      );
    }

    return (
      <View style={styles.barcodeContainer}>
        <View style={styles.barcodeLines}>
          {bars}
        </View>
        <Text style={styles.barcodeText}>{code || '0000000000'}</Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cardWrapper}>
        <SectionTitle>Frente</SectionTitle>
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={['#ffffff', '#f8f9fa']}
            style={styles.card}
          >
            {/* Cabeçalho com Logo */}
            <View style={styles.cardHeader}>
              <View style={styles.headerLeft}>
                <View style={styles.logoMark}>
                  <Text style={styles.logoHeart}>♥</Text>
                </View>
                <View>
                  <Text style={styles.logoTitle}>HEMOPE</Text>
                  <Text style={styles.logoSubtitle}>Fundação Hemope</Text>
                </View>
              </View>
              <View style={styles.headerRight}>
                <Text style={styles.headerLabel}>DOADOR VOLUNTÁRIO</Text>
              </View>
            </View>

            {/* Corpo do Cartão */}
            <View style={styles.cardBody}>
              {/* Tipo Sanguíneo - Posicionado Absolutamente no Topo Direito */}
              <View style={styles.bloodTypeWrapper}>
                  <View style={styles.bloodTypeContainer}>
                      <Text style={styles.bloodTypeLabel}>TIPO</Text>
                      <Text style={styles.bloodType}>{user?.tipo_sanguineo || '--'}</Text>
                  </View>
              </View>

              <View style={styles.mainInfo}>
                <View style={styles.infoBlock}>
                  <Text style={styles.label}>NOME DO DOADOR</Text>
                  <Text style={styles.valueName} numberOfLines={1} adjustsFontSizeToFit>
                    {user?.nome_completo || 'Carregando...'}
                  </Text>
                </View>
              </View>

              <View style={styles.detailsRow}>
                 <View style={styles.detailItem}>
                    <Text style={styles.label}>CPF</Text>
                    <Text style={styles.valueMono}>{user?.cpf || '---'}</Text>
                </View>
              </View>
            </View>

            {/* Rodapé com Código de Barras (Canto Inferior Direito) */}
            <View style={styles.cardFooter}>
               {renderBarcode(user?.codigo_doador || user?.cpf)}
            </View>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.cardWrapper}>
        <SectionTitle>Verso</SectionTitle>
        <View style={styles.cardContainer}>
          <View style={[styles.card, styles.cardBack]}>
            {/* Tarja Magnética Simulada */}
            <View style={styles.magneticStrip} />

            <View style={styles.backContent}>
              <View style={styles.signatureArea}>
                 <View style={styles.signatureLine} />
                 <Text style={styles.signatureLabel}>Assinatura do Doador</Text>
              </View>

              <View style={styles.legalTextContainer}>
                <Text style={styles.backText}>
                  Este cartão é pessoal e intransferível. Identifica o doador voluntário cadastrado na Fundação HEMOPE.
                </Text>
                <Text style={styles.backText}>
                  Em caso de perda ou extravio, comunique imediatamente ao HEMOPE.
                </Text>
                <Text style={[styles.backText, styles.highlightText]}>
                  Este documento não substitui a identidade civil.
                </Text>
              </View>

              <View style={styles.contactInfo}>
                <Text style={styles.contactText}>www.hemope.pe.gov.br</Text>
                <Text style={styles.contactText}>Recife - Pernambuco</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <PrimaryButton 
        title="Exportar Carteira Digital" 
        style={styles.printButton} 
        onPress={handleExport} 
      />
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
  cardContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderRadius: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    height: 220, 
    borderWidth: 1,
    borderColor: '#eee',
    position: 'relative', // Para posicionamento absoluto do footer se necessário
  },
  cardBack: {
    backgroundColor: '#fdfdfd',
  },
  // Frente
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoMark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#C00017',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoHeart: {
    color: '#C00017',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  logoSubtitle: {
    fontSize: 8,
    color: '#666',
    textTransform: 'uppercase',
  },
  headerRight: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  headerLabel: {
    fontSize: 8,
    color: '#fff',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardBody: {
    padding: 16,
    flex: 1,
  },
  mainInfo: {
    marginBottom: 8,
  },
  label: {
    fontSize: 9,
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 2,
    fontWeight: '600',
  },
  valueName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  columnLeft: {
      flex: 1,
  },
  columnRight: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingTop: 10,
  },
  detailItem: {
    marginBottom: 8,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  valueMono: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'monospace', // Se disponível
  },
  bloodTypeWrapper: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  bloodTypeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  bloodTypeLabel: {
    fontSize: 8,
    color: '#d32f2f',
    fontWeight: '700',
    marginBottom: -2,
  },
  bloodType: {
    fontSize: 24,
    fontWeight: '900',
    color: '#d32f2f',
  },
  cardFooter: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    alignItems: 'flex-end',
  },
  barcodeContainer: {
    alignItems: 'flex-end',
  },
  barcodeLines: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    height: 25,
    marginBottom: 1,
  },
  barcodeText: {
    fontSize: 9,
    fontFamily: 'monospace',
    letterSpacing: 2,
    textAlign: 'right',
  },
  
  // Verso
  magneticStrip: {
    height: 35,
    backgroundColor: '#333',
    marginTop: 20,
    width: '100%',
  },
  backContent: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  signatureArea: {
    marginTop: 10,
    width: '70%',
  },
  signatureLine: {
    height: 25,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 8,
    color: '#666',
  },
  legalTextContainer: {
    marginTop: 15,
  },
  backText: {
    fontSize: 9,
    color: '#555',
    lineHeight: 12,
    marginBottom: 6,
    textAlign: 'justify',
  },
  highlightText: {
    fontWeight: '700',
    color: '#333',
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  contactText: {
    fontSize: 8,
    color: '#888',
  },
  printButton: {
    marginTop: spacing.sm,
  },
});
