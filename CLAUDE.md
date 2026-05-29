# Inkflow Claude Code Kit

## Contexto do projeto
- Repositório: `inkflow`
- Tipo: monorepo com `pnpm` e `turbo`
- Objetivo atual da base: fundação local com autenticação própria, banco local via Docker e frontend já conectado ao fluxo básico de login
- Documentação base existente: `README.md` e `docs/foundation.md`

## Stack
- `apps/api` = NestJS + Prisma
- `apps/web` = Vite + React
- `packages/contracts` = contratos compartilhados
- Banco local = PostgreSQL via Docker

## Portas e serviços
- PostgreSQL do Inkflow: `5433`
- API local: `3001`
- Web local: `5173`
- Existe outro projeto/container usando `5432`
- Regra fixa: **nunca mudar o Inkflow de `5433` para `5432`**
- Regra fixa: **não mexer no outro container/projeto que usa `5432`**

## Banco e ambiente
- Arquivo principal de ambiente do backend: `apps/api/.env`
- `DATABASE_URL` esperada:

```env
postgresql://inkflow:inkflow@localhost:5433/inkflow?schema=public
```

- Arquivo de exemplo: `apps/api/.env.example`
- Docker Compose local: `infra/docker/docker-compose.yml`
- Prisma schema: `apps/api/prisma/schema.prisma`
- Seed: `apps/api/prisma/seed.ts`

## Credenciais de desenvolvimento
- Email: `owner@inkflow.local`
- Senha: `ChangeMe123!`

Usar apenas para ambiente local de desenvolvimento.

## Fluxo padrão de subida local
1. Subir o PostgreSQL do Inkflow:

```bash
pnpm db:up
```

2. Garantir ambiente do backend:

```bash
cp apps/api/.env.example apps/api/.env
```

3. Gerar Prisma client e aplicar migrations:

```bash
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate --name init_foundation
```

4. Aplicar seed local:

```bash
pnpm --filter api prisma:seed
```

5. Subir API e web em dev:

```bash
pnpm dev:api
pnpm dev:web
```

## Comandos úteis
### Monorepo
```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
```

### Banco
```bash
pnpm db:up
pnpm db:down
pnpm db:logs
```

### API
```bash
pnpm --filter api dev
pnpm --filter api build
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate --name <nome>
pnpm --filter api prisma:deploy
pnpm --filter api prisma:seed
```

### Web
```bash
pnpm --filter web dev
pnpm --filter web build
```

## Smoke tests esperados
### Infra
- `docker ps` deve mostrar o Postgres do Inkflow publicado em `5433`
- `lsof -nP -iTCP:5433 -sTCP:LISTEN` deve confirmar a porta certa
- O container/projeto em `5432` não deve ser alterado

### API
- `curl -i http://localhost:3001/v1/auth/me` deve retornar `401` sem sessão
- `POST /v1/auth/login` com as credenciais de dev deve retornar `200`
- `GET /v1/auth/me` com cookie deve retornar `200`
- `POST /v1/auth/logout` deve invalidar a sessão

### Web
- `http://localhost:5173` deve responder
- `http://localhost:5173/login` deve abrir a tela de login
- O proxy de `/v1` do Vite deve apontar para `http://localhost:3001`
- Build do web deve passar após mudanças locais

## Convenções de trabalho
- Fazer a **menor correção segura possível**
- Não fazer refatoração grande sem necessidade clara
- Não alterar arquitetura sem motivo forte
- Não tocar no outro container/projeto que usa `5432`
- Validar no final o que foi alterado com build e smoke test compatível com o escopo
- Quando houver bug, localizar a causa real antes de editar
- Preferir correções localizadas a mudanças amplas

## Regras operacionais

### REGRAS CRÍTICAS DE PRODUÇÃO — NUNCA ALTERAR:
- `apps/api/package.json`: `@vercel/blob` deve permanecer `"^2.4.0"`
- `apps/api/src/modules/stencil/stencil.storage.ts`: `access` deve permanecer `'private'`
- `apps/api/vercel.json`: `installCommand` deve ser `"rm -rf node_modules/@vercel && pnpm install"`
- Qualquer alteração nesses 3 pontos quebra o upload de stencil em produção.

- Não trocar `DATABASE_URL` do Inkflow para `5432`
- Não assumir que erros de login são sempre frontend; verificar também cookie, CORS, sessão, seed, Prisma e `.env`
- Em mudanças de autenticação, validar sempre:
  - usuário deslogado
  - login bem-sucedido
  - rota protegida
  - logout
- Em mudanças de backend, validar:
  - `pnpm --filter api build`
  - `pnpm --filter api dev`
  - teste HTTP real
- Em mudanças de frontend, validar:
  - `pnpm --filter web build`
  - navegação básica
  - rota/tela afetada

## Arquitetura multiusuário / multiestúdio
- O modelo base já aponta para arquitetura multiusuário/multiestúdio
- `Studio` é entidade central de escopo
- `User`, `Artist` e `AuthSession` devem respeitar isolamento por estúdio
- Evitar decisões que acoplem regras ao usuário owner local ou a um único estúdio fixo
- Seeds locais podem usar um owner padrão, mas o código de domínio não deve depender disso

## Nota sobre acoplamento entre apps e packages
- Evitar acoplamentos problemáticos entre `apps/api` e `packages/.../src`
- Não importar arquivos internos profundos de `packages/.../src` quando houver ponto de entrada público
- Preferir contratos/exportações públicas estáveis
- Se surgir necessidade de compartilhamento, publicar via entrypoint claro do pacote em vez de acoplar o app a caminhos internos frágeis
- O objetivo é manter fronteiras previsíveis entre app e pacote compartilhado

## Arquivos-chave para diagnósticos futuros
- `package.json`
- `pnpm-workspace.yaml`
- `turbo.json`
- `apps/api/package.json`
- `apps/web/package.json`
- `apps/api/.env`
- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/seed.ts`
- `apps/api/src/modules/auth/auth.controller.ts`
- `apps/api/src/modules/auth/auth.service.ts`
- `apps/web/src/App.jsx`
- `apps/web/src/lib/AuthContext.jsx`
- `apps/web/src/pages/Login.jsx`
- `apps/web/vite.config.js`
