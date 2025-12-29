const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Donor = require('../models/Donor');

class AuthService {
  /**
   * Registrar novo usuário vinculado ao código do doador
   * Opcionalmente atualiza dados do doador com informações enviadas no cadastro.
   */
  static async register(email, password, codigoDoador, donorExtraData = {}) {
    // Validar se código do doador existe
    const donor = await Donor.findByCodigo(codigoDoador);
    if (!donor) {
      throw new Error('Código do doador não encontrado');
    }

    // Verificar se doador já está vinculado a um usuário
    const existingUser = await User.findByDonorId(donor.id);
    if (existingUser) {
      throw new Error('Este código do doador já está vinculado a uma conta');
    }

    // Verificar se email já existe
    const emailExists = await User.emailExists(email);
    if (emailExists) {
      throw new Error('Email já cadastrado');
    }

    // Atualizar dados do doador com informações adicionais (se enviadas)
    const allowedFields = [
      'nome_completo',
      'tipo_sanguineo',
      'data_nascimento',
      'sexo',
      'telefone',
      'email',
      'cpf',
      'rg',
      'endereco',
      'cidade',
      'estado',
      'cep',
    ];

    const donorUpdateData = {};
    allowedFields.forEach((field) => {
      if (
        Object.prototype.hasOwnProperty.call(donorExtraData, field) &&
        donorExtraData[field]
      ) {
        donorUpdateData[field] = donorExtraData[field];
      }
    });

    if (Object.keys(donorUpdateData).length > 0) {
      await Donor.update(donor.id, donorUpdateData);
    }

    // Hash da senha
    const password_hash = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await User.create({
      email,
      password_hash,
      donor_id: donor.id,
      role: 'user',
    });

    // Gerar token JWT
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        donor: {
          codigo_doador: user.codigo_doador,
          nome_completo: user.nome_completo,
          tipo_sanguineo: user.tipo_sanguineo,
        },
      },
      token,
    };
  }

  /**
   * Login do usuário
   */
  static async login(email, password) {
    // Buscar usuário
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    // Verificar se usuário está ativo
    if (!user.is_active) {
      throw new Error('Conta desativada. Entre em contato com o suporte');
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      throw new Error('Email ou senha inválidos');
    }

    // Buscar dados completos do doador
    const userWithDonor = await User.findByIdWithDonor(user.id);
    if (!userWithDonor) {
      throw new Error('Erro ao buscar dados do doador');
    }

    // Gerar token JWT
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: userWithDonor.id,
        email: userWithDonor.email,
        role: userWithDonor.role,
        donor: {
          codigo_doador: userWithDonor.codigo_doador,
          nome_completo: userWithDonor.nome_completo,
          tipo_sanguineo: userWithDonor.tipo_sanguineo,
          data_nascimento: userWithDonor.data_nascimento,
          sexo: userWithDonor.sexo,
          telefone: userWithDonor.telefone,
          email: userWithDonor.donor_email,
          cpf: userWithDonor.cpf,
          rg: userWithDonor.rg,
          endereco: userWithDonor.endereco,
          cidade: userWithDonor.cidade,
          estado: userWithDonor.estado,
          cep: userWithDonor.cep,
        },
      },
      token,
    };
  }

  /**
   * Gerar token JWT
   */
  static generateToken(userId, email, role) {
    const payload = {
      userId,
      email,
      role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  }

  /**
   * Verificar token JWT
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }
}

module.exports = AuthService;




