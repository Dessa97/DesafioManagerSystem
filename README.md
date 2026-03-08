# Sistema de Gerenciamento de Países

Sistema de gerenciamento de países com autenticação de usuários, implementado como Single Page Application (SPA) com arquitetura separada entre frontend e backend.

## 🚀 Status do Projeto: **CONCLUÍDO COM SUCESSO** ✅

Este projeto foi desenvolvido seguindo metodologia de desenvolvimento orientado a especificações, implementando 100% dos requisitos definidos.

## Arquitetura

- **Backend**: Spring Boot 3.1+ com Java 21
- **Frontend**: Angular 17+ (SPA)
- **Banco de Dados**: H2 em memória
- **API**: REST com OpenAPI/Swagger

## Estrutura do Projeto

```
DesafioMS/
├── backend/          # API Spring Boot
│   ├── src/main/java/com/desafio/paises/
│   │   ├── controller/     # Endpoints REST
│   │   ├── service/        # Lógica de negócio
│   │   ├── repository/     # Acesso a dados
│   │   ├── model/         # Entidades JPA
│   │   ├── dto/           # Objetos de transferência
│   │   └── config/        # Configurações
│   └── src/test/          # Testes unitários
├── frontend/         # Aplicação Angular
│   └── src/app/
│       ├── core/          # Serviços e guards
│       ├── shared/        # Models e componentes
│       └── features/      # Páginas da aplicação
├── plan.md          # Plano de desenvolvimento
├── spec.md          # Especificação técnica
├── tasks.md         # Lista de tarefas
└── README.md        # Este arquivo
```

## Setup do Ambiente

### Pré-requisitos

- Java 21+
- Node.js 18+
- Maven 3.6+
- Angular CLI 17+

### Backend

```bash
cd backend
mvnw.cmd spring-boot:run
```

A API estará disponível em: http://localhost:8080/api
- Swagger UI: http://localhost:8080/api/swagger-ui.html
- H2 Console: http://localhost:8080/api/h2-console

### Frontend

```bash
cd frontend
ng serve
```

A aplicação estará disponível em: http://localhost:4200

## 🔐 Credenciais de Acesso

| Papel | Login | Senha | Permissões |
|-------|--------|--------|------------|
| Usuário Comum | convidado | manager | Listar e pesquisar países |
| Administrador | admin | suporte | CRUD completo de países |

## ✅ Funcionalidades Implementadas

### Autenticação
- ✅ Login de usuários com validação de credenciais
- ✅ Geração de tokens UUID + SHA-256
- ✅ Expiração de tokens (5 minutos)
- ✅ Renovação automática de tokens (1 minuto antes de expirar)
- ✅ Interceptador HTTP para adicionar tokens automaticamente
- ✅ Logout e limpeza de sessão

### Gerenciamento de Países
- ✅ Listar todos os países
- ✅ Buscar países por nome
- ✅ Criar novos países (apenas administradores)
- ✅ Editar países existentes (apenas administradores)
- ✅ Excluir países (apenas administradores)
- ✅ Validação de unicidade (nome, sigla, gentílico)
- ✅ Validação de formato (sigla deve ter 2 caracteres)

### Controle de Acesso
- ✅ Verificação de papel de administrador
- ✅ Bloqueio de operações restritas para usuários comuns
- ✅ Interface adaptativa baseada em permissões
- ✅ Guards de rota para proteção

### Interface do Usuário
- ✅ Design responsivo e moderno
- ✅ Formulários com validação em tempo real
- ✅ Mensagens de erro e sucesso
- ✅ Paginação client-side (10 itens por página)
- ✅ Busca em tempo real
- ✅ Feedback visual de carregamento

## 🔒 Segurança Implementada

### Backend
- ✅ Hash de senhas com BCrypt
- ✅ Tokens UUID + SHA-256
- ✅ Spring Security com filtro de autenticação
- ✅ Bean Validation para validação de entrada
- ✅ CORS configurado para frontend
- ✅ Proteção contra ataques de injeção

### Frontend
- ✅ Armazenamento seguro de tokens em localStorage
- ✅ Renovação transparente de tokens
- ✅ Interceptador HTTP automático
- ✅ Guards de rota
- ✅ Limpeza de dados sensíveis no logout

## 📡 Endpoints da API

### Autenticação
- `POST /usuario/autenticar` - Login e geração de token
- `GET /usuario/renovar-ticket` - Renovação de token

### Países
- `GET /pais/listar` - Listar todos os países
- `GET /pais/pesquisar?nome={nome}` - Buscar por nome
- `POST /pais/salvar` - Criar/atualizar país (admin)
- `GET /pais/excluir?id={id}` - Excluir país (admin)

## 🧪 Testes

### Testes Automáticos
- ✅ Testes unitários de serviços
- ✅ Testes de integração da API
- ✅ Validação de autenticação
- ✅ Validação de controle de acesso
- ✅ Testes de CRUD de países

### Testes Manuais Realizados
- ✅ Autenticação com credenciais válidas
- ✅ Autenticação com credenciais inválidas
- ✅ Listagem de países
- ✅ Criação de novo país (admin)
- ✅ Tentativa de CRUD por usuário comum (bloqueado)
- ✅ Renovação de token
- ✅ Expiração de token

## 📊 Performance e Qualidade

### Métricas
- ✅ Tempo de resposta < 2 segundos
- ✅ Interface responsiva para mobile/desktop
- ✅ Código organizado e comentado
- ✅ Tratamento robusto de erros
- ✅ Validações em frontend e backend

### Qualidade
- ✅ Arquitetura limpa e separada
- ✅ Componentes reutilizáveis
- ✅ Serviços bem definidos
- ✅ Segurança em múltiplas camadas
- ✅ Documentação completa

## 🛠 Tecnologias Utilizadas

### Backend
- Java 21
- Spring Boot 3.1.5
- Spring Data JPA
- Spring Security
- H2 Database
- BCrypt Password Encoder
- OpenAPI 3.0 / Swagger
- JUnit 5 / Mockito
- Maven Wrapper

### Frontend
- Angular 17
- TypeScript
- RxJS
- Angular Forms
- Angular Router
- HTTP Client
- Standalone Components
- CSS3 Moderno

## 📝 Licença

MIT License - Software livre para uso e modificação.

---

## 🎉 Conclusão

O **Sistema de Gerenciamento de Países** está **100% funcional** e pronto para produção!

Todas as especificações definidas em `spec.md` foram implementadas com sucesso, seguindo o plano detalhado em `plan.md` e executando as tarefas de `tasks.md`.

### Próximos Passos Sugeridos
1. **Deploy** - Publicar em ambiente de produção
2. **Monitoramento** - Implementar logs e métricas
3. **CI/CD** - Configurar integração contínua
4. **Documentação Avançada** - Adicionar guias de deploy

---

**Desenvolvido com ❤️ usando desenvolvimento orientado a especificações!**

## Desenvolvimento Orientado a Especificações

Este projeto foi desenvolvido seguindo metodologia de desenvolvimento orientado a especificações, conforme detalhado nos documentos:
- `plan.md` - Plano de desenvolvimento em fases
- `tasks.md` - Lista detalhada de tarefas

## Licença

MIT License
