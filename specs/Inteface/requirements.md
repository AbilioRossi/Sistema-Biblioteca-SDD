# Requisitos do Módulo: Interface Web e Deploy

## Visão Geral
Este módulo transforma o sistema de biblioteca em uma aplicação web completa e acessível por qualquer browser. A API Express existente será hospedada no **Railway** (com PostgreSQL já integrado) e o frontend estático em HTML/CSS/JS puro será hospedado no **Vercel** — ambos com plano gratuito e deploy automático via GitHub.

## Regras de Negócio Fundamentais

1. **Separação de Responsabilidades:** O frontend é um conjunto de arquivos estáticos que se comunica exclusivamente com a API via `fetch`. Nenhuma lógica de negócio reside no frontend.
2. **CORS:** A API deve aceitar requisições somente do domínio do frontend publicado no Vercel (e de `localhost` em ambiente de desenvolvimento).
3. **Feedback Visual:** Toda operação deve exibir ao bibliotecário uma mensagem de sucesso ou o erro retornado pela API — nunca falhar silenciosamente.
4. **Dados em Tempo Real:** Toda vez que uma tela é aberta ou uma operação é concluída, as listagens devem ser recarregadas da API para refletir o estado atual do banco.
5. **Zero Mudança na API:** Os endpoints, regras de negócio, banco de dados PostgreSQL e estrutura Clean Architecture existentes permanecem intocados.

## Casos de Uso / Histórias

### UC01 - Cadastro de Usuário via Interface
- **Dado** que o bibliotecário está na tela de Usuários
- **Quando** ele preencher o nome e clicar em "Cadastrar"
- **Então** o frontend deve chamar `POST /api/users`
- **E** exibir "Usuário cadastrado com sucesso!" e recarregar a lista.

### UC02 - Cadastro de Livro via Interface
- **Dado** que o bibliotecário está na tela de Livros
- **Quando** ele preencher o título e clicar em "Cadastrar"
- **Então** o frontend deve chamar `POST /api/books`
- **E** exibir "Livro cadastrado com sucesso!" e recarregar a lista.

### UC03 - Realizar Empréstimo via Interface
- **Dado** que o bibliotecário está na tela de Empréstimos
- **Quando** ele selecionar um usuário e um livro disponível e clicar em "Emprestar"
- **Então** o frontend deve chamar `POST /api/loans`
- **E** atualizar a lista de empréstimos ativos.
- **E** caso o usuário já tenha 3 empréstimos, exibir a mensagem de erro retornada pela API.

### UC04 - Registrar Devolução via Interface
- **Dado** que existe um empréstimo ativo listado na tela
- **Quando** o bibliotecário clicar em "Devolver" ao lado do empréstimo
- **Então** o frontend deve chamar `PUT /api/loans/:id/return`
- **E** exibir o valor da multa (ex: "Devolução registrada. Multa: R$ 6,00") caso haja atraso.

### UC05 - Consultar Relatório de Inadimplentes
- **Dado** que o bibliotecário está na tela de Relatórios
- **Quando** ele clicar em "Ver Inadimplentes"
- **Então** o frontend deve chamar `GET /api/reports/overdue`
- **E** renderizar uma tabela com nome do aluno, título do livro e dias de atraso.

### UC06 - Consultar Ranking de Livros Populares
- **Dado** que o bibliotecário está na tela de Relatórios
- **Quando** ele clicar em "Livros Populares"
- **Então** o frontend deve chamar `GET /api/reports/popular-books`
- **E** renderizar uma tabela ordenada do livro mais para o menos emprestado.

### UC07 - Deploy da API no Railway
- **Dado** que o repositório está no GitHub
- **Quando** um push for feito na branch `main`
- **Então** o Railway deve fazer o redeploy automático da API
- **E** o banco de dados PostgreSQL provisionado pelo Railway deve ser preservado.

### UC08 - Deploy do Frontend no Vercel
- **Dado** que a pasta `frontend/` está no repositório
- **Quando** um push for feito na branch `main`
- **Então** o Vercel deve detectar e publicar os arquivos estáticos automaticamente
- **E** a variável de ambiente `VITE_API_URL` (ou equivalente em JS puro) deve apontar para a URL da API no Railway.
