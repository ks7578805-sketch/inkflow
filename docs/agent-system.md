# Sistema de Agentes — Inkflow

## Visão geral

O desenvolvimento do Inkflow é coordenado por 1 sessão coordenadora + 4 agentes de execução. Cada agente roda em sua própria sessão, branch e worktree, isolado dos demais para evitar conflito de merge e mistura de escopo.

```
inkflow (main)              → Coordenador
inkflow-deploy              → Agente 1 — Deploy / Infra
inkflow-stencil             → Agente 2 — Stencil / AI Pipeline
inkflow-ui                  → Agente 3 — Product UI / Design System
inkflow-crm                 → Agente 4 — CRM / Clientes
```

## Papéis

### Coordenador (sessão na pasta principal `inkflow/`)
- Organiza o trabalho das frentes
- Revisa entregas dos agentes
- Verifica se o resultado bate com o que foi pedido
- Evita conflito entre frentes
- Cobra atualização de `CLAUDE.md` e docs quando há mudança estrutural
- Decide quando integrar branches
- **Não implementa features de produto**

### Agente 1 — Deploy / Infra / Produção
- Branch: `feat/deploy-production`
- Worktree: `../inkflow-deploy`
- Foco: GitHub, Vercel, env vars, banco, storage persistente, CI/CD, `vercel.json`, Vercel Blob, Prisma em produção
- Fora de escopo: UI, stencil visual, CRM

### Agente 2 — Stencil / AI Pipeline
- Branch: `feat/stencil-quality-v3`
- Worktree: `../inkflow-stencil`
- Foco: geração de stencil, preview, overlay, opacidade, variantes, fundo, export/save, qualidade visual, compatibilidade com geração real
- Fora de escopo: branding geral do app, CRM, deploy

### Agente 3 — Product UI / Design System
- Branch: `feat/product-ui-system`
- Worktree: `../inkflow-ui`
- Foco: visual do app inteiro (não só login), design system primeiro (tipografia, cores, superfícies, espaçamentos, botões, inputs, cards, modais, tabelas, badges, sidebar, header), depois aplicar nas telas
- Fora de escopo: deploy, infra, redesenhar CRM sem coordenação, pipeline de stencil

### Agente 4 — CRM / Clientes
- Branch: `feat/crm-redesign`
- Worktree: `../inkflow-crm`
- Foco: estrutura de clientes, pipeline, ficha do cliente, fluxo operacional, timeline, status, follow-up, organização funcional do CRM
- Fora de escopo: deploy, infra, pipeline de stencil

## Regras do sistema

1. **1 agente = 1 frente = 1 branch/worktree = 1 sessão**
2. Nenhuma frente termina sem:
   - código funcionando
   - build relevante passando
   - resumo do que mudou
   - docs atualizadas se houve mudança estrutural
3. Mudanças de arquitetura, naming, fluxo, UI system ou operação devem refletir em `CLAUDE.md` ou `docs/decisions.md`
4. Nenhum agente faz `push` sem mostrar resumo curto antes
5. O coordenador decide quando integrar branches

## Fluxo de integração

1. Agente termina sua frente na branch dele
2. Agente apresenta resumo curto ao coordenador (lista de arquivos, build status, smoke test)
3. Coordenador valida e decide:
   - merge direto em `main`
   - PR para revisão
   - rebase/ajustes antes de integrar
4. Após merge, as outras worktrees fazem `git fetch && git rebase origin/main` para ficar em dia

## Mapa de worktrees

| Frente   | Branch                    | Worktree path        |
|----------|---------------------------|----------------------|
| Deploy   | `feat/deploy-production`  | `../inkflow-deploy`  |
| Stencil  | `feat/stencil-quality-v3` | `../inkflow-stencil` |
| UI       | `feat/product-ui-system`  | `../inkflow-ui`      |
| CRM      | `feat/crm-redesign`       | `../inkflow-crm`     |

## Documentação relacionada

- `docs/current-sprint.md` — status atual por frente
- `docs/decisions.md` — decisões estruturais importantes
- `docs/agents/coordinator.md` — instruções do coordenador
- `docs/agents/deploy.md` — prompt operacional do agente Deploy
- `docs/agents/stencil.md` — prompt operacional do agente Stencil
- `docs/agents/product-ui.md` — prompt operacional do agente UI
- `docs/agents/crm.md` — prompt operacional do agente CRM
