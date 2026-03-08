const http = require('http');

console.log('🔍 DEBUG DETALHADO DO LOGIN\n');

// Teste 1: Verificar se o problema está na serialização
console.log('\n1️⃣ Teste 1: Verificando serialização...');

const loginData1 = {
  login: 'convidado',
  senha: 'manager'
};

console.log('Dados que serão enviados:', JSON.stringify(loginData1, null, 2));

const options1 = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/usuario/autenticar',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify(loginData1))
  }
};

const req1 = http.request(options1, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Resposta bruta:', data);
    try {
      const response = JSON.parse(data);
      console.log('Resposta parseada:', response);
    } catch (e) {
      console.log('Erro ao parsear JSON:', e.message);
    }
  });
});

req1.on('error', (e) => {
  console.log('Erro na requisição:', e.message);
});

req1.write(JSON.stringify(loginData1));
req1.end();

// Aguardar um pouco antes do próximo teste
setTimeout(() => {
  // Teste 2: Verificar se o problema está no formato do token
  console.log('\n2️⃣ Teste 2: Testando formato do token...');
  
  const token = 'f4ea0edfa664ccd7cc63e50070ded2a6592bdefcb196901a3757f0891a6492b4';
  
  const options2 = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/pais/listar',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const req2 = http.request(options2, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Resposta:', data);
    });
  });

  req2.on('error', (e) => {
    console.log('Erro na requisição:', e.message);
  });

  req2.end();
}, 2000);
