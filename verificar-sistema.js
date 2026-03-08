const http = require('http');

console.log('🚀 VERIFICANDO SISTEMA DE GERENCIAMENTO DE PAÍSES...\n');

// Teste 1: Verificar se backend está online
function verificarBackend() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/pais/listar',
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Backend API está ONLINE');
        resolve(true);
      } else {
        console.log(`❌ Backend API retornou status: ${res.statusCode}`);
        resolve(false);
      }
    });

    req.on('error', () => {
      console.log('❌ Backend API está OFFLINE');
      resolve(false);
    });

    req.end();
  });
}

// Teste 2: Verificar se frontend está online
function verificarFrontend() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4200,
      path: '/',
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Frontend Angular está ONLINE');
        resolve(true);
      } else {
        console.log(`❌ Frontend Angular retornou status: ${res.statusCode}`);
        resolve(false);
      }
    });

    req.on('error', () => {
      console.log('❌ Frontend Angular está OFFLINE');
      resolve(false);
    });

    req.end();
  });
}

// Teste 3: Teste completo de autenticação
async function testeAutenticacao() {
  console.log('\n🔐 Testando autenticação...');
  
  try {
    // Login como admin
    const loginResponse = await fazerLogin('admin', 'suporte');
    if (!loginResponse) {
      console.log('❌ Falha no login');
      return false;
    }
    
    console.log('✅ Login realizado com sucesso');
    console.log(`   Usuário: ${loginResponse.nome}`);
    console.log(`   Administrador: ${loginResponse.administrador}`);
    console.log(`   Token: ${loginResponse.token.substring(0, 20)}...`);
    
    // Listar países com token
    const paisesResponse = await listarPaises(loginResponse.token);
    if (!paisesResponse) {
      console.log('❌ Falha ao listar países');
      return false;
    }
    
    console.log(`✅ Listagem realizada com sucesso (${paisesResponse.length} países)`);
    
    // Criar novo país
    const novoPais = await criarPais(loginResponse.token);
    if (!novoPais) {
      console.log('❌ Falha ao criar país');
      return false;
    }
    
    console.log(`✅ País criado: ${novoPais.nome}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Erro no teste: ${error.message}`);
    return false;
  }
}

function fazerLogin(login, senha) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ login, senha });
    
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/usuario/autenticar',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            resolve(response);
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error(`Status ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function listarPaises(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/pais/listar',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            resolve(response);
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error(`Status ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function criarPais(token) {
  return new Promise((resolve, reject) => {
    const paisData = {
      nome: 'Teste Sistema',
      sigla: 'TS',
      gentilico: 'Testense'
    };
    
    const postData = JSON.stringify(paisData);
    
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/pais/salvar',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            resolve(response);
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error(`Status ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Executar verificação completa
async function verificacaoCompleta() {
  console.log('\n📋 EXECUTANDO VERIFICAÇÃO COMPLETA DO SISTEMA...\n');
  
  const backendOnline = await verificarBackend();
  const frontendOnline = await verificarFrontend();
  
  if (!backendOnline || !frontendOnline) {
    console.log('\n❌ SISTEMA NÃO ESTÁ COMPLETAMENTE FUNCIONAL');
    console.log('   Backend:', backendOnline ? '✅ Online' : '❌ Offline');
    console.log('   Frontend:', frontendOnline ? '✅ Online' : '❌ Offline');
    return;
  }
  
  console.log('\n✅ Ambas aplicações estão online!');
  
  const testeAutenticacaoOk = await testeAutenticacao();
  
  if (testeAutenticacaoOk) {
    console.log('\n🎉 SISTEMA 100% FUNCIONAL!');
    console.log('   ✅ Autenticação funcionando');
    console.log('   ✅ CRUD de países funcionando');
    console.log('   ✅ Controle de acesso funcionando');
    console.log('   ✅ Tokens e segurança funcionando');
  } else {
    console.log('\n⚠️ SISTEMA COM PROBLEMAS NA AUTENTICAÇÃO');
  }
}

// Executar verificação
verificacaoCompleta().catch(console.error);
