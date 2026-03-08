# Especificação Técnica - Sistema de Gerenciamento de Países

## 1. Visão Geral do Sistema

### Descrição de Alto Nível
Sistema de gerenciamento de países com autenticação de usuários, implementado como uma Single Page Application (SPA) com arquitetura separada entre frontend e backend.

### Arquitetura
- **Frontend**: Angular 17+ (SPA)
- **Backend**: Spring Boot 3.1+ com Java 21
- **Comunicação**: API REST
- **Banco de Dados**: H2 ou HSQL (em memória)
- **Documentação**: OpenAPI + Swagger UI

### Principais Componentes e Responsabilidades
- **Backend**: Gerenciamento de autenticação, tokens, e CRUD de países
- **Frontend**: Interface do usuário, gerenciamento de sessão, e operações CRUD
- **API**: Camada de comunicação entre frontend e backend

## 2. Requisitos Funcionais

### Autenticação
- Login de usuários com credenciais válidas
- Geração de token JWT após autenticação bem-sucedida
- Renovação automática de tokens antes da expiração
- Controle de acesso baseado em papéis (administrador vs usuário comum)

### Gerenciamento de Países
- **Listar**: Todos os usuários podem visualizar a lista de países
- **Pesquisar**: Busca de países por nome
- **Criar**: Apenas administradores podem criar novos países
- **Atualizar**: Apenas administradores podem modificar países existentes
- **Excluir**: Apenas administradores podem remover países

### Controle de Acesso
- Usuários administradores têm acesso total ao CRUD de países
- Usuários não administradores têm acesso apenas leitura aos países

## 3. Requisitos Não Funcionais

### Segurança
- Senhas armazenadas como hashes (BCrypt)
- Tokens UUID + SHA-256 com assinatura segura
- Validação de entrada em todos os endpoints
- Proteção contra ataques de injeção

### Validação
- Validação de campos obrigatórios
- Verificação de unicidade de dados críticos
- Validação de formatos (ex: acrônimo de 2 caracteres)

### Regras de Expiração
- Tokens expiram em 5 minutos
- Renovação automática antes da expiração

### Documentação
- API documentada com OpenAPI 3.0
- Interface Swagger UI para testes
- Código bem documentado e organizado

## 4. Modelo de Domínio

### Usuário
```java
@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String login;        // único
    private String senha;        // hash BCrypt
    private String nome;
    private boolean administrador;
}
```

### Token
```java
@Entity
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String token;        // UUID + SHA-256
    private String login;        // referência ao usuário
    private LocalDateTime expiracao;
    private boolean administrador;
}
```

### País
```java
@Entity
public class Pais {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;         // único
    private String sigla;         // única, exatamente 2 caracteres
    private String gentilico;    // único
}
```

### UsuárioAutenticado (DTO de Resposta)
```java
public class UsuarioAutenticado {
    private String login;
    private String nome;
    private String token;
    private boolean administrador;
    private boolean autenticado;
}
```

## 5. Regras de Negócio

### Gerenciamento de Tokens
- **Expiração**: 5 minutos após geração
- **Renovação**: Token pode ser renovado antes de expirar
- **Geração**: UUID + SHA-256 (imprevisível)
- **Armazenamento**: Persistido em banco para validação

### Controle de Acesso
- **Administradores**: Acesso completo ao CRUD de países
- **Usuários Comuns**: Apenas leitura (listar e pesquisar países)
- **Autenticação**: Obrigatória para todas as operações

### Validação de Dados
- **Sigla**: Exatamente 2 caracteres maiúsculos
- **Unicidade**: Nome, sigla e gentílico devem ser únicos
- **Obrigatoriedade**: Todos os campos de País são obrigatórios

## 6. Especificação da API

### Autenticação

#### POST /usuario/autenticar
- **Descrição**: Autentica usuário e gera token
- **Request Body**:
```json
{
    "login": "string",
    "senha": "string"
}
```
- **Response**:
```json
{
    "login": "string",
    "nome": "string",
    "token": "string",
    "administrador": boolean,
    "autenticado": true
}
```
- **Erros**: 401 (credenciais inválidas), 400 (campos inválidos)

