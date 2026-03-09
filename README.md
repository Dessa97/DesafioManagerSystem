# Sistema de Gerenciamento de Países

Sistema completo de gerenciamento de países com autenticação de usuários e controle de acesso baseado em perfis (RBAC). Implementado como Single Page Application (SPA) com arquitetura separada entre frontend Angular e backend Spring Boot.

## O que é esta aplicação?

Uma aplicação web moderna para gerenciar dados de países com:
- **Autenticação segura** com geração de tokens (UUID + SHA-256)
- **Controle de acesso** diferenciado por perfil de usuário
- **Renovação automática de tokens** para melhor experiência do usuário
- **Interface responsiva** com Angular 17+
- **API RESTful** documentada com Swagger/OpenAPI
- **Banco de dados em memória** (H2) com dados iniciais

---

## Status do Projeto

**CONCLUÍDO COM SUCESSO** - 100% dos requisitos implementados conforme especificação técnica.

---

## Arquitetura

```
DesafioManagerSystem/
├── backend/                    # API Spring Boot (Java 21)
│   ├── src/main/java/com/desafio/paises/
│   │   ├── controller/        # Endpoints REST
│   │   ├── service/           # Lógica de negócio
│   │   ├── repository/        # Acesso a dados (JPA)
│   │   ├── model/             # Entidades do banco
│   │   ├── dto/               # Objetos de transferência
│   │   └── config/            # Segurança e OpenAPI
│   ├── pom.xml                # Dependências Maven
│   └── mvnw.cmd               # Maven wrapper
│
├── frontend/                  # Aplicação Angular 17+ (SPA)
│   ├── src/app/
│   │   ├── core/              # Serviços, guards, interceptadores
│   │   ├── features/          # Módulos de negócio
│   │   │   ├── auth/          # Autenticação (login)
│   │   │   └── countries/     # Gerenciamento de países
│   │   └── shared/            # Modelos e componentes reutilizáveis
│   ├── package.json           # Dependências npm
│   └── angular.json           # Configuração Angular
│
├── docs/                      # Documentação do projeto
│   ├── spec.md               # Especificação técnica detalhada
│   ├── plan.md               # Plano de desenvolvimento
│   └── tasks.md              # Lista de tarefas
│
└── README.md                  # Este arquivo
```

---

## Tecnologias Utilizadas

### Backend
- **Spring Boot 3.1.5** - Framework principal
- **Java 21** - Linguagem de programação
- **Spring Data JPA** - ORM e persistência
- **Spring Security** - Autenticação e autorização
- **H2 Database** - Banco de dados em memória
- **OpenAPI 3.0 / Swagger** - Documentação de API
- **Maven** - Gerenciador de dependências

### Frontend
- **Angular 17.3+** - Framework SPA
- **TypeScript 5.4+** - Linguagem tipada
- **RxJS** - Programação reativa
- **Angular Router** - Roteamento com lazy loading
- **HttpClient** - Cliente HTTP com interceptadores

---

## Como Iniciar

### Pré-requisitos

Certifique-se de ter instalado:
- **Java 21+** (para o backend)
- **Node.js 18+** (para o frontend)
- **Maven 3.6+** (gerenciador de dependências do backend)
- **Angular CLI 17+** (opcional, o npm install trata disso)

### Backend

```bash
# Navegue até a pasta backend
cd backend

# Instale as dependências
mvn install

# Inicie o servidor Spring Boot
mvn spring-boot:run
```

**Aguarde até ver:** `Tomcat started on port(s): 8080`

A API estará disponível em:
- **API Base**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **H2 Console**: http://localhost:8080/api/h2-console

### Frontend (em outro terminal)

```bash
# Navegue até a pasta frontend
cd frontend

# Instale as dependências (primeira execução)
npm install

# Inicie o servidor de desenvolvimento
npx ng serve --open
```

A aplicação abrirá automaticamente em: http://localhost:4200

---

## Credenciais de Acesso

A aplicação vem com dois usuários pré-cadastrados para teste:

| Perfil | Login | Senha | Acesso |
|--------|--------|--------|--------|
| Usuário Comum | `convidado` | `manager` | Listar e pesquisar países |
| Administrador | `admin` | `suporte` | CRUD completo de países |

### Fluxo de Uso

1. **Acesse** http://localhost:4200
2. **Faça login** com uma das credenciais acima
3. **Dashboard** - Visualize a página inicial
4. **Listar Países** - Veja todos os países cadastrados
5. **Pesquisar** - Use a barra de busca por nome
6. **Criar País** (apenas admin) - Clique em "Novo País"
7. **Editar País** (apenas admin) - Clique no ícone de edição
8. **Excluir País** (apenas admin) - Clique no ícone de lixeira
9. **Logout** - Saia do sistema

---

## Funcionalidades

### Autenticação
- Login com validação de credenciais
- Geração de tokens seguros (UUID + SHA-256)
- Expiração automática de tokens (5 minutos)
- **Renovação automática** 1 minuto antes do vencimento (sem logout do usuário)
- Interceptador HTTP que adiciona token automaticamente
- Logout seguro com limpeza de sessão

