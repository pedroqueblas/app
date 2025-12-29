import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@hemope_users';
const SESSION_KEY = '@hemope_current_user';
const APPOINTMENT_KEY = '@hemope_appointment';
const LAST_DONATION_KEY = '@hemope_last_donation';

export const LocalStorage = {
  /**
   * Registra um novo usuário
   */
  async registerUser(userData) {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Verificar se já existe (por email ou CPF/Código)
      const exists = users.find(
        u => u.email === userData.email || u.codigo_doador === userData.codigo_doador
      );

      if (exists) {
        throw new Error('Usuário já cadastrado com este e-mail ou código.');
      }

      // Adicionar novo usuário
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      return newUser;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Realiza login
   */
  async loginUser(identifier, password) {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];

      // Identifier pode ser email, cpf ou codigo_doador
      const user = users.find(
        u => (u.email === identifier || u.cpf === identifier || u.codigo_doador === identifier) && u.password === password
      );

      if (!user) {
        throw new Error('Credenciais inválidas.');
      }

      return user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Busca dados (Mock de busca de doador)
   */
  async getDonorByCode(code) {
    // Simulação: se o código for '12345', retorna dados fake
    if (code === '12345') {
      return {
        nome_completo: 'João da Silva',
        tipo_sanguineo: 'O+',
        sexo: 'M',
        telefone: '81999999999',
        email: 'joao@example.com',
        rg: '1234567',
        endereco: 'Rua das Flores, 123',
        data_nascimento: '1990-01-01',
      };
    }
    return null;
  },

  /**
   * Busca dados por CPF (Mock)
   */
  async getDonorByCpf(cpf) {
    // Simulação: retorna dados fake para testes
    if (cpf === '11122233344') {
       return {
         codigo_doador: '12345',
         nome_completo: 'Maria Oliveira',
         tipo_sanguineo: 'A-',
         sexo: 'F',
         telefone: '81988887777',
         email: 'maria@example.com',
         rg: '7654321',
         endereco: 'Av. Boa Viagem, 500',
         data_nascimento: '1995-05-15',
         hemocentro: 'recife',
       };
    }
    return null;
  },

  /**
   * Gerenciamento de Sessão
   */
  async saveSession(user) {
    try {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao salvar sessão', error);
    }
  },

  async getSession() {
    try {
      const json = await AsyncStorage.getItem(SESSION_KEY);
      return json ? JSON.parse(json) : null;
    } catch (error) {
      console.error('Erro ao recuperar sessão', error);
      return null;
    }
  },

  async clearSession() {
    try {
      await AsyncStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('Erro ao limpar sessão', error);
    }
  },

  /**
   * Agendamentos
   */
  async saveAppointment(appointment) {
    try {
      await AsyncStorage.setItem(APPOINTMENT_KEY, JSON.stringify(appointment));
    } catch (e) {
      throw e;
    }
  },

  async getAppointment() {
    try {
      const json = await AsyncStorage.getItem(APPOINTMENT_KEY);
      return json ? JSON.parse(json) : null;
    } catch (e) {
      return null;
    }
  },
  
  async removeAppointment() {
      try {
          await AsyncStorage.removeItem(APPOINTMENT_KEY);
      } catch (e) {
          throw e;
      }
  },

  /**
   * Atualiza dados do usuário
   */
  async updateUser(updatedUser) {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      let users = usersJson ? JSON.parse(usersJson) : [];

      const index = users.findIndex(u => u.id === updatedUser.id);
      if (index === -1) {
        throw new Error('Usuário não encontrado.');
      }

      // Atualiza o usuário
      users[index] = { ...users[index], ...updatedUser };
      
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Se for o usuário atual da sessão, atualiza também a sessão
      const currentUser = await this.getSession();
      if (currentUser && currentUser.id === updatedUser.id) {
        await this.saveSession(users[index]);
      }
      
      return users[index];
    } catch (error) {
      throw error;
    }
  }
};
