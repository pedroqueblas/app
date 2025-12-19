require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  let connection;

  try {
    // Verificar se variáveis de ambiente estão configuradas
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = process.env.DB_PORT || 3306;
    const dbUser = process.env.DB_USER || 'root';
    const dbPassword = process.env.DB_PASSWORD || '';

    console.log('🔌 Tentando conectar ao MySQL...');
    console.log(`   Host: ${dbHost}:${dbPort}`);
    console.log(`   User: ${dbUser}`);
    console.log(`   Password: ${dbPassword ? '***configurada***' : '⚠️ NÃO CONFIGURADA'}`);

    if (!dbPassword) {
      console.error('\n❌ ERRO: Senha do MySQL não configurada!');
      console.error('\n📝 Para corrigir:');
      console.error('   1. Crie o arquivo .env na pasta backend:');
      console.error('      copy env.example .env');
      console.error('   2. Edite o arquivo .env e configure DB_PASSWORD com a senha do MySQL');
      console.error('   3. Execute novamente: npm run init-db\n');
      process.exit(1);
    }

    // Conectar sem especificar database (para criar o banco se necessário)
    connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
    });

    console.log('✅ Conectado ao MySQL');

    // Ler arquivo SQL de migração
    const sqlPath = path.join(__dirname, '../database/migrations/001_create_tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Executar SQL
    const statements = sql.split(';').filter((stmt) => stmt.trim().length > 0);

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    console.log('✅ Banco de dados inicializado com sucesso!');
    console.log('📊 Tabelas criadas:');
    console.log('   - donors');
    console.log('   - users');
    console.log('   - import_logs');

    await connection.end();
  } catch (error) {
    console.error('\n❌ Erro ao inicializar banco de dados:', error.message);
    
    // Mensagens de ajuda específicas
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.error('\n🔍 Problema: Não foi possível conectar ao MySQL');
      console.error('\n📋 Verifique:');
      console.error('   1. O MySQL está rodando?');
      console.error('      - Abra o Gerenciador de Tarefas (Ctrl+Shift+Esc)');
      console.error('      - Procure por "MySQL" nos processos');
      console.error('      - Se não estiver, inicie o serviço MySQL');
      console.error('   2. As configurações no arquivo .env estão corretas?');
      console.error('      - DB_HOST=localhost');
      console.error('      - DB_PORT=3306');
      console.error('      - DB_USER=root');
      console.error('      - DB_PASSWORD=sua_senha_aqui');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n🔍 Problema: Acesso negado (senha incorreta)');
      console.error('\n📋 Verifique:');
      console.error('   1. A senha no arquivo .env está correta?');
      console.error('   2. Teste a conexão manualmente:');
      console.error('      mysql -u root -p');
      console.error('   3. Se não conseguir conectar, pode precisar resetar a senha do MySQL');
    } else if (error.code === 'ENOENT') {
      console.error('\n🔍 Problema: Arquivo .env não encontrado');
      console.error('\n📋 Solução:');
      console.error('   1. Crie o arquivo .env:');
      console.error('      copy env.example .env');
      console.error('   2. Edite o .env e configure DB_PASSWORD');
    }
    
    console.error('\n💡 Dica: Consulte o arquivo GUIA_INSTALACAO_MYSQL.md para mais ajuda\n');
    
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

initDatabase();

