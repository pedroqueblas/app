import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';
import PrimaryButton from '../components/PrimaryButton';
import { LocalStorage } from '../services/LocalStorage';
import { Picker } from '@react-native-picker/picker';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado para formulário de edição
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const sessionUser = await LocalStorage.getSession();
    setUser(sessionUser);
    if (sessionUser) {
      setEditForm(sessionUser);
    }
  }

  async function handleLogout() {
    await LocalStorage.clearSession();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  function toggleEdit() {
    if (isEditing) {
      // Cancelar edição: restaura dados originais
      setEditForm(user);
    }
    setIsEditing(!isEditing);
  }

  async function saveProfile() {
    try {
      // Atualizar no LocalStorage
      const updatedUser = await LocalStorage.updateUser(editForm);
      setUser(updatedUser);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
      console.error(error);
    }
  }

  const handleFieldChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const getInitials = (name) => {
    if (!name) return 'HP';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header com Design Moderno */}
        <View style={styles.headerBackground}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Meu Perfil</Text>
            <TouchableOpacity onPress={toggleEdit} style={styles.editButtonHeader}>
              <Text style={styles.editButtonText}>{isEditing ? 'Cancelar' : 'Editar'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Avatar Flutuante */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>
                {getInitials(user.nome_completo)}
              </Text>
            </View>
          </View>

          <Text style={styles.name}>{user.nome_completo}</Text>
          <Text style={styles.role}>Doador Voluntário</Text>

          {/* Formulário / Visualização */}
          <View style={styles.formContainer}>
            <InfoCard title="Informações Pessoais">
              <InfoRow 
                label="Nome Completo" 
                value={user.nome_completo} 
                field="nome_completo" 
                isEditing={isEditing}
                editValue={editForm.nome_completo}
                onChangeText={handleFieldChange}
              />
              <InfoRow 
                label="CPF" 
                value={user.cpf} 
                field="cpf" 
                editable={false} 
                isEditing={isEditing}
                editValue={editForm.cpf}
              />
              <InfoRow 
                label="RG" 
                value={user.rg} 
                field="rg" 
                isEditing={isEditing}
                editValue={editForm.rg}
                onChangeText={handleFieldChange}
              />
              <InfoRow 
                label="Data de Nascimento" 
                value={user.data_nascimento} 
                field="data_nascimento" 
                isEditing={isEditing}
                editValue={editForm.data_nascimento}
                onChangeText={handleFieldChange}
              />
              <InfoRow 
                label="Sexo" 
                value={user.sexo} 
                field="sexo" 
                isEditing={isEditing}
                editValue={editForm.sexo}
                onChangeText={handleFieldChange}
              />
            </InfoCard>

            <InfoCard title="Dados de Doador">
              <InfoRow 
                label="Código de Doador" 
                value={user.codigo_doador} 
                field="codigo_doador" 
                editable={false} 
                isEditing={isEditing}
                editValue={editForm.codigo_doador}
              />
              <InfoRow 
                label="Tipo Sanguíneo" 
                value={user.tipo_sanguineo} 
                field="tipo_sanguineo" 
                editable={false} 
                isEditing={isEditing}
                editValue={editForm.tipo_sanguineo}
              />
            </InfoCard>

            <InfoCard title="Contato">
              <InfoRow 
                label="E-mail" 
                value={user.email} 
                field="email" 
                isEditing={isEditing}
                editValue={editForm.email}
                onChangeText={handleFieldChange}
              />
              <InfoRow 
                label="Telefone" 
                value={user.telefone} 
                field="telefone" 
                isEditing={isEditing}
                editValue={editForm.telefone}
                onChangeText={handleFieldChange}
              />
              <InfoRow 
                label="Endereço" 
                value={user.endereco} 
                field="endereco" 
                isEditing={isEditing}
                editValue={editForm.endereco}
                onChangeText={handleFieldChange}
              />
            </InfoCard>

            {isEditing && (
              <PrimaryButton 
                title="Salvar Alterações" 
                onPress={saveProfile} 
                style={styles.saveButton} 
              />
            )}

            {!isEditing && (
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Sair da Conta</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Componentes extraídos para evitar re-renderização e perda de foco
const InfoCard = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {children}
  </View>
);

const InfoRow = ({ label, value, field, isEditing, editable = true, type = 'text', onChangeText, editValue }) => {
  if (isEditing && editable) {
    return (
      <View style={styles.editRow}>
        <Text style={styles.editLabel}>{label}</Text>
        {type === 'text' && (
          <TextInput
            style={styles.editInput}
            value={editValue}
            onChangeText={(text) => onChangeText && onChangeText(field, text)}
            placeholder={label}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '---'}</Text>
    </View>
  );
};

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
  headerBackground: {
    backgroundColor: colors.primary,
    height: 120, // Reduced height for better proportion
    paddingTop: 20, // Adjusted padding
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    justifyContent: 'center', // Center content vertically
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.heading2,
    color: '#fff',
    fontSize: 24,
  },
  editButtonHeader: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -40, // Adjusted negative margin
    marginBottom: 16,
  },
  avatar: {
    width: 100, // Slightly smaller avatar
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  name: {
    ...typography.heading2,
    textAlign: 'center',
    color: colors.textPrimary,
    fontSize: 22,
    marginBottom: 4,
  },
  role: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 24,
    fontSize: 14,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardTitle: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1.5,
    textAlign: 'right',
  },
  editRow: {
    marginBottom: 12,
  },
  editLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  editInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: '#fafafa',
  },
  saveButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  logoutButton: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    color: colors.error,
    fontWeight: 'bold',
    fontSize: 16,
  },
});


