# Design Técnico: Interface Web e Deploy

## Fluxo da Arquitetura

```
Browser (Vercel / Netlify)
        ↓ fetch()
API Express (Railway / Render)
        ↓ Prisma ORM
PostgreSQL (Railway / Render)
```

## Stack

- **Frontend:** HTML5, CSS3 e JavaScript ES6+ puro — sem frameworks, sem bundler, sem etapa de build. Os arquivos são servidos diretamente pelo Vercel como estáticos.
- **Backend:** API Express existente, sem alterações nos UseCases ou repositórios.
- **Nova dependência na API:** pacote `cors` para liberar requisições cross-origin do domínio do Vercel.
- **Hospedagem da API:** Railway (suporte nativo a Node.js + PostgreSQL, deploy via GitHub).
- **Hospedagem do Frontend:** Vercel (serving de estáticos, deploy automático no push).

## Estrutura de Arquivos Novos

```
frontend/                    ← pasta raiz do frontend (publicada no Vercel)
├── index.html               ← redireciona para loans.html (tela inicial)
├── config.js                ← exporta a BASE_URL da API (única variável a trocar por ambiente)
├── pages/
│   ├── users.html           ← cadastro + listagem de usuários
│   ├── books.html           ← cadastro + listagem de livros
│   ├── loans.html           ← realizar empréstimo + registrar devolução
│   └── reports.html         ← relatório de inadimplentes + livros populares
├── css/
│   └── style.css            ← estilo global (paleta neutra, layout sidebar + conteúdo)
└── js/
    ├── api.js               ← wrapper de fetch centralizado (trata erros e injeta BASE_URL)
    ├── users.js             ← lógica da tela de usuários
    ├── books.js             ← lógica da tela de livros
    ├── loans.js             ← lógica da tela de empréstimos
    └── reports.js           ← lógica da tela de relatórios

railway.json                 ← configuração de build/start para o Railway (na raiz do repo)
vercel.json                  ← aponta o root do Vercel para a pasta frontend/
```

## Mudança na API: Configuração de CORS

Único ponto de alteração no backend. No arquivo de entrada do servidor (`server.ts`):

```typescript
import cors from 'cors';

const allowedOrigins = [
  process.env.FRONTEND_URL ?? '',   // ex: https://biblioteca.vercel.app
  'http://localhost:5500',           // Live Server durante desenvolvimento
  'http://127.0.0.1:5500',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
}));
```

A variável `FRONTEND_URL` é configurada no painel do Railway como variável de ambiente.

## Arquivos de Configuração de Deploy

**`railway.json`** (raiz do repositório):
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "npx prisma migrate deploy && node dist/server.js",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

**`vercel.json`** (raiz do repositório):
```json
{
  "root": "frontend",
  "outputDirectory": "frontend"
}
```

## Layout das Telas

Todas as páginas compartilham o mesmo layout via CSS:

- **Sidebar fixa à esquerda:** links de navegação para Usuários, Livros, Empréstimos e Relatórios.
- **Área principal à direita:** dividida em dois blocos — formulário de ação (topo) e tabela de listagem (abaixo).
- **Barra de notificação:** faixa no topo da área principal que aparece com a mensagem de sucesso (verde) ou erro (vermelho) após cada operação e some após 4 segundos.

## `config.js` — Ponto Central de Configuração

```javascript
// frontend/config.js
// Altere apenas esta linha ao trocar de ambiente
const API_BASE_URL = 'https://sua-api.up.railway.app/api';
```

O `api.js` importa essa constante e todos os outros módulos JS usam apenas funções do `api.js`, nunca a URL diretamente.

## Endpoints Consumidos pelo Frontend

| Tela         | Método | Endpoint                        |
|--------------|--------|---------------------------------|
| Usuários     | GET    | `/api/users`                    |
| Usuários     | POST   | `/api/users`                    |
| Livros       | GET    | `/api/books`                    |
| Livros       | POST   | `/api/books`                    |
| Empréstimos  | GET    | `/api/loans`                    |
| Empréstimos  | POST   | `/api/loans`                    |
| Empréstimos  | PUT    | `/api/loans/:id/return`         |
| Relatórios   | GET    | `/api/reports/overdue`          |
| Relatórios   | GET    | `/api/reports/popular-books`    |

> **Nota:** Os endpoints `GET /api/users`, `GET /api/books` e `GET /api/loans` precisam ser adicionados à API caso ainda não existam (retornam array de todos os registros). Não alteram nenhum UseCase existente — são apenas queries de leitura nos respectivos repositórios.
