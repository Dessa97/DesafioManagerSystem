# Correção: Re-autenticação Automática de Tokens

## Problema Relatado
Após a expiração do token (5 minutos), o usuário era redirecionado diretamente para a tela de login, em vez de o sistema tentar reno var automaticamente o token.

## Comportamento Esperado vs Atual

### Antes (Comportamento Quebrado)
- Token expirava após 5 minutos no backend
- Frontend não tentava renovar automaticamente
- Usuário era redirecionado para login imediatamente
- O sistema usava XMLHttpRequest ao invés de HttpClient

### Depois (Comportamento Esperado)
- Token é monitorado continuamente
- Quando expira (ou está prestes a expirar), o sistema tenta renovar automaticamente
- Se a renovação falhar, AÍ SIM redireciona para login
- Requisições são refazidas automaticamente com o novo token

## Mudanças Realizadas

### 1. **auth.interceptor.ts** - Reescrito completamente
**Problemas corrigidos:**
- ❌ Remover XMLHttpRequest -> ✅ Usar HttpClient (injetado)
- ❌ POST para renovar-ticket -> ✅ GET (correto)
- ❌ Sem tratamento de 401 -> ✅ Interceptar 401 e tentar renovar
- ❌ Sem redirecionamento -> ✅ Redirecionar para login se renovação falhar
- ❌ Sem refazer requisição -> ✅ Refazer requisição original após renovação

**Funcionalidade:**
```typescript
// 1. Adiciona token Authorization automaticamente
// 2. Captura erros 401
// 3. Tenta renovar token
// 4. Se sucesso: refaz requisição original
// 5. Se falha: redireciona para login
// 6. Usa BehaviorSubject para evitar múltiplas renovações simultâneas
```

### 2. **auth.guard.ts** - Melhorado
**Mudanças:**
- ✅ Verificar antes de entrar em rota se token está expirando
- ✅ Se expirando, tentar renovar
- ✅ If renovação falha, bloqueia acesso à rota

**Benefício:** Évita que usuário entre em rota protegida com token quase expirado

### 3. **auth.service.ts** - Atualizações
**Mudanças:**
- ✅ `salvarDadosUsuario()` agora é `public` (era only `private`)
- ✅ Ajuste de timing: verifica se token está expirando em 1 minuto antes do vencimento
- ✅ Sincronizado com backend: token expira em 5 minutos (era verificando 4 minutos)

### 4. **api.service.ts** - Limpeza
**Remoção de duplicação:**
- ❌ Remover adição de Authorization header neste nível
- ✅ Deixar o interceptor adicionar Authorization
- ℹ️ Mantém apenas Content-Type: application/json

**Razão:** Evita duplicação e centraliza lógica de token no interceptor

## Fluxo de Funcionamento

### Cenário 1: Usuário logado, navegando normalmente
```
1. Usuário faz login em /login
2. Token salvo com timestamp (loginTime)
3. Usuário navega para /paises (rota protegida)
4. AuthGuard verifica se token está expirando
   - Se não: permite acesso
   - Se sim: tenta renovar antes de permitir
5. Componente funciona normalmente
```

### Cenário 2: Token expira durante uma operação
```
1. Usuário está preenchendo um formulário
2. Faz requisição HTTP (GET /paises, POST /pais/salvar, etc)
3. Token foi incluído automaticamente pelo interceptor
4. Backend retorna 401 (token expirado)
5. Interceptor captura erro 401
6. Chama GET /usuario/renovar-ticket com token antigo
7. Se sucesso:
   - Novo token salvo
   - Requisição original refazida com novo token
   - Usuário continua operação sem perceber
8. Se falha:
   - Limpa token do localStorage
   - Redireciona para /login
```

### Cenário 3: Múltiplas requisições simultâneas com token expirado
```
1. 5 requisições simultâneas chegam ao interceptor
2. Todas recebem 401
3. Primeira requisição:
   - seRefreshando = true
   - Tenta renewarToken()
4. Requisições 2-5:
   - Veem seRefreshando = true
   - Aguardam no refreshTokenSubject
5. Renovação completa:
   - seRefreshando = false
   - refreshTokenSubject.next(novoToken)
6. Requisições 2-5 despertam com novo token
   - Refazem suas requisições
```

## Testing Sugerido

### 1. Teste Manual - Token Expirando Naturalmente
```
1. Login (token válido por 5 minutos)
2. Esperar ~4 minutos
3. Fazer requisição HTTP (listar países)
4. ✅ Deve renovar automaticamente
5. ✅ Continuar funcionando sem redirecionar
```

### 2. Teste Manual - Requisição com Token Expirado
```
1. Login (token = X)
2. Aguardar 5+ minutos
3. Fazer requisição (GET /paises)
4. ✅ Deve responder com 401
5. ✅ Interceptor deve renovar
6. ✅ Requisição deve ser refazida
7. ✅ Dados devem ser retornados
```

### 3. Teste de Falha - Renovação Falha
```
1. Login (token válido)
2. Parar backend
3. Aguardar 5+ minutos
4. Fazer requisição ou navegar
5. ✅ Tentará renovar
6. ✅ Falha na renovação
7. ✅ Redireciona para /login
```

### 4. Teste de Concorrência
```
1. Login
2. Com DevTools aberto, fazer 5-10 requisições simultaneamente (F12 > Network)
3. Aguardar token expirar (~5 min)
4. Fazer mais 5-10 requisições simultâneas
5. ✅ Deve haver apenas UMA chamada a /usuario/renovar-ticket
6. ✅ Todas as requisições devem ser refazidas com novo token
```

## Configurações Importantes

### Backend (Java)
- **Token expira em:** 5 minutos (`TOKEN_EXPIRATION_MINUTES = 5`)
- **Endpoint renovação:** `GET /usuario/renovar-ticket`
- **Requer autenticação:** Não (permitAll no SecurityConfig)
- **Header:** `Authorization: Bearer <token_anterior>`

### Frontend (Angular)
- **Monitora expiração a partir de:** 1 minuto antes do vencimento
- **Intercepta erros:** 401 Unauthorized
- **Renovação automática:** Sim (via BehaviorSubject)
- **Redirecionamento:** Apenas se renovação falhar

## Benefícios

✅ **UX Melhorada:** Usuário não é deslogado abruptamente
✅ **Segurança:** Token ainda expira; apenas renovado automaticamente
✅ **Robustez:** Múltiplas requisições simultâneas tratadas corretamente
✅ **Manutenibilidade:** Lógica centralizada no interceptor
✅ **Performance:** Apenas uma renovação por ciclo, não múltiplas

## Possíveis Melhorias Futuras

1. Adicionar logging de renovações para debug
2. Implementar refresh token (separate do access token)
3. Adicionar toast/notification para usuário sobre renovação
4. Implementar máximo de tentativas de renovação
5. Adicionar expiração de refresh token também
