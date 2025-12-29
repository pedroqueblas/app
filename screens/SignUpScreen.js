import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, typography } from '../theme';
import PrimaryButton from '../components/PrimaryButton';
import SectionTitle from '../components/SectionTitle';
import { LocalStorage } from '../services/LocalStorage';
import { HEMOCENTROS } from '../constants/hemocentros';

export default function SignUpScreen({ navigation }) {
  const [codigoDoador, setCodigoDoador] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [tipoSanguineo, setTipoSanguineo] = useState('');
  const [sexo, setSexo] = useState('');
  const [rg, setRg] = useState('');
  const [hemocentro, setHemocentro] = useState('');

  // Estados de Data
  const [dataNascimento, setDataNascimento] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [loadingBuscar, setLoadingBuscar] = useState(false);
  const [loadingSalvar, setLoadingSalvar] = useState(false);
  const [error, setError] = useState('');

  // Estados para controle de Picker no iOS
  const [modalPickerVisible, setModalPickerVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState(null); // 'hemocentro', 'tipoSanguineo', 'sexo'

  const openPicker = (target) => {
    setPickerTarget(target);
    setModalPickerVisible(true);
  };

  const closePicker = () => {
    setModalPickerVisible(false);
    setPickerTarget(null);
  };

  const getPickerLabel = (target, value) => {
    if (!value) return 'Selecione';
    if (target === 'hemocentro') {
      const h = HEMOCENTROS.find(item => item.id === value);
      return h ? h.nome : value;
    }
    return value;
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dataNascimento;
    setShowDatePicker(Platform.OS === 'ios');
    setDataNascimento(currentDate);
    setDateSelected(true);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR');
  };

  async function handleBuscarCodigo() {
    if (!cpf.trim()) {
      setError('Informe o CPF para buscar seus dados.');
      return;
    }

    try {
      setError('');
      setLoadingBuscar(true);
      const donor = await LocalStorage.getDonorByCpf(cpf.trim());

      if (!donor) {
        setError('CPF não encontrado (modo offline).');
        return;
      }

      // Preenchimento automático dos dados encontrados
      setNomeCompleto(donor.nome_completo || '');
      setTipoSanguineo(donor.tipo_sanguineo || '');
      setSexo(donor.sexo || '');
      setTelefone(donor.telefone || '');
      setEmail(donor.email || '');
      setRg(donor.rg || '');
      setEndereco(donor.endereco || '');
      if (donor.codigo_doador) setCodigoDoador(donor.codigo_doador);
      if (donor.data_nascimento) {
        setDataNascimento(new Date(donor.data_nascimento));
        setDateSelected(true);
      }
      if (donor.hemocentro) setHemocentro(donor.hemocentro);

    } catch (err) {
      setError('Erro ao buscar dados do doador.');
    } finally {
      setLoadingBuscar(false);
    }
  }

  async function handleSubmit() {
    if (!cpf || !email || !senha || !confirmarSenha || !hemocentro) {
      setError('Preencha os campos obrigatórios.');
      return;
    }

    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      setError('');
      setLoadingSalvar(true);

      await LocalStorage.registerUser({
        email,
        password: senha,
        codigo_doador: codigoDoador.trim(),
        nome_completo: nomeCompleto,
        cpf,
        telefone,
        endereco,
        tipo_sanguineo: tipoSanguineo,
        sexo,
        rg,
        data_nascimento: dateSelected ? dataNascimento.toISOString().split('T')[0] : null,
        hemocentro,
      });

      Alert.alert('Conta criada', 'Sua conta foi criada com sucesso.', [
        { text: 'OK', onPress: () => navigation.replace('Login') },
      ]);
    } catch (err) {
      setError(err.message || 'Erro ao criar conta.');
    } finally {
      setLoadingSalvar(false);
    }
  }

  const getModalOptions = () => {
    if (pickerTarget === 'hemocentro') {
      return HEMOCENTROS.map(h => ({ label: h.nome, value: h.id }));
    }
    if (pickerTarget === 'tipoSanguineo') {
      return ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(t => ({ label: t, value: t }));
    }
    if (pickerTarget === 'sexo') {
      return [
        { label: 'Masculino', value: 'M' },
        { label: 'Feminino', value: 'F' },
        { label: 'Outro', value: 'O' }
      ];
    }
    return [];
  };

  const handleModalSelect = (value) => {
    if (pickerTarget === 'hemocentro') setHemocentro(value);
    if (pickerTarget === 'tipoSanguineo') setTipoSanguineo(value);
    if (pickerTarget === 'sexo') setSexo(value);
    closePicker();
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Criar Conta</Text>
          </View>

          {/* Seção CPF */}
          <View style={styles.section}>
            <SectionTitle>CPF</SectionTitle>
            <View style={styles.inlineRow}>
              <TextInput
                style={[styles.input, styles.flex1]}
                placeholder="CPF (somente números)"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={cpf}
                onChangeText={setCpf}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleBuscarCodigo}
                disabled={loadingBuscar}
              >
                {loadingBuscar ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text style={styles.searchButtonText}>Buscar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Seção Dados Pessoais */}
          <View style={styles.section}>
            <SectionTitle>Dados pessoais</SectionTitle>
            
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor="#999"
              value={nomeCompleto}
              onChangeText={setNomeCompleto}
            />

            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Endereço"
              placeholderTextColor="#999"
              value={endereco}
              onChangeText={setEndereco}
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Hemocentro de Origem</Text>
              {Platform.OS === 'ios' ? (
                <TouchableOpacity 
                  style={styles.pickerButton} 
                  onPress={() => openPicker('hemocentro')}
                >
                  <Text style={styles.pickerButtonText}>
                    {getPickerLabel('hemocentro', hemocentro)}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={hemocentro}
                    onValueChange={(val) => setHemocentro(val)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione o Hemocentro" value="" />
                    {HEMOCENTROS.map((h) => (
                      <Picker.Item key={h.id} label={h.nome} value={h.id} />
                    ))}
                  </Picker>
                </View>
              )}
            </View>

            <View style={styles.inlineRow}>
              <View style={[styles.flex1, styles.pickerContainer]}>
                <Text style={styles.label}>Tipo Sanguíneo</Text>
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity 
                    style={styles.pickerButton} 
                    onPress={() => openPicker('tipoSanguineo')}
                  >
                    <Text style={styles.pickerButtonText}>
                      {getPickerLabel('tipoSanguineo', tipoSanguineo)}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={tipoSanguineo}
                      onValueChange={(val) => setTipoSanguineo(val)}
                      style={styles.picker}
                    >
                      <Picker.Item label="--" value="" />
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(t => (
                        <Picker.Item key={t} label={t} value={t} />
                      ))}
                    </Picker>
                  </View>
                )}
              </View>

              <View style={[styles.flex1, styles.pickerContainer]}>
                <Text style={styles.label}>Sexo</Text>
                {Platform.OS === 'ios' ? (
                  <TouchableOpacity 
                    style={styles.pickerButton} 
                    onPress={() => openPicker('sexo')}
                  >
                    <Text style={styles.pickerButtonText}>
                      {getPickerLabel('sexo', sexo)}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={sexo}
                      onValueChange={(val) => setSexo(val)}
                      style={styles.picker}
                    >
                      <Picker.Item label="--" value="" />
                      <Picker.Item label="M" value="M" />
                      <Picker.Item label="F" value="F" />
                      <Picker.Item label="Outro" value="O" />
                    </Picker>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.inlineRow}>
              <TextInput
                style={[styles.input, styles.flex1]}
                placeholder="RG"
                placeholderTextColor="#999"
                value={rg}
                onChangeText={setRg}
              />
              <TouchableOpacity
                style={[styles.input, styles.flex1, styles.dateButton]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: dateSelected ? '#000' : '#999' }}>
                  {dateSelected ? formatDate(dataNascimento) : 'Nascimento'}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={dataNascimento}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeDate}
              />
            )}
          </View>

          {/* Seção Segurança */}
          <View style={styles.section}>
            <SectionTitle>Segurança</SectionTitle>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <PrimaryButton
            title={loadingSalvar ? 'Criando...' : 'Criar conta'}  
            onPress={handleSubmit}
            disabled={loadingSalvar}
            style={styles.primaryButton}
            textStyle={styles.primaryButtontext}
          />

          <TouchableOpacity 
            style={styles.loginLink} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginLinkText}>
              Já tem uma conta? <Text style={styles.loginLinkTextStrong}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal Picker Customizado para iOS/Android */}
      <Modal
        visible={modalPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closePicker}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closePicker}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {pickerTarget === 'hemocentro' ? 'Selecione o Hemocentro' :
                 pickerTarget === 'tipoSanguineo' ? 'Tipo Sanguíneo' :
                 pickerTarget === 'sexo' ? 'Sexo' : 'Selecione'}
              </Text>
              <TouchableOpacity onPress={closePicker}>
                <Text style={styles.modalCloseText}>Fechar</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={getModalOptions()}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => handleModalSelect(item.value)}
                >
                  <Text style={[
                    styles.modalOptionText, 
                    ((pickerTarget === 'hemocentro' && hemocentro === item.value) ||
                    (pickerTarget === 'tipoSanguineo' && tipoSanguineo === item.value) ||
                    (pickerTarget === 'sexo' && sexo === item.value)) && styles.modalOptionTextSelected
                  ]}>
                    {item.label}
                  </Text>
                  {(
                    (pickerTarget === 'hemocentro' && hemocentro === item.value) ||
                    (pickerTarget === 'tipoSanguineo' && tipoSanguineo === item.value) ||
                    (pickerTarget === 'sexo' && sexo === item.value)
                  ) && (
                    <Text style={styles.checkMark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.modalListContent}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.heading1,
    color: '#fff',
    textAlign: 'center',
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    height: 48,
    marginBottom: spacing.sm,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  inlineRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex1: {
    flex: 1,
  },
  searchButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  dateButton: {
    marginBottom: spacing.sm,
  },
  label: {
    marginBottom: 4,
    ...typography.caption,
    color: colors.textSecondary,
  },
  pickerContainer: {
    marginBottom: spacing.sm,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: '#fff',
    height: 48,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: spacing.md,
    ...typography.caption,
  },
  primaryButton: {
    backgroundColor: '#900', 
    height: 52,
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center',     
  },
  primaryButtontext: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

  loginLink: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingBottom: 40,
  },
  loginLinkText: {
    color: '#fff',
    fontSize: 14,
  },
  loginLinkTextStrong: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: '#fff',
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  pickerButtonText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%', 
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: '#f8f8f8',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    ...typography.subtitle,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalCloseText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalListContent: {
    paddingBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  modalOptionTextSelected: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  checkMark: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 18,
  },
});