const pool = require('../database/config');

class User {
  /**
   * Buscar usuário por email
   */
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }

  /**
   * Buscar usuário por ID
   */
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT u.*, d.codigo_doador, d.nome_completo, d.tipo_sanguineo 
       FROM users u 
       INNER JOIN donors d ON u.donor_id = d.id 
       WHERE u.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Buscar usuário com dados completos do doador
   */
  static async findByIdWithDonor(id) {
    const [rows] = await pool.execute(
      `SELECT 
        u.id, u.email, u.role, u.is_active, u.created_at,
        d.id as donor_id, d.codigo_doador, d.nome_completo, d.tipo_sanguineo,
        d.data_nascimento, d.sexo, d.telefone, d.email as donor_email,
        d.cpf, d.rg, d.endereco, d.cidade, d.estado, d.cep
       FROM users u 
       INNER JOIN donors d ON u.donor_id = d.id 
       WHERE u.id = ? AND u.is_active = TRUE`,
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Criar novo usuário
   */
  static async create(userData) {
    const { email, password_hash, donor_id, role = 'user' } = userData;

    const [result] = await pool.execute(
      'INSERT INTO users (email, password_hash, donor_id, role) VALUES (?, ?, ?, ?)',
      [email, password_hash, donor_id, role]
    );

    return this.findByIdWithDonor(result.insertId);
  }

  /**
   * Verificar se email já existe
   */
  static async emailExists(email) {
    const user = await this.findByEmail(email);
    return !!user;
  }

  /**
   * Buscar usuário por donor_id
   */
  static async findByDonorId(donorId) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE donor_id = ?',
      [donorId]
    );
    return rows[0] || null;
  }
}

module.exports = User;



