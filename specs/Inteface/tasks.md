# Plano de Tarefas: Interface Web e Deploy

- [x] 1. CORS e Endpoints de Leitura na API
  - [x] 1.1 Instalar cors e configurar no app.ts
    - Instalar: `npm install cors --no-fund` e `npm install -D @types/cors --no-fund`
    - Configurar CORS no `src/app.ts` com origens permitidas: `process.env.FRONTEND_URL`, `http://localhost:5500`, `http://127.0.0.1:5500`
    - Adicionar `FRONTEND_URL=http://localhost:5500` no `.env`
    - _Requisitos: RN-2 — CORS_

  - [x] 1.2 Adicionar endpoints GET de leitura nos controllers
    - `UsersController`: adicionar método `list` com `GET /api/users` → `prisma.user.findMany()`
    - `BooksController`: adicionar método `list` com `GET /api/books` → `prisma.book.findMany()`
    - Adicionar `GET /api/loans` no `LoansController` → `prisma.loan.findMany({ include: { user: true, book: true } })`
    - Registrar as rotas GET em `users.routes.ts`, `books.routes.ts` e `loans.routes.ts`
    - Verificar `npx tsc --noEmit` e fazer commit: `feat(interface): adiciona CORS e endpoints GET de leitura`
    - _Requisitos: Design — Endpoints Consumidos pelo Frontend_

- [ ] 2. Estrutura Base do Frontend
  - Depende de: Task 1
  - [x] 2.1 Criar arquivos base: config.js, api.js, style.css, index.html
    - Criar `frontend/config.js` com `const API_BASE_URL = 'http://localhost:3000/api'`
    - Criar `frontend/js/api.js` com funções `get(path)`, `post(path, body)`, `put(path, body)` centralizando o fetch com tratamento de erros
    - Criar `frontend/css/style.css` com layout sidebar fixa à esquerda + área principal + barra de notificação (verde/vermelho)
    - Criar `frontend/index.html` redirecionando para `pages/loans.html`
    - Fazer commit: `feat(interface): cria estrutura base do frontend`
    - _Requisitos: Design — Estrutura de Arquivos_

- [x] 3. Tela de Usuários
  - Depende de: Task 2
  - [x] 3.1 Criar users.html e users.js
    - Criar `frontend/pages/users.html` com sidebar, formulário (campo nome + botão Cadastrar) e tabela (ID, Nome, Empréstimos Ativos)
    - Criar `frontend/js/users.js` chamando `POST /api/users` no submit e `GET /api/users` para popular a tabela
    - Exibir notificações de sucesso/erro via barra de notificação
    - Fazer commit: `feat(interface): cria tela de usuários`
    - _Requisitos: UC01_

- [x] 4. Tela de Livros
  - Depende de: Task 2
  - [x] 4.1 Criar books.html e books.js
    - Criar `frontend/pages/books.html` com sidebar, formulário (campo título + botão Cadastrar) e tabela (ID, Título, Disponível)
    - Criar `frontend/js/books.js` chamando `POST /api/books` e `GET /api/books`
    - Fazer commit: `feat(interface): cria tela de livros`
    - _Requisitos: UC02_

- [x] 5. Tela de Empréstimos
  - Depende de: Task 3, Task 4
  - [x] 5.1 Criar loans.html e loans.js
    - Criar `frontend/pages/loans.html` com sidebar, formulário com dois selects (usuário + livro disponível) e tabela de empréstimos ativos (Usuário, Livro, Data, Ação)
    - Criar `frontend/js/loans.js`:
      - Popular selects via `GET /api/users` e `GET /api/books` (filtrar `isAvailable === true`)
      - Botão Emprestar → `POST /api/loans`
      - Botão Devolver → `PUT /api/loans/:id/return`, exibir multa na notificação ("Devolução registrada. Multa: R$ X,XX")
    - Fazer commit: `feat(interface): cria tela de empréstimos`
    - _Requisitos: UC03, UC04_

- [x] 6. Tela de Relatórios
  - Depende de: Task 2
  - [x] 6.1 Criar reports.html e reports.js
    - Criar `frontend/pages/reports.html` com sidebar, dois botões (Ver Inadimplentes / Livros Populares) e duas tabelas de resultado
    - Criar `frontend/js/reports.js`:
      - Ver Inadimplentes → `GET /api/reports/overdue` → tabela (Usuário, Livro, Dias de Atraso, Multa Estimada)
      - Livros Populares → `GET /api/reports/popular-books` → tabela (Livro, Total de Empréstimos)
      - Estado de "Carregando..." em cada botão enquanto a requisição ocorre
    - Fazer commit: `feat(interface): cria tela de relatórios`
    - _Requisitos: UC05, UC06_

- [x] 7. Arquivos de Configuração de Deploy
  - Depende de: Task 1
  - [x] 7.1 Criar railway.json e vercel.json
    - Criar `railway.json` na raiz com build NIXPACKS e startCommand `npx prisma migrate deploy && node dist/server.js`
    - Criar `vercel.json` na raiz apontando root para `frontend/`
    - Adicionar script `"build": "npx tsc"` no `package.json`
    - Fazer commit: `feat(interface): adiciona arquivos de configuração de deploy`
    - _Requisitos: UC07, UC08 — Deploy_
