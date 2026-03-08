# Tasks - Sistema de Gerenciamento de Países

## Fase 1: Setup do Ambiente

### Backend (Maven + Spring Boot)
- [ ] Criar projeto Maven com Spring Boot 3.1+
- [ ] Configurar Java 21 no pom.xml
- [ ] Adicionar dependências: Spring Web, Spring Data JPA, Spring Security, H2, OpenAPI
- [ ] Configurar application.properties com H2 em memória
- [ ] Configurar OpenAPI/Swagger UI
- [ ] Criar estrutura de pacotes base
- [ ] Testar build e startup da aplicação

### Frontend (Angular)
- [ ] Criar projeto Angular 17+ com CLI
- [ ] Configurar TypeScript
- [ ] Instalar dependências necessárias
- [ ] Criar estrutura de módulos (core, shared, features)
- [ ] Configurar HttpClientModule
- [ ] Testar build e servidor de desenvolvimento

### Documentação
- [ ] Criar README com instruções de setup
- [ ] Documentar estrutura do projeto
- [ ] Adicionar scripts de build e execução

---

## Fase 2: Backend Core - Entidades e Repositórios

### Entidades JPA
- [ ] Criar classe `Usuario` com anotações JPA
  - [ ] Campos: id, login, senha, nome, administrador
  - [ ] Validações: @NotBlank, @Unique para login
- [ ] Criar classe `Token` com anotações JPA
  - [ ] Campos: id, token, login, expiracao, administrador
  - [ ] Validações: @NotBlank, @Future para expiracao
- [ ] Criar classe `Pais` com anotações JPA
  - [ ] Campos: id, nome, sigla, gentilico
  - [ ] Validações: @NotBlank, @Size(2,2) para sigla, @Unique

### DTOs
- [ ] Criar `UsuarioAutenticadoDTO`
  - [ ] Campos: login, nome, token, administrador, autenticado
- [ ] Criar `LoginRequestDTO`
  - [ ] Campos: login, senha
- [ ] Criar `PaisDTO`
  - [ ] Campos: id, nome, sigla, gentilico

### Repositórios Spring Data JPA
- [ ] Criar `UsuarioRepository` interface
- [ ] Criar `TokenRepository` interface
- [ ] Criar `PaisRepository` interface
- [ ] Adicionar métodos customizados (findByLogin, findByToken, etc.)

### Validação e Configuração
- [ ] Configurar Bean Validation
- [ ] Criar data.sql com dados iniciais
- [ ] Testar criação de entidades no banco

---

## Fase 3: Backend Services - Lógica de Negócio

### Autenticação
- [ ] Criar `AuthenticationService`
  - [ ] Implementar hash de senhas com BCrypt
  - [ ] Validar credenciais do usuário
  - [ ] Verificar papel de administrador
- [ ] Criar `TokenService`
  - [ ] Gerar tokens UUID + SHA-256
  - [ ] Implementar expiração de 5 minutos
  - [ ] Validar token existente
  - [ ] Implementar renovação de token

### Serviços de Domínio
- [ ] Criar `PaisService`
  - [ ] Implementar CRUD de países
  - [ ] Validar unicidade de nome, sigla, gentilico
  - [ ] Validar formato de sigla (2 caracteres)
  - [ ] Implementar busca por nome
  - [ ] Aplicar controle de acesso por papel

### Configurações
- [ ] Configurar BCrypt password encoder
- [ ] Configurar geração de tokens UUID + SHA-256
- [ ] Implementar limpeza de tokens expirados
- [ ] Adicionar logging apropriado

---

## Fase 4: Backend API - Controllers e Endpoints

### Controllers REST
- [ ] Criar `UsuarioController`
  - [ ] POST /usuario/autenticar
  - [ ] GET /usuario/renovar-ticket
  - [ ] Validação de entrada
  - [ ] Tratamento de erros 401/400
- [ ] Criar `PaisController`
  - [ ] GET /pais/listar
  - [ ] GET /pais/pesquisar
  - [ ] POST /pais/salvar
  - [ ] GET /pais/excluir
  - [ ] Validação de acesso por papel

### Segurança
- [ ] Configurar Spring Security
  - [ ] Desabilitar CSRF para API REST
  - [ ] Configurar filtro de validação de token
  - [ ] Implementar AuthenticationFilter
- [ ] Implementar validação de token em endpoints
- [ ] Configurar CORS

### Documentação e Tratamento de Erros
- [ ] Configurar OpenAPI 3.0
  - [ ] Documentar todos os endpoints
  - [ ] Adicionar exemplos de request/response
  - [ ] Configurar Swagger UI
- [ ] Implementar tratamento global de exceções
- [ ] Adicionar mensagens de erro padronizadas

---

## Fase 5: Frontend Core - Estrutura Angular

### Models TypeScript
- [ ] Criar `usuario.model.ts`
- [ ] Criar `token.model.ts`
- [ ] Criar `pais.model.ts`
- [ ] Adicionar interfaces para DTOs

### Serviços Base
- [ ] Criar `api.service.ts` base para comunicação HTTP
- [ ] Configurar interceptors base
- [ ] Implementar tratamento de erros HTTP

### Estrutura de Módulos
- [ ] Criar `CoreModule`
  - [ ] Services singleton
  - [ ] Guards e interceptors
- [ ] Criar `SharedModule`
  - [ ] Components reutilizáveis
  - [ ] Models e interfaces
- [ ] Criar `AppRoutingModule`
  - [ ] Configurar rotas base
  - [ ] Adicionar guards de autenticação

