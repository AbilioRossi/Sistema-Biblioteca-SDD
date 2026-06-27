
# Requisitos do Módulo: Relatórios Gerenciais

## Regras de Negócio Fundamentais
1. **Visão Geral:** O sistema deve fornecer dados analíticos sobre a saúde da biblioteca.
2. **Relatório de Inadimplência:** O bibliotecário precisa de uma lista contendo todos os alunos que estão com livros atrasados no momento atual.
3. **Relatório de Livros Populares:** O sistema deve mostrar quais livros foram mais emprestados no histórico geral.

## Casos de Uso / Histórias

### UC01 - Geração do Relatório de Atrasos
- **Dado** que o administrador acesse a área de relatórios
- **Quando** ele solicitar o relatório de inadimplência
- **Então** o sistema deve retornar uma lista contendo o nome do aluno, nome do livro e os dias de atraso.

### UC02 - Geração do Ranking de Livros
- **Dado** que existam históricos de empréstimos registrados
- **Quando** o administrador solicitar os livros mais populares
- **Então** o sistema deve listar os livros ordenados pela quantidade total de vezes que foram emprestados (do maior para o menor).