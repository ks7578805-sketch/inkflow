---
name: login-check
description: Valida o fluxo real de autenticação do Inkflow, testa credenciais de dev, sessão, cookie e rota protegida, e corrige apenas bloqueios pequenos e seguros.
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - mcp__ide__getDiagnostics
---

# login-check

## Objetivo
Validar o fluxo real de autenticação do Inkflow de ponta a ponta, localizar a tela de login, testar as credenciais de desenvolvimento, verificar sessão/cookie/rota protegida e corrigir apenas bloqueios pequenos e seguros.

## Contexto fixo
- Monorepo com `pnpm`
- `apps/api` = NestJS + Prisma
- `apps/web` = Vite + React
- API local = `3001`
- Web local = `5173`
- Postgres do Inkflow = `5433`
- Existe outro projeto/container em `5432`
- **Nunca trocar o Inkflow de `5433` para `5432`**
- `.env` principal do backend = `apps/api/.env`
- Credenciais de dev:
  - `owner@inkflow.local`
  - `ChangeMe123!`

## Fluxo esperado
- Tela/rota pública de login no frontend
- `POST /v1/auth/login`
- cookie/sessão persistida
- `GET /v1/auth/me`
- acesso liberado a rota protegida quando autenticado
- `POST /v1/auth/logout`
- bloqueio da rota protegida após logout

## Passos obrigatórios
1. Confirmar que banco, API e web estão ativos ou subir o necessário
2. Identificar no código como o login funciona
3. Localizar a tela/rota de login
4. Testar o login real com as credenciais de dev
5. Verificar cookies, sessão ou token conforme o projeto usar
6. Validar comportamento de:
   - usuário deslogado
   - usuário logado
   - rota protegida
7. Se falhar, localizar a causa real:
   - frontend
   - backend
   - seed
   - request
   - cookie
   - CORS
   - proxy
   - session handling
8. Corrigir apenas bloqueios pequenos e seguros
9. Revalidar o fluxo completo

## Pontos do código para checar primeiro
- `apps/web/src/App.jsx`
- `apps/web/src/pages/Login.jsx`
- `apps/web/src/lib/AuthContext.jsx`
- `apps/web/src/components/ProtectedRoute.jsx`
- `apps/web/vite.config.js`
- `apps/api/src/modules/auth/auth.controller.ts`
- `apps/api/src/modules/auth/auth.service.ts`
- `apps/api/.env`
- `apps/api/prisma/seed.ts`

## Testes mínimos
### API direta
- `GET http://localhost:3001/v1/auth/me` sem sessão → `401`
- `POST http://localhost:3001/v1/auth/login` com credenciais dev → `200`
- `GET http://localhost:3001/v1/auth/me` com cookie → `200`
- `POST http://localhost:3001/v1/auth/logout` → `204` ou equivalente

### Via web/proxy
- `GET http://localhost:5173/v1/auth/me`
- `POST http://localhost:5173/v1/auth/login`
- confirmar que o proxy do web entrega o fluxo correto

## Escopo de correção permitido
- ajuste pequeno de rota pública/protegida
- correção pequena de proxy ou URL base
- detalhe pequeno de cookie/sessão/CORS
- seed local inconsistente
- erro pequeno em request/auth bootstrap

## Escopo proibido
- refatoração grande de auth
- troca de arquitetura de autenticação
- mudança ampla de estado global
- qualquer ação sobre o projeto/container em `5432`

## Formato obrigatório da resposta final

### Status do login
- `funcionando` ou `bloqueado`, com motivo exato

### Credenciais usadas
- registrar as credenciais que funcionaram

### Rota/tela encontrada
- arquivo + rota

### Endpoints envolvidos
- listar os endpoints reais usados no fluxo

### Arquivos alterados
- lista objetiva

### Diff resumido
- 1 linha por arquivo alterado

### Status final
- uma linha objetiva, por exemplo:
  - `login ok`
  - `login bloqueado por <causa exata>`
