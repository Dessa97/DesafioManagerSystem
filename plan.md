# Plano de Desenvolvimento - Sistema de Gerenciamento de Países

## 1. Visão Geral do Plano

Este documento descreve o plano de desenvolvimento orientado a especificações para o Sistema de Gerenciamento de Países, baseado na especificação técnica detalhada em `spec.md`.

## 2. Estratégia de Desenvolvimento Orientado a Especificações

### Fases do Desenvolvimento
1. **Setup do Ambiente** - Configuração inicial do projeto
2. **Backend Core** - Implementação das entidades e repositórios
3. **Backend Services** - Lógica de negócio e autenticação
4. **Backend API** - Controllers e endpoints REST
5. **Frontend Core** - Estrutura Angular e serviços base
6. **Frontend Auth** - Implementação de autenticação
7. **Frontend Features** - Interface de gerenciamento de países
8. **Integração** - Conexão frontend-backend
9. **Testes** - Validação completa do sistema
10. **Documentação** - Finalização do projeto

## 3. Plano Detalhado por Fase

### Fase 1: Setup do Ambiente 
- [ ] Criar estrutura de projetos Maven (backend) e Angular (frontend)
- [ ] Configurar dependências Spring Boot 3.1+ com Java 21
- [ ] Configurar Angular 17+ com TypeScript
- [ ] Setup de banco de dados H2 em memória
- [ ] Configurar OpenAPI/Swagger
- [ ] Criar README com instruções de setup

**Entregáveis:**
- Projeto backend Maven configurado
- Projeto frontend Angular configurado
- Build funcionando para ambos os projetos

### Fase 2: Backend Core - Entidades e Repositórios 
- [ ] Implementar entidade `Usuario` com validações
- [ ] Implementar entidade `Token` com campos de expiração
- [ ] Implementar entidade `Pais` com validações específicas
- [ ] Criar DTOs: `UsuarioAutenticadoDTO`, `LoginRequestDTO`, `PaisDTO`
- [ ] Implementar repositories JPA para todas as entidades
- [ ] Configurar Bean Validation

**Entregáveis:**
- Entidades JPA funcionais
- Repositórios Spring Data JPA
- DTOs com validações
- Testes unitários das entidades

### Fase 3: Backend Services - Lógica de Negócio 
- [ ] Implementar `AuthenticationService` com BCrypt
- [ ] Implementar `TokenService` com UUID + SHA-256
- [ ] Implementar `PaisService` com validações de unicidade
- [ ] Implementar regras de expiração de tokens (5 minutos)
- [ ] Implementar controle de acesso por papel (administrador)
- [ ] Adicionar dados iniciais via data.sql

**Entregáveis:**
- Services com lógica de negócio completa
- Hash de senhas funcionando
- Geração e validação de tokens
- Regras de acesso implementadas

### Fase 4: Backend API - Controllers e Endpoints 
- [ ] Implementar `UsuarioController` com endpoints de autenticação
- [ ] Implementar `PaisController` com CRUD completo
- [ ] Configurar Spring Security com filtros de token
- [ ] Implementar interceptors de validação
- [ ] Configurar tratamento de exceções globais
- [ ] Documentar API com OpenAPI 3.0

**Endpoints a implementar:**
```
POST /usuario/autenticar
GET /usuario/renovar-ticket
GET /pais/listar
GET /pais/pesquisar
POST /pais/salvar
GET /pais/excluir
```

**Entregáveis:**
- API REST completa e funcional
- Documentação Swagger UI funcionando
- Segurança implementada
- Testes de integração dos endpoints

### Fase 5: Frontend Core - Estrutura Angular 
- [ ] Criar estrutura de módulos Angular (core, shared, features)
- [ ] Implementar models TypeScript para entidades
- [ ] Configurar HttpClientModule
- [ ] Implementar services base para comunicação com API
- [ ] Configurar routing module
- [ ] Setup de interceptors HTTP

**Estrutura a criar:**
```
src/app/
├── core/
│   ├── services/
│   ├── interceptors/
│   └── guards/
├── shared/
│   ├── components/
│   └── models/
├── features/
│   ├── auth/
│   └── paises/
└── app-routing.module.ts
```

**Entregáveis:**
- Estrutura Angular organizada
- Services de comunicação com API
- Models TypeScript
- Routing configurado

### Fase 6: Frontend Auth - Autenticação 
- [ ] Implementar `AuthService` com gerenciamento de token
- [ ] Implementar `TokenService` com verificação de expiração
- [ ] Criar página de login com formulário validado
- [ ] Implementar `AuthGuard` para proteção de rotas
- [ ] Implementar `AuthInterceptor` para adicionar tokens
- [ ] Implementar renovação automática de tokens

**Funcionalidades chave:**
- Armazenamento de token em localStorage
- Verificação de expiração (1 minuto antes)
- Renovação transparente para o usuário
- Redirecionamento automático em caso de falha

**Entregáveis:**
- Sistema de autenticação frontend completo
- Página de login funcional
- Guards e interceptors funcionando
- Renovação automática de tokens

