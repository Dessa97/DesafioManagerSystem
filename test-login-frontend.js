const http = require('http');

// Teste de login via frontend (simulando navegador)
const loginData = {
  login: 'admin',
  senha: 'suporte'
};

const postData = JSON.stringify(loginData);

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/usuario/autenticar',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Origin': 'http://localhost:4200',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Resposta: ${data}`);
    
    if (res.statusCode === 200) {
      const response = JSON.parse(data);
      console.log('\n=== LOGIN BEM-SUCEDIDO ===');
      console.log(`Usuário: ${response.nome}`);
      console.log(`Administrador: ${response.administrador}`);
      console.log(`Token: ${response.token.substring(0, 20)}...`);
      console.log('\n=== USE ESTE TOKEN NO FRONTEND ===');
    }
  });
});

req.on('error', (e) => {
  console.error(`Erro: ${e.message}`);
});

req.write(postData);
req.end();
