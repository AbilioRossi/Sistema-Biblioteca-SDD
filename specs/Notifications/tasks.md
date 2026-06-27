# Plano de Tarefas: Notificações

- [x] 1. Setup do Nodemailer e EmailService
  - [x] 1.1 Instalar nodemailer e configurar EmailService
    - Instalar dependências: `npm install nodemailer --no-fund` e `npm install -D @types/nodemailer --no-fund`
    - Criar `src/notifications/EmailService.ts` com método `sendEmail({ to, subject, text })`
    - Usar Ethereal Email para desenvolvimento: criar conta de teste via `nodemailer.createTestAccount()` e logar a URL de preview
    - Exportar a classe `EmailService`
    - _Requisitos: Design — Stack Adicional, UC01_

  - [x] 1.2 Escrever teste unitário do EmailService
    - Criar `src/notifications/__tests__/EmailService.spec.ts`
    - Mockar o método `sendMail` do transporter do nodemailer com `jest.fn()`
    - Verificar que `sendEmail` é chamado com os parâmetros corretos (`to`, `subject`, `text`)
    - _Requisitos: Task 1 — Validação_

- [x] 2. NotifyOverdueLoansUseCase
  - Depende de: Task 1
  - [x] 2.1 Implementar NotifyOverdueLoansUseCase
    - Criar `src/notifications/NotifyOverdueLoansUseCase.ts`
    - Receber `EmailService` via injeção de dependência no construtor
    - Método `execute()`:
      - Buscar via Prisma todos os Loans onde `returnedAt` é null e `borrowedAt` < (agora - 7 dias)
      - Fazer `include: { user: true, book: true }` para obter nome do livro e e-mail do usuário
      - Para cada Loan em atraso: calcular dias de atraso e multa (daysLate * 2.0)
      - Formatar mensagem: `"Aviso: O livro [Nome do Livro] está com devolução atrasada. Multa atual: R$ [Valor]."`
      - Chamar `emailService.sendEmail({ to: user.email, subject: 'Aviso de Atraso', text: mensagem })`
    - _Requisitos: UC01, RN-1, RN-2_

  - [x] 2.2 Escrever testes do NotifyOverdueLoansUseCase
    - Criar `src/notifications/__tests__/NotifyOverdueLoansUseCase.spec.ts`
    - Mockar o PrismaClient com `jest.mock`
    - Cenário 1: empréstimo com 10 dias de atraso → deve chamar `sendEmail` com multa R$ 6,00
    - Cenário 2: nenhum empréstimo em atraso → não deve chamar `sendEmail`
    - _Requisitos: Task 2 — Validação_

- [ ] 3. Configuração do Cron Job
  - Depende de: Task 2
  - [x] 3.1 Instalar node-cron e configurar o job diário
    - Instalar: `npm install node-cron --no-fund` e `npm install -D @types/node-cron --no-fund`
    - Criar `src/notifications/overdueNotificationJob.ts`
    - Agendar com cron expression `0 8 * * *` (diariamente às 08:00h)
    - Instanciar `EmailService` e `NotifyOverdueLoansUseCase` e chamar `execute()` dentro do job
    - _Requisitos: Design — Cron Expression_

  - [x] 3.2 Integrar o job ao server.ts
    - Importar e inicializar `overdueNotificationJob` no `src/server.ts`
    - Verificar que `npx tsc --noEmit` passa sem erros após a integração
    - Fazer commit: `feat(notifications): finaliza módulo de notificações com cron job`
    - _Requisitos: Task 3 — Validação_
