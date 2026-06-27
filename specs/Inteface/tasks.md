
jh# Plano de Tarefas: Interface Web e Deploy

<!-- WAVE 1: Preparação da API -->

- [x] **Task 1: Adicionar CORS e Endpoints de Leitura na API**
  - **Descrição:** Instalar o pacote `cors` (`npm install cors` e `npm install -D @types/cors`) e configurá-lo no `server.ts` conforme o `design.md`, lendo a origem permitida da variável de ambiente `FRONTEND_URL`. Adicionar os endpoints de listagem `GET /api/users`, `GET /api/books` e `GET /api/loans` nos respectivos controllers, implementando apenas uma query `findMany()` no Prisma — sem nova lógica de negócio.
  - **Validação:** Com o servidor rodando localmente, fazer uma requisição `fetch` a partir de uma página HTML aberta no Live Server (`localhost:5500`) para `GET /api/users` deve retornar status 200 sem erro de CORS no console do browser.

<!-- WAVE 2: Frontend -->

- [x] **Task 2: Estrutura Base do Frontend (`config.js`, `api.js`, `style.css`, `index.html`)**
  - **Depende de:** Task 1
  - **Descrição:** Criar a pasta `frontend/` com os arquivos base: `config.js` exportando a `API_BASE_URL` apontando para `localhost:3000` em dev; `api.js` com funções `get(path)` e `post(path, body)` e `put(path, body)` que centralizam o `fetch`, tratam erros HTTP e lançam o texto do erro da API; `style.css` com o layout de sidebar + área principal + barra de notificação; `index.html` redirecionando para `pages/loans.html`.
  - **Validação:** Abrir o `index.html` no Live Server deve redirecionar para a tela de Empréstimos e exibir o layout com sidebar sem erros no console.

- [x] **Task 3: Tela de Usuários (`users.html` + `users.js`)**
  - **Depende de:** Task 2
  - **Descrição:** Criar a tela de Usuários com formulário de cadastro (campo nome + botão "Cadastrar") e tabela de listagem (colunas: ID, Nome, Empréstimos Ativos). O `users.js` deve chamar `POST /api/users` no submit do formulário e `GET /api/users` para popular a tabela — recarregando a tabela após cada cadastro bem-sucedido. Exibir mensagem de sucesso ou erro via a barra de notificação definida no `style.css`.
  - **Validação:** Cadastrar dois usuários pela tela e confirmar que ambos aparecem na tabela e estão persistidos no banco.

- [x] **Task 4: Tela de Livros (`books.html` + `books.js`)**
  - **Depende de:** Task 2
  - **Descrição:** Criar a tela de Livros com formulário de cadastro (campo título + botão "Cadastrar") e tabela de listagem (colunas: ID, Título, Disponível). Lógica análoga à Task 3, consumindo `POST /api/books` e `GET /api/books`.
  - **Validação:** Cadastrar um livro e confirmar que ele aparece na tabela com status "Disponível". Após realizar um empréstimo (pela tela de empréstimos), recarregar a tela de Livros e confirmar que o status muda para "Indisponível".

- [x] **Task 5: Tela de Empréstimos (`loans.html` + `loans.js`)**
  - **Depende de:** Task 3, Task 4
  - **Descrição:** Criar a tela de Empréstimos com: (1) formulário com dois `<select>` — um para usuário (populado via `GET /api/users`) e um para livro disponível (populado via `GET /api/books`, filtrando `isAvailable === true`) — e botão "Emprestar" que chama `POST /api/loans`; (2) tabela de empréstimos ativos (colunas: Usuário, Livro, Data do Empréstimo, Ação) com botão "Devolver" por linha, que chama `PUT /api/loans/:id/return` e exibe o valor da multa na mensagem de sucesso (ex: "Devolução registrada. Multa: R$ 6,00").
  - **Validação:** Realizar um empréstimo e depois uma devolução via interface, confirmando que a multa correta é exibida (simular atraso ajustando `borrowedAt` direto no banco para testar).

- [x] **Task 6: Tela de Relatórios (`reports.html` + `reports.js`)**
  - **Depende de:** Task 2
  - **Descrição:** Criar a tela de Relatórios com dois botões de ação e duas tabelas de resultado na mesma página. "Ver Inadimplentes" chama `GET /api/reports/overdue` e renderiza tabela com colunas (Usuário, Livro, Dias de Atraso, Multa Estimada). "Livros Populares" chama `GET /api/reports/popular-books` e renderiza tabela com colunas (Livro, Total de Empréstimos). Cada botão deve exibir um estado de "Carregando..." enquanto a requisição está em andamento.
  - **Validação:** Com dados de atraso no banco, clicar em "Ver Inadimplentes" deve retornar a lista correta. Clicar em "Livros Populares" deve retornar os livros em ordem decrescente de empréstimos.

<!-- WAVE 3: Deploy -->

- [x] **Task 7: Deploy da API no Railway**
  - **Depende de:** Task 1
  - **Descrição:** Criar o arquivo `railway.json` na raiz do repositório conforme o `design.md`. Criar um projeto no Railway, conectar ao repositório GitHub, provisionar o plugin PostgreSQL e configurar as variáveis de ambiente: `DATABASE_URL` (gerada automaticamente pelo Railway) e `FRONTEND_URL` (URL do Vercel, pode ser configurada após a Task 8). Fazer o primeiro deploy e verificar os logs.
  - **Validação:** A URL pública gerada pelo Railway (ex: `https://biblioteca-api.up.railway.app/api/users`) deve retornar `[]` com status 200 ao ser acessada pelo browser.

- [x] **Task 8: Deploy do Frontend no Vercel**
  - **Depende de:** Task 6, Task 7
  - **Descrição:** Criar o arquivo `vercel.json` na raiz do repositório conforme o `design.md`. Atualizar o `config.js` do frontend para apontar para a URL pública da API no Railway. Criar um projeto no Vercel, conectar ao repositório GitHub e definir a pasta `frontend/` como diretório raiz. Após o deploy, copiar a URL do Vercel e adicioná-la como `FRONTEND_URL` no Railway para finalizar a configuração do CORS.
  - **Validação:** Acessar a URL pública do Vercel, navegar por todas as telas, cadastrar um usuário e um livro, realizar um empréstimo e gerar um relatório — tudo sem erros de CORS ou de rede.
