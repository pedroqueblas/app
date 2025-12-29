const XLSX = require('xlsx');
const Donor = require('../models/Donor');
const ImportLog = require('../models/ImportLog');

class XLSService {
  /**
   * Processar arquivo XLS/XLSX e importar doadores
   */
  static async processFile(filePath, filename, userId = null) {
    let workbook;
    let worksheet;
    let data;

    try {
      // Ler arquivo Excel
      workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      worksheet = workbook.Sheets[sheetName];
      data = XLSX.utils.sheet_to_json(worksheet);
    } catch (error) {
      throw new Error(`Erro ao ler arquivo Excel: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('Arquivo Excel está vazio ou não contém dados válidos');
    }

    const totalRows = data.length;
    let successfulImports = 0;
    let failedImports = 0;
    const errors = [];

    // Processar cada linha
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2; // +2 porque linha 1 é cabeçalho e índice começa em 0

      try {
        // Validar código do doador (obrigatório)
        const codigoDoador = this.extractValue(row, 'codigo_doador');
        if (!codigoDoador) {
          throw new Error('Código do doador é obrigatório');
        }

        // Normalizar dados
        const donorData = {
          codigo_doador: String(codigoDoador).trim(),
          nome_completo: this.extractValue(row, 'nome_completo') || this.extractValue(row, 'nome') || '',
          tipo_sanguineo: this.extractValue(row, 'tipo_sanguineo') || this.extractValue(row, 'tipo_sangue') || '',
          data_nascimento: this.parseDate(this.extractValue(row, 'data_nascimento')),
          sexo: this.normalizeSexo(this.extractValue(row, 'sexo')),
          telefone: this.extractValue(row, 'telefone') || this.extractValue(row, 'celular') || null,
          email: this.extractValue(row, 'email') || null,
          cpf: this.extractValue(row, 'cpf') || null,
          rg: this.extractValue(row, 'rg') || null,
          endereco: this.extractValue(row, 'endereco') || null,
          cidade: this.extractValue(row, 'cidade') || null,
          estado: this.extractValue(row, 'estado') || null,
          cep: this.extractValue(row, 'cep') || null,
        };

        // Validar campos obrigatórios
        if (!donorData.nome_completo) {
          throw new Error('Nome completo é obrigatório');
        }

        if (!donorData.tipo_sanguineo) {
          throw new Error('Tipo sanguíneo é obrigatório');
        }

        // Criar ou atualizar doador
        await Donor.upsert(donorData);
        successfulImports++;
      } catch (error) {
        failedImports++;
        errors.push({
          row: rowNumber,
          codigo_doador: row.codigo_doador || 'N/A',
          error: error.message,
        });
      }
    }

    // Criar log de importação
    await ImportLog.create({
      filename,
      total_rows: totalRows,
      successful_imports: successfulImports,
      failed_imports: failedImports,
      errors: errors.length > 0 ? errors : null,
      imported_by: userId,
    });

    return {
      total_rows: totalRows,
      successful_imports: successfulImports,
      failed_imports: failedImports,
      errors: errors.length > 0 ? errors : null,
    };
  }

  /**
   * Extrair valor do objeto, tentando diferentes variações de nome de coluna
   */
  static extractValue(row, key) {
    // Tentar exato
    if (row[key] !== undefined) {
      return row[key];
    }

    // Tentar variações com diferentes casos
    const variations = [
      key.toLowerCase(),
      key.toUpperCase(),
      this.capitalize(key),
      key.replace(/_/g, ' '),
      key.replace(/_/g, '-'),
    ];

    for (const variation of variations) {
      if (row[variation] !== undefined) {
        return row[variation];
      }
    }

    return null;
  }

  /**
   * Capitalizar primeira letra
   */
  static capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Parsear data de diferentes formatos
   */
  static parseDate(dateValue) {
    if (!dateValue) return null;

    // Se já for uma data válida
    if (dateValue instanceof Date) {
      return dateValue.toISOString().split('T')[0];
    }

    // Tentar parsear string
    const dateStr = String(dateValue).trim();
    if (!dateStr || dateStr === 'null' || dateStr === 'undefined') {
      return null;
    }

    // Tentar diferentes formatos
    const formats = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
      /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
    ];

    for (const format of formats) {
      if (format.test(dateStr)) {
        // Converter para formato MySQL (YYYY-MM-DD)
        if (dateStr.includes('/')) {
          const [day, month, year] = dateStr.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        if (dateStr.includes('-') && dateStr.length === 10) {
          const parts = dateStr.split('-');
          if (parts[0].length === 2) {
            // DD-MM-YYYY
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
          // YYYY-MM-DD
          return dateStr;
        }
      }
    }

    // Tentar parsear como número (Excel date serial)
    const excelDate = parseFloat(dateStr);
    if (!isNaN(excelDate) && excelDate > 0) {
      // Excel date serial number (days since 1900-01-01)
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch.getTime() + excelDate * 24 * 60 * 60 * 1000);
      return date.toISOString().split('T')[0];
    }

    return null;
  }

  /**
   * Normalizar campo sexo
   */
  static normalizeSexo(sexo) {
    if (!sexo) return null;

    const sexoStr = String(sexo).toUpperCase().trim();
    
    if (sexoStr === 'M' || sexoStr === 'MASCULINO' || sexoStr === 'MALE') {
      return 'M';
    }
    if (sexoStr === 'F' || sexoStr === 'FEMININO' || sexoStr === 'FEMALE') {
      return 'F';
    }
    
    return null;
  }
}

module.exports = XLSService;