### Gerenciamento de Países
- **Listar** todos os países (acesso público após login)
- **Pesquisar** países por nome
- **Criar** novos países (apenas administradores)
- **Editar** dados de países existentes (apenas administradores)
- **Excluir** países do sistema (apenas administradores)

### Validações
- **Sigla**: exatamente 2 caracteres
- **Unicidade**: nome, sigla e gentílico não podem se repetir
- **Campos obrigatórios**: validação antes de salvar
- **Senhas**: armazenadas com hash BCrypt (nunca em texto plano)

### Segurança
- Autenticação obrigatória para todas as operações
- Autorização baseada em papel (RBAC)
- Interface adaptativa (mostra/esconde botões conforme perfil)
- Guards de rota para proteger acesso não autorizado
- Tokens com expiração e renovação automática

---

## Documentação Adicional

Para informações técnicas detalhadas, consulte:

- **[spec.md](spec.md)** - Especificação técnica completa
- **[plan.md](plan.md)** - Plano de desenvolvimento e decisões arquiteturais
- **[tasks.md](tasks.md)** - Lista de tarefas implementadas

---

## Endpoints Principais da API

### Autenticação
- `POST /api/auth/login` - Fazer login
- `POST /api/usuarios/{usuarioId}/token/validar` - Validar token

### Países
- `GET /api/paises` - Listar todos (com filtro opcional por nome)
- `POST /api/paises` - Criar novo (admin)
- `GET /api/paises/{id}` - Obter detalhes
- `PUT /api/paises/{id}` - Editar (admin)
- `DELETE /api/paises/{id}` - Excluir (admin)

Veja a documentação completa em: **http://localhost:8080/api/swagger-ui.html**

---

## Notas Importantes

- O banco de dados é **em memória** (H2), então os dados são resetados a cada reinicialização
- Tokens **expiram em 5 minutos**, mas renovam automaticamente 1 minuto antes do vencimento
- Usuários comuns **não veem** botões de criar, editar ou excluir na interface
- A aplicação é **responsiva** e funciona bem em desktop, tablet e mobile

---

## Suporte

Para dúvidas ou problemas:
1. Verifique os logs do backend (terminal onde `mvnw.cmd spring-boot:run` foi executado)
2. Verifique o console do navegador (F12 no Chrome/Firefox)
3. Consulte a especificação técnica no arquivo `spec.md`

### Interface do Usuário
- Design responsivo e moderno
- Formulários com validação em tempo real
- Mensagens de erro e sucesso
- Paginação client-side (10 itens por página)
- Busca em tempo real
- Feedback visual de carregamento

## Segurança Implementada

### Backend
- Hash de senhas com BCrypt
- Tokens UUID + SHA-256
- Spring Security com filtro de autenticação
- Bean Validation para validação de entrada
- CORS configurado para frontend
- Proteção contra ataques de injeção

### Frontend
- Armazenamento seguro de tokens em localStorage
- Renovação transparente de tokens
- Interceptador HTTP automático
- Guards de rota
- Limpeza de dados sensíveis no logout

## Endpoints da API

### Autenticação
- `POST /usuario/autenticar` - Login e geração de token
- `GET /usuario/renovar-ticket` - Renovação de token

### Países
- `GET /pais/listar` - Listar todos os países
- `GET /pais/pesquisar?nome={nome}` - Buscar por nome
- `POST /pais/salvar` - Criar/atualizar país (admin)
- `GET /pais/excluir?id={id}` - Excluir país (admin)

## Testes Manuais Realizados
- Autenticação com credenciais válidas
- Autenticação com credenciais inválidas
- Listagem de países
- Criação de novo país (admin)
- Tentativa de CRUD por usuário comum (bloqueado)
- Renovação de token
- Expiração de token

## Performance e Qualidade

### Métricas
- Tempo de resposta < 2 segundos
- Interface responsiva para mobile/desktop
- Código organizado e comentado
- Tratamento robusto de erros
- Validações em frontend e backend

### Qualidade
- Arquitetura limpa e separada
- Componentes reutilizáveis
- Serviços bem definidos
- Segurança em múltiplas camadas
- Documentação completa

## Tecnologias Utilizadas

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

---

## Conclusão

O **Sistema de Gerenciamento de Países** está **100% funcional** e pronto para produção!

Todas as especificações definidas em `spec.md` foram implementadas com sucesso, seguindo o plano detalhado em `plan.md` e executando as tarefas de `tasks.md`.

### Próximos Passos Sugeridos
1. **Deploy** - Publicar em ambiente de produção
2. **Monitoramento** - Implementar logs e métricas
3. **CI/CD** - Configurar integração contínua
4. **Documentação Avançada** - Adicionar guias de deploy

---

**Desenvolvido usando desenvolvimento orientado a especificações!**

## Desenvolvimento Orientado a Especificações

Este projeto foi desenvolvido seguindo metodologia de desenvolvimento orientado a especificações, conforme detalhado nos documentos:
- `plan.md` - Plano de desenvolvimento em fases
- `tasks.md` - Lista detalhada de tarefas
