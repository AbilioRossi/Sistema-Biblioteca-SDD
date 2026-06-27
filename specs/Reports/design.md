
# Design Técnico: Módulo de Relatórios

## Endpoints da API (REST)
- **Relatório de Atrasos:** `GET /api/reports/overdue`
  - *Response Esperado (JSON):* Array contendo `{ userName, bookTitle, daysOverdue, estimatedPenaltyFee }`
- **Ranking de Livros:** `GET /api/reports/popular-books`
  - *Response Esperado (JSON):* Array contendo `{ bookTitle, totalBorrows }`

## Padrões de Projeto
- **Queries Avançadas:** Este módulo deve usar o método `groupBy` ou consultas customizadas do Prisma para realizar as contagens (agregações), evitando trazer todos os dados para a memória do Node.js.