const Donor = require('../models/Donor');

class DonorController {
  /**
   * Buscar doador pelo código
   */
  static async getByCodigo(req, res, next) {
    try {
      const { codigo } = req.params;

      if (!codigo) {
        return res.status(400).json({
          success: false,
          message: 'Código do doador é obrigatório',
        });
      }

      const donor = await Donor.findByCodigo(codigo);

      if (!donor) {
        return res.status(404).json({
          success: false,
          message: 'Doador não encontrado para o código informado',
        });
      }

      return res.json({
        success: true,
        data: {
          id: donor.id,
          codigo_doador: donor.codigo_doador,
          nome_completo: donor.nome_completo,
          tipo_sanguineo: donor.tipo_sanguineo,
          data_nascimento: donor.data_nascimento,
          sexo: donor.sexo,
          telefone: donor.telefone,
          email: donor.email,
          cpf: donor.cpf,
          rg: donor.rg,
          endereco: donor.endereco,
          cidade: donor.cidade,
          estado: donor.estado,
          cep: donor.cep,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DonorController;