#### GET /usuario/renovar-ticket
- **Descrição**: Renova token de autenticação
- **Headers**: Authorization: Bearer {token}
- **Response**: Mesmo formato da autenticação
- **Erros**: 401 (token inválido/expirado), 403 (não autorizado)

### Gerenciamento de Países

#### GET /pais/listar
- **Descrição**: Lista todos os países
- **Headers**: Authorization: Bearer {token}
- **Response**:
```json
[
    {
        "id": number,
        "nome": "string",
        "sigla": "string",
        "gentilico": "string"
    }
]
```
- **Erros**: 401 (não autenticado)

#### GET /pais/pesquisar
- **Descrição**: Pesquisa países por nome
- **Headers**: Authorization: Bearer {token}
- **Query Params**: nome (string)
- **Response**: Array de países (mesmo formato do listar)
- **Erros**: 401 (não autenticado)

#### POST /pais/salvar
- **Descrição**: Cria ou atualiza um país
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
```json
{
    "id": number,        // opcional para atualização
    "nome": "string",
    "sigla": "string",
    "gentilico": "string"
}
```
- **Response**: País criado/atualizado
- **Erros**: 401 (não autenticado), 403 (não administrador), 400 (dados inválidos)

#### GET /pais/excluir
- **Descrição**: Exclui um país
- **Headers**: Authorization: Bearer {token}
- **Query Params**: id (number)
- **Response**: 200 OK
- **Erros**: 401 (não autenticado), 403 (não administrador), 404 (não encontrado)

## 7. Dados Iniciais

### Usuários
| Login | Senha | Nome | Administrador |
|-------|-------|------|---------------|
| convidado | manager | Usuário convidado | false |
| admin | suporte | Gestor | true |

### Países
| Nome | Sigla | Gentílico |
|------|-------|-----------|
| Brasil | BR | Brasileiro |
| Argentina | AR | Argentino |
| Alemanha | AL | Alemão |

## 8. Arquitetura de Backend

### Estrutura de Pacotes (Arquitetura em Camadas)
```
com.desafio.paises/
├── controller/
│   ├── UsuarioController.java
│   └── PaisController.java
├── service/
│   ├── AuthenticationService.java
│   ├── TokenService.java
│   └── PaisService.java
├── repository/
│   ├── UsuarioRepository.java
│   ├── TokenRepository.java
│   └── PaisRepository.java
├── model/
│   ├── Usuario.java
│   ├── Token.java
│   └── Pais.java
├── dto/
│   ├── UsuarioAutenticadoDTO.java
│   ├── LoginRequestDTO.java
│   └── PaisDTO.java
└── config/
    ├── SecurityConfig.java
    ├── TokenConfig.java
    └── OpenApiConfig.java
```

### Camadas
- **Controller**: Endpoints REST, validação de entrada
- **Service**: Lógica de negócio, orquestração
- **Repository**: Acesso a dados (JPA)
- **Model**: Entidades do domínio (JPA Entities)
- **DTO**: Objetos de transferência de dados
- **Config**: Configurações de segurança, token e OpenAPI

## 9. Arquitetura de Frontend

### Estrutura de Módulos Angular
```
src/app/
├── core/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── token.service.ts
│   │   └── pais.service.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   └── guards/
│       └── auth.guard.ts
├── shared/
│   ├── components/
│   │   ├── header/
│   │   ├── menu/
│   │   └── table/
│   └── models/
│       ├── usuario.model.ts
│       ├── token.model.ts
│       └── pais.model.ts
├── features/
│   ├── auth/
│   │   ├── pages/
│   │   │   └── login/
│   │   └── components/
│   └── paises/
│       ├── pages/
│       │   ├── list/
│       │   └── manage/
│       └── components/
│           └── pais-form/
└── app-routing.module.ts
```

## 10. Comportamento do Frontend

### Gerenciamento de Sessão
- **Token**: Armazenado em localStorage
- **Dados do Usuário**: Login, nome e flag de administrador em localStorage
- **Usuário Logado**: Nome exibido no header
- **Controle de Acesso**: Verificação de papel (administrador) no frontend
- **Expiração**: Renovação automática 1 minuto antes de expirar

### Interface do Usuário
- **Tabela de Países**: Paginação e ordenação no cliente
- **Formulários**: Validação em tempo real
- **Feedback**: Mensagens de erro/sucesso

