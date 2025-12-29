require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../database/config');
const Donor = require('../models/Donor');
const User = require('../models/User');

async function createAdmin() {
  try {
    console.log('🔧 Criando usuário administrador...');

    // Verificar se já existe um admin
    const [existingAdmins] = await pool.execute(
      'SELECT * FROM users WHERE role = ? LIMIT 1',
      ['admin']
    );

    if (existingAdmins.length > 0) {
      console.log('⚠️  Já existe um usuário administrador no sistema');
      console.log(`   Email: ${existingAdmins[0].email}`);
      return;
    }

    // Criar doador admin (se não existir)
    let adminDonor = await Donor.findByCodigo('ADMIN001');

    if (!adminDonor) {
      adminDonor = await Donor.create({
        codigo_doador: 'ADMIN001',
        nome_completo: 'Administrador do Sistema',
        tipo_sanguineo: 'O+',
        email: 'admin@hemope.pe.gov.br',
      });
      console.log('✅ Doador admin criado');
    }

    // Verificar se usuário admin já existe
    const existingUser = await User.findByEmail('admin@hemope.pe.gov.br');
    if (existingUser) {
      console.log('⚠️  Usuário admin já existe');
      return;
    }

    // Criar usuário admin
    const password_hash = await bcrypt.hash('admin', 10);

    const adminUser = await User.create({
      email: 'admin@hemope.pe.gov.br',
      password_hash,
      donor_id: adminDonor.id,
      role: 'admin',
    });

    console.log('✅ Usuário administrador criado com sucesso!');
    console.log('');
    console.log('📋 Credenciais de acesso:');
    console.log('   Email: admin@hemope.pe.gov.br');
    console.log('   Senha: admin');
    console.log('');
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createAdmin();




