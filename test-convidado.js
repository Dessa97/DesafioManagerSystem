const http = require('http');

// Teste de autenticação como convidado
const loginData = {
  login: 'convidado',
  senha: 'manager'
};

const postData = JSON.stringify(loginData);

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
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    const response = JSON.parse(data);
    console.log(`Usuário: ${response.nome}`);
    console.log(`Administrador: ${response.administrador}`);
    console.log(`Token: ${response.token}`);
    
    // Testar tentativa de salvar país com usuário não administrador
    testSaveAsUser(response.token);
  });
});

req.on('error', (e) => {
  console.error(`Erro: ${e.message}`);
});

req.write(postData);
req.end();

function testSaveAsUser(token) {
  const paisData = {
    nome: 'México',
    sigla: 'MX',
    gentilico: 'Mexicano'
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
    console.log(`\nTeste salvar como usuário comum - Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Resposta: ${data}`);
    });
  });
  
  req.on('error', (e) => {
    console.error(`Erro: ${e.message}`);
  });
  
  req.write(postData);
  req.end();
}
