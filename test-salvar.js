const http = require('http');

// Teste de salvar país
const token = '2d32ab7823ef0fcf240cfdfcb6aed59c83fd396fe100f414dc6483244fc5a91c';

const paisData = {
  nome: 'Canadá',
  sigla: 'CA',
  gentilico: 'Canadense'
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

req.write(postData);
req.end();
