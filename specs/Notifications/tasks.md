
# Plano de Tarefas: Notificações

- [x] **Task 1: Setup do Nodemailer**
  - **Descrição:** Instalar e configurar o `nodemailer` criando um serviço isolado (`EmailService`) que consiga disparar e-mails de texto simples.
  - **Validação:** Escrever um teste unitário que faça o mock do envio de e-mail e verifique se a função foi chamada corretamente.

- [x] **Task 2: Caso de Uso de Notificação (NotifyOverdueLoansUseCase)**
  - **Depende de:** Task 1
  - **Descrição:** Criar a lógica que busca no Prisma todos os `Loans` onde `returnedAt` é nulo e a data atual é maior que `borrowedAt` + 7 dias. Para cada resultado, usar o `EmailService` para enviar o alerta calculado.
  - **Validação:** Criar um teste de integração no Jest populando o banco com um empréstimo atrasado e garantindo que o serviço de e-mail seja acionado.

- [x] **Task 3: Configuração do Cron Job**
  - **Depende de:** Task 2
  - **Descrição:** Instalar o `node-cron` e agendar a execução do `NotifyOverdueLoansUseCase` para rodar diariamente às 08:00h.
  - **Validação:** Garantir que o script de inicialização (`server.ts`) chame o job sem quebrar a aplicação.