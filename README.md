# InkFlow Monorepo

## Estrutura

- `apps/web` — frontend React + Vite
- `apps/api` — backend NestJS + Prisma
- `packages/contracts` — contratos compartilhados
- `infra/docker` — infraestrutura local
- `docs` — documentação

## Requisitos

- Node.js 20+
- pnpm 10+
- Docker

## Rodando localmente

### 1. Subir o PostgreSQL

```bash
pnpm db:up
```

### 2. Instalar dependências

```bash
pnpm install
```

### 3. Preparar o backend

```bash
cp apps/api/.env.example apps/api/.env
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate --name init_foundation
pnpm --filter api prisma:seed
```

### 4. Rodar backend e frontend

Em terminais separados:

```bash
pnpm dev:api
```

```bash
pnpm dev:web
```

## URLs locais

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

## Credenciais seed locais

- Email: `owner@inkflow.local`
- Senha: `ChangeMe123!`

## Endpoints disponíveis nesta fase

- `POST /v1/auth/login`
- `POST /v1/auth/logout`
- `GET /v1/auth/me`

## Observações

- A autenticação estrutural do Base44 foi removida do frontend.
- Registro e reset de senha permanecem como placeholders nesta fase.
- Os módulos de domínio ainda usam os mocks herdados até as próximas fases.