### Fase 7: Frontend Features - Gerenciamento de Países 
- [ ] Implementar `PaisService` para CRUD de países
- [ ] Criar página de listagem de países com tabela
- [ ] Implementar busca/filtragem de países
- [ ] Criar formulário de criação/edição de países
- [ ] Implementar validações no frontend (sigla 2 caracteres)
- [ ] Adicionar controle de acesso baseado em papel de administrador

**Componentes a criar:**
- `PaisListComponent` - listagem com paginação client-side
- `PaisFormComponent` - formulário de CRUD
- `PaisSearchComponent` - busca por nome
- `HeaderComponent` - informações do usuário logado

**Entregáveis:**
- Interface completa de gerenciamento de países
- Controle de acesso por papel
- Validações no frontend
- Experiência de usuário responsiva

### Fase 8: Integração Frontend-Backend 
- [ ] Configurar CORS no backend
- [ ] Testar integração de todos os endpoints
- [ ] Implementar tratamento de erros 401/403 no frontend
- [ ] Validar fluxo completo de autenticação
- [ ] Testar operações CRUD com controle de acesso
- [ ] Otimizar performance das requisições

**Cenários de teste:**
- Login bem-sucedido e falha
- Renovação de token automática
- CRUD de países por administrador
- Acesso negado para usuário comum
- Expiração de token e logout

**Entregáveis:**
- Sistema integrado e funcional
- Tratamento robusto de erros
- Performance otimizada
- Fluxos completos testados

### Fase 9: Testes e Validação 
- [ ] Escrever testes unitários para services backend
- [ ] Escrever testes de integração para controllers
- [ ] Escrever testes unitários para services frontend
- [ ] Implementar testes E2E com Cypress ou similar
- [ ] Validar todos os critérios de aceite da especificação
- [ ] Testar segurança (injeção, XSS, CSRF)

**Critérios de aceite a validar:**
- Autenticação funcional
- Expiração e renovação de tokens
- Controle de acesso por papel
- Validações de dados
- Performance (< 2 segundos)
- Segurança implementada

**Entregáveis:**
- Suíte de testes completa
- Relatório de validação
- Sistema pronto para produção

### Fase 10: Documentação Final 
- [ ] Completar documentação da API
- [ ] Criar guia de instalação e uso
- [ ] Finalizar README com exemplos
- [ ] Preparar apresentação do projeto
- [ ] Organizar repositório final

**Documentação a produzir:**
- API documentation completa
- Manual do usuário
- Guia de desenvolvimento
- Arquitetura e decisões técnicas

**Entregáveis:**
- Documentação completa
- Sistema finalizado
- Apresentação do projeto
- Repositório organizado

## 4. Marcos e Entregáveis

### Marco 1: Backend Funcional 
- API REST completa
- Autenticação funcionando
- Segurança implementada
- Documentação Swagger

### Marco 2: Frontend Básico 
- Autenticação frontend funcionando
- Estrutura Angular completa
- Comunicação com API estabelecida

### Marco 3: Sistema Integrado 
- CRUD completo funcionando
- Controle de acesso implementado
- Experiência de usuário completa

### Marco 4: Sistema Finalizado 
- Testes completos
- Documentação final
- Sistema funcional completo
- Repositório organizado

## 5. Riscos e Mitigações

### Riscos Técnicos
- **Complexidade de renovação de tokens**: Implementar fallback robusto
- **Controle de acesso sincronizado**: Validar em backend e frontend
- **Performance com muitos registros**: Implementar paginação eficiente

### Riscos de Tempo
- **Curva de aprendizado Angular**: Focar em componentes essenciais primeiro
- **Configuração de segurança**: Seguir boas práticas e padrões
- **Integração frontend-backend**: Testar comunicação desde cedo

### Mitigações
- Protótipo rápido da autenticação
- Testes incrementais a cada fase
- Revisão contínua contra especificação
- Backup de funcionalidades críticas

## 6. Critérios de Sucesso

### Funcionais
- [ ] Sistema autentica usuários corretamente
- [ ] Tokens expiram e renovam automaticamente
- [ ] Administradores gerenciam países completamente
- [ ] Usuários comuns têm acesso apenas leitura

### Não Funcionais
- [ ] Sistema seguro contra ataques comuns
- [ ] Interface responsiva e intuitiva
- [ ] Código bem documentado e organizado

### Qualidade
- [ ] Testes com cobertura > 80%
- [ ] Zero vulnerabilidades críticas
- [ ] Documentação completa e clara
- [ ] Código seguindo boas práticas

## 7. Recursos Necessários

### Técnicos
- Ambiente Java 21 + Maven
- Ambiente Node.js + Angular CLI
- Banco de dados H2
- Ferramentas de teste

### Ferramentas
- IDE (IntelliJ/Eclipse + VSCode)
- Postman/Insomnia para testes de API
- Navegador com dev tools
- Git para controle de versão

## 8. Conclusão

Este plano estabelece uma abordagem estruturada para desenvolver o Sistema de Gerenciamento de Países seguindo desenvolvimento orientado a especificações. Cada fase é projetada para entregar valor incremental while mantendo foco nos requisitos definidos em `spec.md`.

A divisão em fases claras permite validação contínua, mitigação de riscos e garantia de qualidade ao longo do processo de desenvolvimento.
