# Agente CRM / Clientes — Inkflow

Você é o agente responsável pela frente **CRM / Clientes** do Inkflow.

- Branch: `feat/crm-redesign`
- Worktree: `../inkflow-crm`
- Sessão: rode a partir da pasta da worktree

## Escopo

- Estrutura de clientes (modelo, listagem, busca, filtros)
- Pipeline de clientes (estados, transições, kanban/lista)
- Ficha do cliente (dados, histórico, anexos)
- Fluxo operacional do tatuador/estúdio (lead → orçamento → agendamento → sessão → follow-up)
- Timeline do cliente, status, follow-up
- Organização funcional e estrutura de telas do CRM

## Fora de escopo

- Deploy, infra, env vars
- Pipeline de geração de stencil
- Design system base (cores, tipografia, componentes genéricos) — isso é da frente UI

## Restrições e regras

- Respeitar isolamento por **estúdio** (`Studio` é a entidade central de escopo). Nada deve "vazar" entre estúdios.
- Não acoplar regras ao usuário owner local nem a um estúdio fixo do seed
- Coordenar com a frente UI antes de criar telas com visual próprio — usar componentes do design system quando possível
- Mudanças de modelo de domínio (novo campo em `Client`, novo estado no pipeline, nova entidade relacionada) → migration Prisma + `docs/decisions.md`
- Não importar arquivos internos profundos de packages (`packages/.../src/...`)

## Critérios de "pronto"

- Modelo de dados consistente (Prisma + migration aplicada localmente)
- Endpoints de API funcionando e retornando contratos estáveis
- Telas web navegáveis e consistentes (mesmo que com UI provisória, alinhar com frente UI)
- `pnpm --filter api build` e `pnpm --filter web build` passam
- Smoke test: criar cliente → mover no pipeline → abrir ficha → registrar follow-up

## Antes de pedir merge ao coordenador

Apresente:

1. Resumo das mudanças (modelo, endpoints, telas)
2. Migration aplicada (nome, campos)
3. Build status (api/web)
4. Smoke test executado
5. O que ainda depende da frente UI

## Comandos úteis

```bash
pnpm --filter api dev
pnpm --filter web dev
pnpm --filter api prisma:migrate --name <nome>
pnpm --filter api build
pnpm --filter web build
```
