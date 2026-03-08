const http = require('http');

// Teste de listagem de países
const token = '2d32ab7823ef0fcf240cfdfcb6aed59c83fd396fe100f414dc6483244fc5a91c';

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
  console.log(`Status: ${res.statusCode}`);
  
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

req.end();
