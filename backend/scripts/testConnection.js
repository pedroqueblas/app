require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Testando conexão com MySQL...\n');

  // Verificar variáveis de ambiente
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || 3306;
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'hemope_db';

  console.log('📋 Configurações encontradas:');
  console.log(`   DB_HOST: ${dbHost}`);
  console.log(`   DB_PORT: ${dbPort}`);
  console.log(`   DB_USER: ${dbUser}`);
  console.log(`   DB_PASSWORD: ${dbPassword ? '***configurada***' : '❌ NÃO CONFIGURADA'}`);
  console.log(`   DB_NAME: ${dbName}`);
  console.log('');

  if (!dbPassword) {
    console.error('❌ ERRO: Senha do MySQL não configurada no arquivo .env!');
    console.error('\n📝 Para corrigir:');
    console.error('   1. Abra o arquivo .env na pasta backend');
    console.error('   2. Encontre a linha: DB_PASSWORD=');
    console.error('   3. Adicione sua senha: DB_PASSWORD=sua_senha_aqui');
    console.error('   4. Salve o arquivo');
    console.error('   5. Execute novamente: npm run init-db\n');
    process.exit(1);
  }

  let connection;

  try {
    console.log('🔌 Tentando conectar ao MySQL...');

    // Tentar conectar sem especificar database primeiro
    connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      connectTimeout: 5000,
    });

    console.log('✅ Conectado ao MySQL com sucesso!\n');

    // Verificar se o banco existe
    const [databases] = await connection.query('SHOW DATABASES LIKE ?', [dbName]);
    
    if (databases.length > 0) {
      console.log(`✅ Banco de dados '${dbName}' já existe`);
    } else {
      console.log(`ℹ️  Banco de dados '${dbName}' não existe (será criado pelo init-db)`);
    }

    await connection.end();
    console.log('\n✅ Teste de conexão concluído com sucesso!');
    console.log('💡 Agora você pode executar: npm run init-db\n');

  } catch (error) {
    console.error('\n❌ Erro ao conectar:', error.message);
    console.error(`   Código: ${error.code}\n`);

    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.error('🔍 Problema: MySQL não está rodando ou não está acessível\n');
      console.error('📋 Soluções:');
      console.error('   1. Verifique se o MySQL está rodando:');
      console.error('      - Abra o Gerenciador de Tarefas (Ctrl+Shift+Esc)');
      console.error('      - Procure por "MySQL" nos processos');
      console.error('   2. Se não estiver rodando, inicie o serviço:');
      console.error('      - Win+R → digite: services.msc');
      console.error('      - Procure por "MySQL"');
      console.error('      - Clique com botão direito → Iniciar');
      console.error('   3. Verifique se a porta 3306 está correta no .env\n');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🔍 Problema: Senha incorreta ou usuário sem permissão\n');
      console.error('📋 Soluções:');
      console.error('   1. Verifique se a senha no .env está correta');
      console.error('   2. Teste a conexão manualmente:');
      console.error(`      mysql -u ${dbUser} -p`);
      console.error('   3. Se não conseguir, pode precisar resetar a senha do MySQL\n');
    } else if (error.code === 'ENOTFOUND') {
      console.error('🔍 Problema: Host não encontrado\n');
      console.error('📋 Verifique:');
      console.error(`   - DB_HOST está correto? (atual: ${dbHost})`);
      console.error('   - MySQL está instalado e rodando?\n');
    }

    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

testConnection();



