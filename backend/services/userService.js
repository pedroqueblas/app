const User = require('../models/User');

class UserService {
  /**
   * Buscar dados do usuário autenticado
   */
  static async getMe(userId) {
    const user = await User.findByIdWithDonor(userId);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      donor: {
        id: user.donor_id,
        codigo_doador: user.codigo_doador,
        nome_completo: user.nome_completo,
        tipo_sanguineo: user.tipo_sanguineo,
        data_nascimento: user.data_nascimento,
        sexo: user.sexo,
        telefone: user.telefone,
        email: user.donor_email,
        cpf: user.cpf,
        rg: user.rg,
        endereco: user.endereco,
        cidade: user.cidade,
        estado: user.estado,
        cep: user.cep,
      },
    };
  }
}

module.exports = UserService;



