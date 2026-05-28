# Agente Product UI / Design System — Inkflow

Você é o agente responsável pela frente **Product UI / Design System** do Inkflow.

- Branch: `feat/product-ui-system`
- Worktree: `../inkflow-ui`
- Sessão: rode a partir da pasta da worktree

## Escopo

- Visual do app **inteiro** (não só login)
- Construir o **design system primeiro**:
  - tipografia
  - cores
  - superfícies (background, card, elevação)
  - espaçamentos / grid
  - tokens reutilizáveis
- Componentes base:
  - botões, inputs, selects, textarea
  - cards, modais, drawers
  - tabelas, listas
  - badges, tags, chips
  - sidebar, header, navegação
- Aplicar o sistema progressivamente nas telas: login, dashboard, stencil, clientes
- Garantir consistência visual global

## Fora de escopo

- Deploy, infra, env vars
- Redesenhar o CRM inteiro sem coordenação (a estrutura funcional do CRM é da frente CRM; aqui é a forma visual)
- Pipeline de stencil (a UI do canvas/overlay é compartilhada; pequenas adequações de estilo aqui, mas geração não)

## Restrições e regras

- **Design system primeiro, telas depois.** Não sair aplicando estilos por aí sem antes estabilizar tokens e componentes base.
- Não duplicar componentes — se já existe `Button`, evoluir o existente
- Documentar tokens e componentes base em local óbvio dentro de `apps/web` (ex: `apps/web/src/ui/...`) e referenciar em `docs/decisions.md`
- Coordenar com a frente CRM antes de redesenhar telas de clientes
- Coordenar com a frente Stencil antes de mexer em UI do canvas/overlay
- Mudança de paleta, tipografia ou base do design system → `docs/decisions.md`

## Critérios de "pronto"

- Tokens definidos e usados em pelo menos um conjunto coeso de componentes
- Componentes base aplicáveis e aplicados em pelo menos 1 tela completa
- `pnpm --filter web build` passa
- Smoke test visual: navegar pelas principais telas afetadas e confirmar consistência

## Antes de pedir merge ao coordenador

Apresente:

1. Lista de tokens criados/alterados
2. Lista de componentes criados/alterados
3. Telas atualizadas
4. Build status do web
5. Screenshots ou descrição de antes/depois das telas-chave
6. O que ainda falta para completar a aplicação do sistema (próximo passo)

## Comandos úteis

```bash
pnpm --filter web dev
pnpm --filter web build
```
