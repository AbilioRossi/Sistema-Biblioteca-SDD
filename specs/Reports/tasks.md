
# Plano de Tarefas: Relatórios

- [x] **Task 1: UseCase do Relatório de Atrasos**
  - **Descrição:** Criar a lógica que consulta os empréstimos em atraso, calcula os dias de atraso matematicamente e formata o DTO (Data Transfer Object) de saída.
  - **Validação:** Teste unitário no Jest validando se o cálculo de dias de atraso da lista gerada está correto.

- [x] **Task 2: UseCase de Livros Populares**
  - **Descrição:** Utilizar o Prisma para contar quantas vezes cada `bookId` aparece na tabela `Loan`, e juntar com o título do livro.
  - **Validação:** Teste unitário garantindo que a lista é retornada em ordem decrescente (do mais emprestado para o menos).

- [x] **Task 3: Controllers e Rotas de Relatório**
  - **Depende de:** Task 1, Task 2
  - **Descrição:** Criar o `ReportController` e expor as rotas `GET /api/reports/overdue` e `GET /api/reports/popular-books`.
  - **Validação:** Testes E2E (Supertest) garantindo que as rotas retornam status HTTP 200 com arrays em formato JSON.