const pool = require('../database/config');

class Donor {
  /**
   * Buscar doador por código
   */
  static async findByCodigo(codigoDoador) {
    const [rows] = await pool.execute(
      'SELECT * FROM donors WHERE codigo_doador = ?',
      [codigoDoador]
    );
    return rows[0] || null;
  }

  /**
   * Buscar doador por ID
   */
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM donors WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Criar novo doador
   */
  static async create(donorData) {
    const {
      codigo_doador,
      nome_completo,
      tipo_sanguineo,
      data_nascimento,
      sexo,
      telefone,
      email,
      cpf,
      rg,
      endereco,
      cidade,
      estado,
      cep,
    } = donorData;

    const [result] = await pool.execute(
      `INSERT INTO donors (
        codigo_doador, nome_completo, tipo_sanguineo, data_nascimento,
        sexo, telefone, email, cpf, rg, endereco, cidade, estado, cep
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        codigo_doador,
        nome_completo,
        tipo_sanguineo,
        data_nascimento || null,
        sexo || null,
        telefone || null,
        email || null,
        cpf || null,
        rg || null,
        endereco || null,
        cidade || null,
        estado || null,
        cep || null,
      ]
    );

    return this.findById(result.insertId);
  }

  /**
   * Atualizar doador
   */
  static async update(id, donorData) {
    const fields = [];
    const values = [];

    Object.keys(donorData).forEach((key) => {
      if (donorData[key] !== undefined && donorData[key] !== null) {
        fields.push(`${key} = ?`);
        values.push(donorData[key]);
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    await pool.execute(
      `UPDATE donors SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  /**
   * Criar ou atualizar doador (upsert)
   */
  static async upsert(donorData) {
    const existing = await this.findByCodigo(donorData.codigo_doador);

    if (existing) {
      return this.update(existing.id, donorData);
    }

    return this.create(donorData);
  }

  /**
   * Verificar se código do doador existe
   */
  static async codigoExists(codigoDoador) {
    const donor = await this.findByCodigo(codigoDoador);
    return !!donor;
  }

  /**
   * Verificar se doador já está vinculado a um usuário
   */
  static async isLinkedToUser(donorId) {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as count FROM users WHERE donor_id = ?',
      [donorId]
    );
    return rows[0].count > 0;
  }
}

module.exports = Donor;



