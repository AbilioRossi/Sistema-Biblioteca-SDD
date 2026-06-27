
# Requisitos do Módulo: Empréstimos da Biblioteca

## Regras de Negócio Fundamentais
1. **Cadastro:** O sistema deve permitir o gerenciamento (CRUD) de usuários (`User`) e livros (`Book`).
2. **Máximo de Empréstimos:** Cada usuário só pode ter no máximo 3 livros emprestados simultaneamente.
3. **Prazo e Multa:** O prazo padrão de devolução é de 7 dias. Se devolvido com atraso, calcula-se uma multa de R$ 2,00 por dia.

## Casos de Uso / Histórias

### UC01 - Empréstimo com Sucesso
- **Dado** que o livro selecionado está disponível
- **E** o usuário possui menos de 3 empréstimos ativos
- **Quando** a requisição de empréstimo for enviada
- **Então** o status do livro muda para indisponível
- **E** um registro de empréstimo (`Loan`) é criado com a data atual.

### UC02 - Bloqueio por Limite de Livros
- **Dado** que o usuário já possui 3 empréstimos ativos
- **Quando** ele tentar realizar um novo empréstimo
- **Então** o sistema deve retornar um erro de validação
- **E** o empréstimo não deve ser registrado.

### UC03 - Devolução com Multa
- **Dado** que um empréstimo está ativo há 10 dias (3 dias de atraso)
- **Quando** a requisição de devolução for enviada
- **Então** o status do livro volta para disponível
- **E** o sistema aplica uma multa de R$ 6,00 ao usuário
- **E** o empréstimo é marcado como concluído.
