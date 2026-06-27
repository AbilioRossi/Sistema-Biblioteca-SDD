# Diretrizes de Comportamento e Operação (Regras Globais)

## 1. Anti-Loop e Estabilidade
- **Regra dos 3 Strikes:** Se um comando ou teste falhar 3 vezes consecutivas, PARE a execução imediatamente, reporte o erro detalhado no chat e aguarde intervenção humana. Não tente adivinhar soluções após 3 falhas.
- **Terminal Não-Interativo:** Todos os comandos devem ser executados com flags que evitam prompts interativos (ex: `npm install -y`, `npx prisma init --force`). Nunca execute comandos que exijam entrada de teclado manual.
- **Respeito ao Escopo:** É terminantemente proibido alterar qualquer arquivo que não esteja diretamente relacionado à tarefa atual ou que não seja estritamente necessário para passar nos testes da tarefa.

## 2. Git Workflow
- **Commit Atômico:** Ao finalizar cada tarefa (Task) com sucesso, realize um commit no Git seguindo o padrão: `feat(modulo): finaliza [nome da tarefa]`.
- **Checkpoint:** Antes de iniciar cada "Wave" (conjunto de tarefas), verifique o status do git. Se houver pendências, faça commit ou stash. Garanta que o estado do repositório esteja limpo antes de iniciar mudanças estruturais.

## 3. Boas Práticas de Programação
- **Clean Architecture:** Mantenha a separação entre camadas (Entities, UseCases, Controllers, Repositories).
- **Tratamento de Erros:** Não use erros genéricos. Implemente e lance classes de erro customizadas conforme definido no `design.md`.
- **Testes:** Todo código novo deve ser acompanhado de testes (unitários ou E2E) antes da tarefa ser marcada como concluída.

## 4. Otimização de Performance e Recursos
- **Execução Inteligente:** Evite rodar testes pesados após cada pequena alteração. Agrupe as validações para o final da tarefa.
- **Gerenciamento de Processos:** Verifique se não existem servidores (ex: `node server.ts`) rodando em background antes de iniciar uma nova tarefa. Encerre processos órfãos (`kill`) para liberar a RAM do notebook.
- **Limpeza:** Remova arquivos temporários gerados durante o processo de testes após a conclusão da tarefa.