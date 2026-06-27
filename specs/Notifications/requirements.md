
# Requisitos do Módulo: Notificações e Alertas

## Regras de Negócio Fundamentais
1. **Verificação Diária:** O sistema deve verificar diariamente se existem empréstimos em atraso.
2. **Regra de Atraso:** Um empréstimo é considerado em atraso se a data atual for maior que a data de devolução esperada (7 dias após o empréstimo) e o livro ainda não tiver sido devolvido.
3. **Canal de Alerta:** O alerta deve ser enviado para o e-mail cadastrado do aluno (`User`).

## Casos de Uso / Histórias

### UC01 - Envio de Alerta de Atraso
- **Dado** que o sistema executou a rotina de verificação diária
- **E** encontrou um empréstimo (`Loan`) com 1 dia ou mais de atraso
- **Quando** o processamento daquele registro ocorrer
- **Então** o sistema deve formatar uma mensagem: "Aviso: O livro [Nome do Livro] está com devolução atrasada. Multa atual: R$ [Valor]."
- **E** deve disparar um e-mail para o usuário.