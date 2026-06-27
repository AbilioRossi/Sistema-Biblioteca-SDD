# Plano de Tarefas: Relatórios

- [x] 1. UseCase do Relatório de Atrasos (OverdueReportUseCase)
  - [x] 1.1 Implementar OverdueReportUseCase
    - Criar `src/reports/OverdueReportUseCase.ts`
    - DTO de saída: `{ userName: string, bookTitle: string, daysOverdue: number, estimatedPenaltyFee: number }`
    - Método `execute()`: query no Prisma para loans com `returnedAt: null` e `borrowedAt < agora - 7 dias`, com `include: { user: true, book: true }`
    - Para cada loan: calcular `daysOverdue = Math.floor((now - borrowedAt) / ms_per_day) - 7` e `estimatedPenaltyFee = daysOverdue * 2.0`
    - Retornar array de DTOs formatados
    - _Requisitos: UC01 — Relatório de Atrasos_

  - [x] 1.2 Escrever teste unitário do OverdueReportUseCase
    - Criar `src/reports/__tests__/OverdueReportUseCase.spec.ts`
    - Mockar `src/lib/prisma` com `jest.mock`
    - Cenário 1: loan com 10 dias → `daysOverdue = 3`, `estimatedPenaltyFee = 6.0`
    - Cenário 2: nenhum loan em atraso → retorna array vazio
    - Executar `npx jest --testPathPattern="OverdueReportUseCase" --no-coverage`
    - _Requisitos: Task 1 — Validação_

- [x] 2. UseCase de Livros Populares (PopularBooksUseCase)
  - [x] 2.1 Implementar PopularBooksUseCase
    - Criar `src/reports/PopularBooksUseCase.ts`
    - DTO de saída: `{ bookTitle: string, totalBorrows: number }`
    - Método `execute()`: usar `prisma.loan.groupBy({ by: ['bookId'], _count: { bookId: true } })`
    - Fazer lookup dos títulos via `prisma.book.findMany({ where: { id: { in: bookIds } } })`
    - Ordenar resultado em ordem decrescente por `totalBorrows`
    - Retornar array de DTOs
    - _Requisitos: UC02 — Ranking de Livros_

  - [x] 2.2 Escrever teste unitário do PopularBooksUseCase
    - Criar `src/reports/__tests__/PopularBooksUseCase.spec.ts`
    - Mockar `src/lib/prisma` com `jest.mock`
    - Cenário 1: 2 books com contagens diferentes → retornar em ordem decrescente
    - Cenário 2: nenhum loan → retorna array vazio
    - Executar `npx jest --testPathPattern="PopularBooksUseCase" --no-coverage`
    - _Requisitos: Task 2 — Validação_

- [x] 3. ReportController e Rotas
  - Depende de: Task 1, Task 2
  - [x] 3.1 Implementar ReportController e rotas
    - Criar `src/reports/ReportController.ts`
    - Método `overdue(req, res)`: chamar `OverdueReportUseCase`, retornar `200` com array JSON
    - Método `popularBooks(req, res)`: chamar `PopularBooksUseCase`, retornar `200` com array JSON
    - Criar `src/routes/reports.routes.ts` com `GET /overdue` e `GET /popular-books`
    - Registrar o router em `src/app.ts` com prefixo `/api/reports`
    - _Requisitos: Design — Endpoints GET /api/reports/overdue e /api/reports/popular-books_

  - [x] 3.2 Verificar integração e commit final
    - Verificar `npx tsc --noEmit`
    - Executar `npx jest --no-coverage` — todos os testes devem passar
    - Fazer commit: `feat(reports): finaliza módulo de relatórios com controllers e rotas`
    - _Requisitos: Task 3 — Validação_