### Navegação
- **Login**: Página inicial para usuários não autenticados
- **Dashboard**: Página principal após login
- **Gerenciamento**: Acesso restrito a administradores

## 11. Estratégia de Manipulação de Token

### Interceptor de Autenticação
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Verificar expiração ANTES de cada requisição
    if (this.authService.tokenEstaExpirando()) {
      return this.renovarTokenERefazer(req, next);
    }

    const token = localStorage.getItem('token');
    
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(req).pipe(
      catchError(error => {
        if (error.status === 401) {
          // Fallback: tentar renovação se verificação falhar
          return this.renovarTokenERefazer(req, next);
        }
        return throwError(error);
      })
    );
  }

  private renovarTokenERefazer(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.renovarToken().pipe(
      switchMap(tokenResponse => {
        // Salvar token e dados do usuário
        localStorage.setItem('token', tokenResponse.token);
        localStorage.setItem('usuario', JSON.stringify({
          login: tokenResponse.login,
          nome: tokenResponse.nome,
          administrador: tokenResponse.administrador
        }));
        
        // Refazer requisição original com novo token
        const clonedReq = req.clone({
          setHeaders: { Authorization: `Bearer ${tokenResponse.token}` }
        });
        
        return next.handle(clonedReq);
      }),
      catchError(error => {
        // Se falhar renovação, redirecionar para login
        this.authService.logout();
        return throwError(error);
      })
    );
  }
}
```

### Renovação Automática
- **Estratégia Próativa**: Verificar expiração antes de CADA requisição
- **Verificação**: Comparar timestamp atual com expiração do token
- **Limiar**: Renovar se faltar menos de 1 minuto para expirar
- **Processo Transparente**: Usuário não percebe a renovação
- **Fallback**: Se renovação falhar, tratar 401 e redirecionar para login

### Tratamento de Erros 401
- **Interceptação**: Capturar respostas 401 no HttpInterceptor
- **Renovação Automática**: Tentar renovar o token
- **Retry**: Refazer requisição original com novo token
- **Fallback**: Redirecionar para login apenas se renovação falhar
- **Limpeza**: Limpar token e dados do usuário do localStorage em falha definitiva

## 12. Regras de Validação

### Backend (Bean Validation)
```java
public class Pais {
    @NotBlank
    private String nome;
    
    @NotBlank
    @Size(min = 2, max = 2)
    private String sigla;
    
    @NotBlank
    private String gentilico;
}
```

### Frontend (Angular Validators)
```typescript
this.paisForm = this.fb.group({
  nome: ['', Validators.required],
  sigla: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
  gentilico: ['', Validators.required]
});
```

## 13. Critérios de Aceite

### Funcionalidade
- [ ] Usuários conseguem autenticar com credenciais válidas
- [ ] Tokens são gerados e expiram em 5 minutos
- [ ] Renovação de token funciona corretamente
- [ ] Administradores conseguem CRUD completo de países
- [ ] Usuários comuns conseguem apenas listar/pesquisar países

### Segurança
- [ ] Senhas estão armazenadas como hashes
- [ ] Tokens são validados em cada requisição
- [ ] Acesso não autorizado é bloqueado
- [ ] Validação de entrada previne ataques

### Usabilidade
- [ ] Interface é responsiva e intuitiva
- [ ] Mensagens de erro são claras
- [ ] Renovação de token é transparente
- [ ] Navegação é fluida

### Performance
- [ ] Tempo de resposta < 2 segundos para operações CRUD
- [ ] Paginação no cliente funciona com 1000+ registros
- [ ] Renovação de token não impacta UX

### Documentação
- [ ] API documentada em OpenAPI
- [ ] Swagger UI funcional
- [ ] Código comentado e organizado
- [ ] README com instruções de setup

## 14. Tecnologias e Versões

### Backend
- Java 21
- Spring Boot 3.1+
- Spring Data JPA
- H2 Database
- Spring Security
- UUID + SHA-256
- OpenAPI 3.0

### Frontend
- Angular 17+
- TypeScript
- Angular Material (opcional)
- RxJS
- HttpClient

### DevOps
- Maven/Gradle
- Docker (opcional)
- Testes Unitários (JUnit/Jest)
