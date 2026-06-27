
# Design Técnico: Módulo de Notificações

## Stack Adicional Necessária
- **Agendador de Tarefas:** Biblioteca `node-cron` para rodar o job diário.
- **Envio de E-mails:** Biblioteca `nodemailer` (usando o Ethereal Email para simular envios durante o desenvolvimento, sem precisar de SMTP real).

## Contrato de Serviço (Background Job)
- Não haverá rotas HTTP públicas para este módulo.
- **Cron Expression:** `0 8 * * *` (Rodar todos os dias às 08:00 da manhã).

## Interação com Banco de Dados (Prisma)
- O módulo precisará realizar queries nas tabelas existentes `Loan`, fazendo `JOIN` (include) com `User` e `Book` para resgatar os e-mails e nomes dos livros.