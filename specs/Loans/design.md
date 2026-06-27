
# Design Técnico: Módulo de Empréstimos

## Stack Tecnológica  
- **Runtime:** Node.js v20 LTS 
- **Linguagem:** TypeScript 
- **Banco de Dados:** PostgreSQL através do Prisma ORM

## Diretriz de Terminal
- Sempre utilize flags não-interativas nos comandos de terminal.
    Exemplo: use npm init -y em vez de npm init, e adicione --force ou --no-fund quando necessário para evitar prompts no terminal.

## Padrões de Projeto (Design Patterns)
- **Camadas:** Deve seguir rigidamente a Clean Architecture (Entities, UseCases, Controllers, Repositories). 
- **Tratamento de Erros:** Use classes customizadas (ex: `BookNotAvailableError`, `LimitReachedError`).

## Esquema de Banco de Dados (Prisma)
- **User:** `{ id, name, activeLoansCount (int) }`
- **Book:** `{ id, title, isAvailable (boolean) }`
- **Loan:** `{ id, userId, bookId, borrowedAt (datetime), returnedAt (datetime, nullable), penaltyFee (float) }`

## Endpoints da API (REST)
- **Books & Users:** `POST /api/users`, `POST /api/books`
- **Loans:** `POST /api/loans` (Emprestar), `PUT /api/loans/:id/return` (Devolver)
