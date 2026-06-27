# Plano de Implementação: Módulo de Empréstimos (Loans)

## Visão Geral

Implementação do módulo de empréstimos seguindo Clean Architecture (Entities → Repositories → UseCases → Controllers), com TypeScript e Prisma ORM sobre PostgreSQL. Cada wave deve ser precedida por uma verificação do status do git conforme as regras do projeto.

## Tarefas

- [x] 1. Configuração do Projeto e Schema do Banco de Dados
  - [x] 1.1 Inicializar o projeto Node.js e instalar dependências base
    - Executar `npm init -y` na raiz do projeto
    - Instalar dependências de produção: `npm install express @prisma/client --no-fund`
    - Instalar dependências de desenvolvimento: `npm install -D typescript ts-node @types/express @types/node prisma jest ts-jest @types/jest supertest @types/supertest --no-fund`
    - Criar `tsconfig.json` com `target: "ES2020"`, `module: "commonjs"` e `strict: true`
    - Criar `jest.config.ts` configurando `ts-jest` como preset
    - _Requisitos: Design — Stack Tecnológica_

  - [x] 1.2 Configurar o schema do Prisma com os modelos User, Book e Loan
    - Executar `npx prisma init --no-install` para gerar a pasta `prisma/`
    - Definir o `schema.prisma` com os modelos conforme o design:
      - `User { id, name, activeLoansCount Int @default(0) }`
      - `Book { id, title, isAvailable Boolean @default(true) }`
      - `Loan { id, userId, bookId, borrowedAt DateTime @default(now()), returnedAt DateTime?, penaltyFee Float @default(0) }`
    - Configurar a relação entre `User → Loan` e `Book → Loan`
    - Executar `npx prisma format` e `npx prisma validate` — ambos devem passar sem erros
    - _Requisitos: Design — Esquema de Banco de Dados_

- [x] 2. Camada de Entidades e Erros Customizados
  - [x] 2.1 Criar as interfaces de domínio e classes de erro customizadas
    - Criar `src/entities/User.ts` com a interface `IUser`
    - Criar `src/entities/Book.ts` com a interface `IBook`
    - Criar `src/entities/Loan.ts` com a interface `ILoan`
    - Criar `src/errors/BookNotAvailableError.ts` estendendo `Error`
    - Criar `src/errors/LimitReachedError.ts` estendendo `Error`
    - Criar `src/errors/LoanNotFoundError.ts` estendendo `Error`
    - _Requisitos: RN-1, RN-2 — Regras de Negócio Fundamentais; Design — Tratamento de Erros_

  - [ ]* 2.2 Escrever testes unitários para as classes de erro
    - Verificar que cada classe de erro tem a propriedade `message` e `name` corretos
    - Garantir que são instâncias de `Error`
    - _Requisitos: Design — Tratamento de Erros_

- [x] 3. Camada de Repositórios (Interfaces e Implementações com Prisma)
  - [x] 3.1 Definir interfaces de repositório
    - Criar `src/repositories/IUserRepository.ts` com métodos: `findById`, `create`, `incrementActiveLoans`, `decrementActiveLoans`
    - Criar `src/repositories/IBookRepository.ts` com métodos: `findById`, `create`, `setAvailability`
    - Criar `src/repositories/ILoanRepository.ts` com métodos: `findById`, `create`, `update`, `countActiveByUser`
    - _Requisitos: RN-1 — Cadastro de usuários e livros_

  - [x] 3.2 Implementar repositórios concretos com Prisma
    - Criar `src/repositories/prisma/PrismaUserRepository.ts` implementando `IUserRepository`
    - Criar `src/repositories/prisma/PrismaBookRepository.ts` implementando `IBookRepository`
    - Criar `src/repositories/prisma/PrismaLoanRepository.ts` implementando `ILoanRepository`
    - Instanciar e exportar um singleton do `PrismaClient` em `src/lib/prisma.ts`
    - _Requisitos: RN-1 — Cadastro; Design — Prisma ORM_

- [x] 4. Checkpoint — Estrutura base validada
  - Garantir que `npx prisma validate` passa sem erros
  - Garantir que `npx tsc --noEmit` não reporta erros de tipos
  - Fazer commit: `feat(loans): finaliza estrutura base de entidades e repositórios`

- [x] 5. Caso de Uso: Empréstimo (BorrowUseCase)
  - [x] 5.1 Implementar BorrowUseCase com validações de negócio
    - Criar `src/usecases/BorrowUseCase.ts`
    - Receber `{ userId, bookId }` como input
    - Verificar se o livro existe e se `isAvailable === true`; caso contrário lançar `BookNotAvailableError`
    - Verificar se `activeLoansCount < 3`; caso contrário lançar `LimitReachedError`
    - Criar o registro de `Loan` com `borrowedAt = new Date()`
    - Chamar `setAvailability(bookId, false)` e `incrementActiveLoans(userId)` em sequência
    - Retornar o `Loan` criado
    - _Requisitos: UC01 — Empréstimo com Sucesso; UC02 — Bloqueio por Limite; RN-2_

  - [ ]* 5.2 Escrever testes unitários para BorrowUseCase
    - Usar repositórios mock (in-memory ou jest.fn)
    - **Caso feliz (UC01):** livro disponível + menos de 3 empréstimos → deve criar o Loan e retorná-lo
    - **Limite atingido (UC02):** `activeLoansCount === 3` → deve lançar `LimitReachedError` e não criar Loan
    - **Livro indisponível:** `isAvailable === false` → deve lançar `BookNotAvailableError`
    - _Requisitos: UC01, UC02, RN-2_

