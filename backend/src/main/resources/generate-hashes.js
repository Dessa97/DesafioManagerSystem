const bcrypt = require('bcryptjs');

async function generateHashes() {
  const adminHash = await bcrypt.hash('suporte', 10);
  const convidadoHash = await bcrypt.hash('manager', 10);
  
  console.log('Hash para admin (suporte):', adminHash);
  console.log('Hash para convidado (manager):', convidadoHash);
  
  // Verificar hashes
  const adminValid = await bcrypt.compare('suporte', adminHash);
  const convidadoValid = await bcrypt.compare('manager', convidadoHash);
  
  console.log('Admin hash válido:', adminValid);
  console.log('Convidado hash válido:', convidadoValid);
}

generateHashes().catch(console.error);
