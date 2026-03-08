const http = require('http');

// Teste de autenticação
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
    'Content-Length': Buffer.byteLength(postData)
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
  });
});

req.on('error', (e) => {
  console.error(`Erro: ${e.message}`);
});

req.write(postData);
req.end();
