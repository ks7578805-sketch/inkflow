---
name: api-fix
description: Diagnostica e corrige o backend do Inkflow até a API subir em dev sem erro, com foco em NestJS, TypeScript, Prisma, env, build e runtime.
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - mcp__ide__getDiagnostics
---

# api-fix

## Objetivo
Diagnosticar e corrigir o backend do Inkflow até a API conseguir subir em modo dev sem erro. O foco é identificar a causa real e aplicar a menor correção segura possível.

## Contexto fixo
- Monorepo com `pnpm`
- Backend em `apps/api`
- Stack do backend: NestJS + Prisma + TypeScript
- Porta esperada da API: `3001`
- `.env` principal: `apps/api/.env`
- `DATABASE_URL` esperada:
  `postgresql://inkflow:inkflow@localhost:5433/inkflow?schema=public`
- Banco do Inkflow: `5433`
- Existe outro projeto/container em `5432`
- **Nunca trocar o Inkflow de `5433` para `5432`**

## Regra central
Primeiro localizar a causa exata. Só depois editar. Evitar correções cosméticas ou mudanças amplas sem evidência.

## Áreas prioritárias de investigação
- `apps/api/package.json`
- `apps/api/tsconfig.json`
- `apps/api/tsconfig.build.json`
- `apps/api/nest-cli.json`
- `apps/api/.env`
- `apps/api/dist`
- imports quebrados
- compatibilidade CommonJS/ESM
- Prisma client/schema/migrations/seed
- erro real de runtime

## Fluxo de execução
1. Confirmar diretório e scripts da API
2. Ler `.env` e confirmar `DATABASE_URL` em `5433`
3. Validar banco local e Prisma
4. Rodar `pnpm --filter api build`
5. Subir `pnpm --filter api dev`
6. Capturar erro real de boot, build ou runtime
7. Corrigir apenas o mínimo necessário
8. Revalidar build
9. Revalidar `dev`
10. Fazer ao menos um teste HTTP real

## Hipóteses comuns a verificar
- script errado no `package.json`
- `tsconfig` incompatível com a estrutura atual
- `nest-cli.json` apontando para caminho incorreto
- import quebrado após reorganização de arquivos
- `dist` inconsistente com o source
- Prisma client desatualizado
- migration pendente
- `.env` divergente do projeto
- mismatch CommonJS/ESM
- falha de boot em módulo de auth/Prisma

## Correções permitidas
- corrigir scripts da API
- ajustar import/export quebrado
- ajustar config mínima de TypeScript/Nest
- regenerar Prisma client
- corrigir `DATABASE_URL` do ambiente local do Inkflow
- corrigir detalhe pequeno de runtime

## Correções proibidas
- trocar `5433` por `5432`
- tocar no outro container/projeto
- refatorar módulos grandes
- mudar arquitetura para contornar erro local
- apagar estrutura importante sem evidência

## Validação mínima obrigatória
- `pnpm --filter api build`
- `pnpm --filter api dev`
- `curl -i http://localhost:3001/v1/auth/me`
- se auth estiver operacional, testar login real com:
  - `owner@inkflow.local`
  - `ChangeMe123!`

## Formato obrigatório da resposta final

### Causa exata
- o erro raiz em uma frase clara

### Arquivos alterados
- lista objetiva

### Diff resumido
- 1 linha por arquivo alterado

### Validações
- build
- dev
- teste HTTP
- Prisma/env

### Resultado final
- uma linha objetiva, por exemplo:
  - `api ok em dev`
  - `api bloqueada por <causa exata>`
