---
name: ship-check
description: Valida banco, Prisma, API, web e smoke tests HTTP do Inkflow; corrige apenas problemas pequenos e seguros e entrega um relatório final objetivo.
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - mcp__ide__getDiagnostics
---

# ship-check

## Objetivo
Executar uma checagem operacional completa do projeto Inkflow antes de considerar a base pronta para seguir. O foco é descobrir o que está quebrado, corrigir apenas bloqueios pequenos e seguros e encerrar com um relatório objetivo.

## Contexto fixo do projeto
- Monorepo com `pnpm`
- `apps/api` = NestJS + Prisma
- `apps/web` = Vite + React
- PostgreSQL via Docker
- Postgres do Inkflow = `5433`
- Existe outro projeto/container em `5432`
- **Nunca trocar o Inkflow de `5433` para `5432`**
- API local = `3001`
- Web local = `5173`
- `.env` principal do backend = `apps/api/.env`
- `DATABASE_URL` esperada:
  `postgresql://inkflow:inkflow@localhost:5433/inkflow?schema=public`
- Credenciais dev:
  - `owner@inkflow.local`
  - `ChangeMe123!`

## Regras de execução
- Fazer a menor correção segura possível
- Não mexer no outro container/projeto que usa `5432`
- Evitar refatoração grande
- Não alterar arquitetura sem necessidade
- Se houver problema maior, registrar causa e parar antes de expandir escopo
- Ao final, validar build e smoke test compatíveis com o que foi alterado

## Fluxo padrão
1. Confirmar diretório e estrutura do monorepo
2. Validar banco e Docker
3. Validar Prisma e ambiente da API
4. Validar build da API
5. Validar API em dev
6. Validar build do web
7. Validar web em dev
8. Executar smoke tests HTTP
9. Corrigir apenas bloqueios pequenos e seguros
10. Revalidar o que foi alterado

## Checklist operacional
### 1. Banco e Docker
- Verificar `infra/docker/docker-compose.yml`
- Confirmar container do Inkflow em `5433`
- Confirmar que o projeto em `5432` não foi tocado
- Validar conexão com a `DATABASE_URL` esperada

### 2. Prisma
- Verificar `apps/api/.env`
- Validar `apps/api/prisma/schema.prisma`
- Rodar, quando necessário:
  - `pnpm --filter api prisma:generate`
  - `pnpm --filter api prisma:deploy` ou `pnpm --filter api prisma:migrate --name <nome>` quando for apropriado ao ambiente local
  - `pnpm --filter api prisma:seed`
- Não inventar migration desnecessária se o schema já estiver compatível

### 3. API
- Validar `pnpm --filter api build`
- Subir `pnpm --filter api dev`
- Verificar logs de boot
- Confirmar que `http://localhost:3001/v1/auth/me` responde
- Se quebrar, investigar:
  - `package.json`
  - `tsconfig*.json`
  - `nest-cli.json`
  - imports
  - `dist`
  - Prisma
  - `.env`
  - runtime

### 4. Web
- Validar `pnpm --filter web build`
- Subir `pnpm --filter web dev`
- Confirmar que `http://localhost:5173` responde
- Verificar proxy `/v1` em `apps/web/vite.config.js`
- Procurar erros evidentes de runtime ou configuração

### 5. Smoke tests HTTP mínimos
Executar no mínimo:
- `GET /v1/auth/me` sem sessão → `401`
- `POST /v1/auth/login` com credenciais de dev → `200`
- `GET /v1/auth/me` com cookie → `200`
- `POST /v1/auth/logout` → sessão invalidada
- Confirmar o mesmo fluxo via web/proxy quando relevante

## Escopo de correção permitido
Pode corrigir sozinho apenas:
- imports quebrados
- rota mal ligada
- script incorreto
- `.env` local inconsistente
- detalhe pequeno de Prisma/migrate/seed
- configuração pequena de proxy, porta ou boot
- bloqueio pequeno de autenticação que impeça o smoke test

## Escopo proibido
- refatoração grande
- mudança ampla de arquitetura
- migração de porta `5433` para `5432`
- alterações no outro projeto/container
- reescrita de módulos inteiros

## Formato obrigatório da resposta final
Responder com estas seções:

### Resumo do que estava quebrado
- lista curta dos problemas encontrados

### Arquivos alterados
- caminhos completos ou relativos claros

### Diff resumido
- o que mudou em cada arquivo, em 1 linha por arquivo

### Comandos executados
- lista objetiva dos comandos relevantes

### Resultado de cada validação
- banco
- Prisma
- build API
- dev API
- build web
- dev web
- smoke tests HTTP

### Status final
- uma linha objetiva, por exemplo:
  - `ship-check ok`
  - `ship-check bloqueado por <causa exata>`
