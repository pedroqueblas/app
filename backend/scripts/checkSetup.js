require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function checkSetup() {
  console.log('🔍 Verificando configuração do sistema...\n');

  let allOk = true;

  // 1. Verificar arquivo .env
  console.log('1️⃣ Verificando arquivo .env...');
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.error('   ❌ Arquivo .env não encontrado!');
    console.error('   💡 Execute: copy env.example .env');
    allOk = false;
  } else {
    console.log('   ✅ Arquivo .env existe');
    
    // Verificar variáveis importantes
    const requiredVars = ['DB_PASSWORD', 'JWT_SECRET'];
    for (const varName of requiredVars) {
      if (!process.env[varName] || process.env[varName].trim() === '') {
        console.error(`   ❌ ${varName} não está configurado no .env`);
        allOk = false;
      } else {
        console.log(`   ✅ ${varName} configurado`);
      }
    }
  }
  console.log('');

  // 2. Verificar conexão MySQL
  console.log('2️⃣ Verificando conexão MySQL...');
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      connectTimeout: 5000,
    });
    console.log('   ✅ Conectado ao MySQL');
    await connection.end();
  } catch (error) {
    console.error('   ❌ Erro ao conectar:', error.message);
    console.error('   💡 Verifique se MySQL está rodando e a senha está correta');
    allOk = false;
  }
  console.log('');

  // 3. Verificar banco de dados
  console.log('3️⃣ Verificando banco de dados...');
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    const dbName = process.env.DB_NAME || 'hemope_db';
    const [databases] = await connection.query('SHOW DATABASES LIKE ?', [dbName]);
    
    if (databases.length === 0) {
      console.error(`   ❌ Banco de dados '${dbName}' não existe`);
      console.error('   💡 Execute: npm run init-db');
      allOk = false;
    } else {
      console.log(`   ✅ Banco de dados '${dbName}' existe`);
    }

    await connection.end();
  } catch (error) {
    console.error('   ❌ Erro ao verificar banco:', error.message);
    allOk = false;
  }
  console.log('');

  // 4. Verificar tabelas
  console.log('4️⃣ Verificando tabelas...');
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hemope_db',
    });

    const requiredTables = ['donors', 'users', 'import_logs'];
    const [tables] = await connection.query('SHOW TABLES');

    const existingTables = tables.map(row => Object.values(row)[0]);

    for (const table of requiredTables) {
      if (existingTables.includes(table)) {
        console.log(`   ✅ Tabela '${table}' existe`);
      } else {
        console.error(`   ❌ Tabela '${table}' não existe`);
        console.error('   💡 Execute: npm run init-db');
        allOk = false;
      }
    }

    await connection.end();
  } catch (error) {
    console.error('   ❌ Erro ao verificar tabelas:', error.message);
    allOk = false;
  }
  console.log('');

  // 5. Verificar usuário admin
  console.log('5️⃣ Verificando usuário admin...');
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hemope_db',
    });

    const [admins] = await connection.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'admin'"
    );

    if (admins[0].count === 0) {
      console.error('   ❌ Nenhum usuário admin encontrado');
      console.error('   💡 Execute: npm run create-admin');
      allOk = false;
    } else {
      console.log(`   ✅ ${admins[0].count} usuário(s) admin encontrado(s)`);
    }

    await connection.end();
  } catch (error) {
    console.error('   ❌ Erro ao verificar admin:', error.message);
    allOk = false;
  }
  console.log('');

  // Resumo
  console.log('═══════════════════════════════════════');
  if (allOk) {
    console.log('✅ Tudo configurado corretamente!');
    console.log('');
    console.log('🚀 Você pode iniciar o backend:');
    console.log('   npm run dev');
    console.log('');
    console.log('📱 Depois inicie o app em outro terminal:');
    console.log('   cd ..');
    console.log('   npm start');
  } else {
    console.log('❌ Há problemas na configuração');
    console.log('');
    console.log('📋 Siga as instruções acima para corrigir');
    console.log('');
    console.log('💡 Comandos úteis:');
    console.log('   npm run init-db      - Criar banco de dados');
    console.log('   npm run create-admin - Criar usuário admin');
    console.log('   npm run test-connection - Testar conexão MySQL');
    process.exit(1);
  }
  console.log('═══════════════════════════════════════');
}

checkSetup();




