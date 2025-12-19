const pool = require('../database/config');

class ImportLog {
  /**
   * Criar log de importação
   */
  static async create(logData) {
    const {
      filename,
      total_rows,
      successful_imports,
      failed_imports,
      errors,
      imported_by,
    } = logData;

    const [result] = await pool.execute(
      `INSERT INTO import_logs 
       (filename, total_rows, successful_imports, failed_imports, errors, imported_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        filename,
        total_rows || 0,
        successful_imports || 0,
        failed_imports || 0,
        errors ? JSON.stringify(errors) : null,
        imported_by || null,
      ]
    );

    return result.insertId;
  }

  /**
   * Buscar todos os logs
   */
  static async findAll(limit = 50) {
    const [rows] = await pool.execute(
      `SELECT il.*, u.email as imported_by_email 
       FROM import_logs il 
       LEFT JOIN users u ON il.imported_by = u.id 
       ORDER BY il.created_at DESC 
       LIMIT ?`,
      [limit]
    );
    return rows;
  }

  /**
   * Buscar log por ID
   */
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT il.*, u.email as imported_by_email 
       FROM import_logs il 
       LEFT JOIN users u ON il.imported_by = u.id 
       WHERE il.id = ?`,
      [id]
    );
    return rows[0] || null;
  }
}

module.exports = ImportLog;



