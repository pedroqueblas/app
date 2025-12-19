-- Criar banco de dados (se não existir)
CREATE DATABASE IF NOT EXISTS hemope_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE hemope_db;

-- Tabela de doadores (alimentada via XLS)
CREATE TABLE IF NOT EXISTS donors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo_doador VARCHAR(50) UNIQUE NOT NULL COMMENT 'Código único do doador',
  nome_completo VARCHAR(255) NOT NULL,
  tipo_sanguineo VARCHAR(5) NOT NULL COMMENT 'Ex: O+, A-, B+, AB-',
  data_nascimento DATE,
  sexo ENUM('M', 'F', 'Outro') DEFAULT NULL,
  telefone VARCHAR(20),
  email VARCHAR(255),
  cpf VARCHAR(14),
  rg VARCHAR(20),
  endereco TEXT,
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_codigo_doador (codigo_doador),
  INDEX idx_email (email),
  INDEX idx_cpf (cpf)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de usuários (vinculados aos doadores)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  donor_id INT NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE,
  INDEX idx_email (email),
  INDEX idx_donor_id (donor_id),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de logs de importação XLS
CREATE TABLE IF NOT EXISTS import_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  total_rows INT DEFAULT 0,
  successful_imports INT DEFAULT 0,
  failed_imports INT DEFAULT 0,
  errors TEXT,
  imported_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (imported_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



