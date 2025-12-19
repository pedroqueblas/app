require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hemope_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Pool de conexões
const pool = mysql.createPool(dbConfig);

// Testar conexão
pool.getConnection()
  .then((connection) => {
    console.log('✅ Conectado ao banco de dados MySQL');
    connection.release();
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar ao banco de dados:', error.message);
    console.log('💡 Certifique-se de que o MySQL está rodando e as credenciais estão corretas');
  });

module.exports = pool;