---

## Fase 6: Frontend Auth - Autenticação

### Serviços de Autenticação
- [ ] Criar `AuthService`
  - [ ] Implementar login
  - [ ] Gerenciar token em localStorage
  - [ ] Implementar logout
  - [ ] Verificar expiração de token
- [ ] Criar `TokenService`
  - [ ] Verificar expiração (1 minuto antes)
  - [ ] Implementar renovação automática
  - [ ] Gerenciar dados do usuário

### Guards e Interceptors
- [ ] Criar `AuthGuard`
  - [ ] Proteger rotas privadas
  - [ ] Verificar token válido
- [ ] Criar `AuthInterceptor`
  - [ ] Adicionar token em requisições
  - [ ] Implementar renovação automática
  - [ ] Tratar erros 401

### Interface de Login
- [ ] Criar `LoginComponent`
  - [ ] Formulário com validações
  - [ ] Integração com AuthService
  - [ ] Feedback de erro/sucesso
  - [ ] Redirecionamento pós-login

---

## Fase 7: Frontend Features - Gerenciamento de Países

### Serviços de Domínio
- [ ] Criar `PaisService`
  - [ ] Métodos CRUD
  - [ ] Busca por nome
  - [ ] Tratamento de erros

### Componentes
- [ ] Criar `PaisListComponent`
  - [ ] Tabela com paginação client-side
  - [ ] Ordenação client-side
  - [ ] Ações de editar/excluir
- [ ] Criar `PaisFormComponent`
  - [ ] Formulário de criação/edição
  - [ ] Validações (sigla 2 caracteres)
  - [ ] Feedback visual
- [ ] Criar `PaisSearchComponent`
  - [ ] Campo de busca
  - [ ] Filtragem em tempo real
- [ ] Criar `HeaderComponent`
  - [ ] Informações do usuário logado
  - [ ] Botão de logout

### Controle de Acesso
- [ ] Implementar verificação de papel de administrador
- [ ] Ocultar botões de CRUD para usuários comuns
- [ ] Exibir mensagens de acesso negado

---

## Fase 8: Integração Frontend-Backend

### Configuração de CORS
- [ ] Configurar CORS no backend
- [ ] Testar origens permitidas
- [ ] Validar headers de autenticação

### Testes de Integração
- [ ] Testar autenticação completa
  - [ ] Login com sucesso
  - [ ] Falha de login
  - [ ] Renovação de token
- [ ] Testar CRUD de países
  - [ ] Listar todos
  - [ ] Buscar por nome
  - [ ] Criar novo (admin)
  - [ ] Editar (admin)
  - [ ] Excluir (admin)
- [ ] Testar controle de acesso
  - [ ] Usuário comum vs administrador
  - [ ] Acesso negado a endpoints restritos

### Tratamento de Erros
- [ ] Implementar tratamento de 401/403 no frontend
- [ ] Exibir mensagens amigáveis
- [ ] Redirecionamento automático para login

---

## Fase 9: Testes e Validação

### Backend Tests
- [ ] Testes unitários de services
  - [ ] AuthenticationService
  - [ ] TokenService
  - [ ] PaisService
- [ ] Testes de integração de controllers
  - [ ] UsuarioController
  - [ ] PaisController
- [ ] Testes de repositories
- [ ] Testes de validação de entidades

### Frontend Tests
- [ ] Testes unitários de services
  - [ ] AuthService
  - [ ] TokenService
  - [ ] PaisService
- [ ] Testes de componentes
  - [ ] LoginComponent
  - [ ] PaisListComponent
  - [ ] PaisFormComponent

### Testes E2E
- [ ] Fluxo completo de autenticação
- [ ] Operações CRUD completas
- [ ] Controle de acesso
- [ ] Renovação de token
- [ ] Tratamento de erros

### Validação de Critérios
- [ ] Validar todos os critérios funcionais
- [ ] Validar critérios não funcionais
- [ ] Validar critérios de qualidade
- [ ] Gerar relatório de testes

---

## Fase 10: Documentação Final

### Documentação Técnica
- [ ] Completar documentação da API
- [ ] Adicionar exemplos de uso
- [ ] Documentar arquitetura
- [ ] Documentar decisões técnicas

### Documentação de Usuário
- [ ] Criar guia de instalação
- [ ] Criar manual do usuário
- [ ] Adicionar screenshots
- [ ] Criar tutoriais

### Finalização
- [ ] Revisar e organizar código
- [ ] Otimizar performance
- [ ] Finalizar README
- [ ] Preparar apresentação do projeto
- [ ] Organizar repositório final

---

## Checklist Final

### Funcionalidades
- [ ] Autenticação de usuários funcionando
- [ ] Geração e expiração de tokens (5 minutos)
- [ ] Renovação automática de tokens
- [ ] CRUD completo de países
- [ ] Controle de acesso por papel
- [ ] Busca de países por nome
- [ ] Paginação client-side

### Segurança
- [ ] Hash de senhas com BCrypt
- [ ] Tokens UUID + SHA-256
- [ ] Validação de entrada
- [ ] Proteção contra ataques comuns
- [ ] Controle de acesso implementado

### Qualidade
- [ ] Código organizado e documentado
- [ ] Testes implementados
- [ ] Interface responsiva
- [ ] Tratamento de erros robusto
- [ ] Performance adequada

### Documentação
- [ ] API documentada
- [ ] README completo
- [ ] Guia de instalação
- [ ] Manual do usuário
