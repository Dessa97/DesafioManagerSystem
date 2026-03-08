const http = require('http');

console.log('🧪 TESTE COMPLETO DO SISTEMA DE LOGIN\n');

// Simular o fluxo completo de login e acesso
async function testeCompleto() {
  try {
    // Passo 1: Login
    console.log('1️⃣ Fazendo login...');
    const loginResponse = await fazerLogin('convidado', 'manager');
    
    if (!loginResponse) {
      console.log('❌ Falha no login');
      return;
    }
    
    console.log('✅ Login realizado com sucesso!');
    console.log(`   Usuário: ${loginResponse.nome}`);
    console.log(`   Token: ${loginResponse.token.substring(0, 30)}...`);
    
    // Simular salvamento no localStorage
    localStorage.setItem('token', loginResponse.token);
    localStorage.setItem('usuario', JSON.stringify({
      ...loginResponse,
      loginTime: new Date().getTime()
    }));
    
    // Passo 2: Tentar acessar recursos imediatamente
    console.log('\n2️⃣ Acessando recursos protegidos...');
    const paisesResponse = await listarPaises(loginResponse.token);
    
    if (paisesResponse) {
      console.log('✅ Acesso aos recursos funcionando!');
      console.log(`   Países encontrados: ${paisesResponse.length}`);
    } else {
      console.log('❌ Falha ao acessar recursos');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
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
          console.log(`Status: ${res.statusCode}`);
          console.log(`Resposta: ${data}`);
          resolve(null);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Mock localStorage para testes
global.localStorage = {
  data: {},
  setItem: function(key, value) {
    this.data[key] = value;
  },
  getItem: function(key) {
    return this.data[key] || null;
  },
  removeItem: function(key) {
    delete this.data[key];
  }
};

// Executar teste
testeCompleto();
