# Decisões estruturais — Inkflow

> Registre aqui decisões que afetam arquitetura, naming, fluxo, UI system ou operação. Decisões pequenas e localizadas não precisam estar aqui.

Formato sugerido por entrada:

```
## YYYY-MM-DD — Título curto da decisão
- Contexto: por que estamos decidindo isso agora
- Decisão: o que foi decidido
- Alternativas consideradas: o que foi descartado e por quê
- Impacto: arquivos, fluxos ou frentes afetadas
- Status: ativa | revisada | revertida
```

---

## 2026-05-27 — Sistema de 4 agentes paralelos com worktrees
- Contexto: o projeto cresceu o suficiente para que diferentes frentes (deploy, stencil, UI, CRM) avancem em paralelo sem se atrapalharem.
- Decisão: adotar 1 coordenador + 4 agentes de execução, cada um em sua branch e worktree separadas. Coordenador organiza, revisa e integra; agentes implementam dentro do escopo.
- Alternativas consideradas:
  - Trabalhar tudo em `main` com sessões sequenciais — descartado pelo risco de mistura de escopo e bloqueio entre frentes.
  - Múltiplas branches sem worktrees — descartado porque trocar de branch toda hora atrapalha o fluxo de cada agente.
- Impacto: docs/agent-system.md, docs/agents/*.md, criação de worktrees `../inkflow-deploy`, `../inkflow-stencil`, `../inkflow-ui`, `../inkflow-crm`.
- Status: ativa

## 2026-05-27 — PostgreSQL local fixo na porta 5433
- Contexto: já existe outro projeto/container usando a porta 5432 na máquina de desenvolvimento.
- Decisão: o Postgres do Inkflow roda em `5433` (host) e nunca é migrado para `5432`.
- Alternativas consideradas: derrubar o container do outro projeto — descartado para não impactar outro trabalho.
- Impacto: `infra/docker/docker-compose.yml`, `apps/api/.env`, `apps/api/.env.example`, smoke tests locais.
- Status: ativa