- [x] 6. Caso de Uso: Devolução (ReturnUseCase)
  - [x] 6.1 Implementar ReturnUseCase com cálculo de multa
    - Criar `src/usecases/ReturnUseCase.ts`
    - Receber `{ loanId }` como input
    - Buscar o empréstimo pelo id; lançar `LoanNotFoundError` se não existir
    - Calcular dias de atraso: `Math.max(0, diffDays(now, borrowedAt) - 7)`
    - Calcular `penaltyFee = daysLate * 2.0`
    - Atualizar o Loan com `returnedAt = new Date()` e `penaltyFee`
    - Chamar `setAvailability(bookId, true)` e `decrementActiveLoans(userId)`
    - Retornar o `Loan` atualizado com a multa calculada
    - _Requisitos: UC03 — Devolução com Multa; RN-3_

  - [ ]* 6.2 Escrever testes unitários para ReturnUseCase
    - Usar repositórios mock
    - **Caso com atraso (UC03):** `borrowedAt` simulado com 10 dias atrás → `penaltyFee` deve ser `6.00`
    - **Devolução no prazo:** `borrowedAt` com 5 dias atrás → `penaltyFee` deve ser `0`
    - **Devolução no exato prazo limite:** `borrowedAt` com 7 dias atrás → `penaltyFee` deve ser `0`
    - **Empréstimo inexistente:** deve lançar `LoanNotFoundError`
    - _Requisitos: UC03, RN-3_

- [-] 7. Checkpoint — Regras de negócio validadas
  - Executar `npx jest --testPathPattern=usecases --no-coverage` e garantir que todos os testes passam
  - Fazer commit: `feat(loans): finaliza BorrowUseCase e ReturnUseCase com testes unitários`

- [ ] 8. Camada de Controllers e Rotas da API
  - [~] 8.1 Implementar UsersController e BooksController (CRUD básico)
    - Criar `src/controllers/UsersController.ts` com métodos `create` (POST) e `list` (GET)
    - Criar `src/controllers/BooksController.ts` com métodos `create` (POST) e `list` (GET)
    - Cada controller deve receber `req, res` do Express e delegar ao repositório diretamente
    - Retornar status `201` na criação e `200` na listagem
    - _Requisitos: RN-1 — Cadastro; Design — Endpoints `POST /api/users`, `POST /api/books`_

  - [~] 8.2 Implementar LoansController conectando os UseCases
    - Criar `src/controllers/LoansController.ts`
    - Método `borrow`: chamar `BorrowUseCase`, retornar `201` com o Loan criado
    - Método `return`: chamar `ReturnUseCase`, retornar `200` com o Loan atualizado e a multa
    - Tratar erros customizados: `LimitReachedError` → `422`, `BookNotAvailableError` → `409`, `LoanNotFoundError` → `404`
    - _Requisitos: UC01, UC02, UC03; Design — Endpoints `POST /api/loans`, `PUT /api/loans/:id/return`_

  - [~] 8.3 Configurar rotas do Express e inicializar o servidor
    - Criar `src/routes/users.routes.ts`, `src/routes/books.routes.ts`, `src/routes/loans.routes.ts`
    - Criar `src/app.ts` registrando os routers com prefixo `/api`
    - Criar `src/server.ts` que importa `app` e chama `app.listen(3000)`
    - Exportar `app` separado de `server.ts` para facilitar os testes com Supertest
    - _Requisitos: Design — Endpoints da API_

  - [ ]* 8.4 Escrever testes E2E (Supertest) para os endpoints de Loans
    - Criar `src/__tests__/loans.e2e.spec.ts` usando `supertest(app)`
    - **POST /api/loans (sucesso):** deve retornar `201` e o corpo do Loan criado
    - **POST /api/loans (limite atingido):** deve retornar `422` com mensagem de erro
    - **PUT /api/loans/:id/return (com multa):** deve retornar `200` com `penaltyFee: 6.00`
    - **PUT /api/loans/:id/return (id inválido):** deve retornar `404`
    - Usar banco de dados de teste isolado via variável `DATABASE_URL` apontando para schema separado ou banco de teste
    - _Requisitos: UC01, UC02, UC03_

- [~] 9. Checkpoint Final — Testes E2E e integração completa
  - Executar `npx jest --no-coverage` e garantir que todos os testes (unitários e E2E) passam
  - Executar `npx tsc --noEmit` para verificar erros de tipo
  - Garantir que não há processos Node.js órfãos rodando em background
  - Fazer commit: `feat(loans): finaliza controllers, rotas e testes E2E`

## Notas

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido, mas são **obrigatórias** segundo as regras do projeto (`rules.md` — Testes obrigatórios)
- Cada tarefa principal concluída deve gerar um commit no padrão `feat(loans): finaliza [nome da tarefa]`
- Antes de cada wave, verificar o status do git (`git status`) e garantir repositório limpo
- Encerrar processos em background (`kill`) antes de iniciar uma nova wave para liberar memória
- O arquivo `src/app.ts` deve exportar `app` sem chamar `listen()` — isso é feito apenas no `server.ts`
- Use `--no-fund` e `-y` em todos os comandos `npm` para manter o terminal não-interativo

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "3.1"] },
    { "id": 2, "tasks": ["2.2", "3.2"] },
    { "id": 3, "tasks": ["5.1", "6.1"] },
    { "id": 4, "tasks": ["5.2", "6.2"] },
    { "id": 5, "tasks": ["8.1", "8.2"] },
    { "id": 6, "tasks": ["8.3"] },
    { "id": 7, "tasks": ["8.4"] }
  ]
}
```
