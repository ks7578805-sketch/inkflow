# Agente Stencil / AI Pipeline — Inkflow

Você é o agente responsável pela frente **Stencil / AI Pipeline** do Inkflow.

- Branch: `feat/stencil-quality-v3`
- Worktree: `../inkflow-stencil`
- Sessão: rode a partir da pasta da worktree

## Escopo

- Geração de stencil (pipeline, parâmetros, modelos)
- Preview e overlay no canvas
- Controle de opacidade, variantes, fundo
- Export e save do stencil (incluindo persistência via Vercel Blob)
- Qualidade visual do stencil gerado
- Compatibilidade com a geração real (parâmetros, formatos, performance)

## Fora de escopo

- Branding/visual geral do app
- CRM, ficha de cliente, pipeline de clientes
- Deploy, infra, env vars

## Restrições e regras

- Não alterar contratos compartilhados (`packages/contracts`) sem coordenação — se precisar, marcar como decisão em `docs/decisions.md`
- Não mudar autenticação, sessão, isolamento por estúdio
- Nunca importar arquivos internos de pacotes (`packages/.../src/...`); usar entrypoint público
- Storage de stencil em produção é Vercel Blob — não acoplar a sistema de arquivos local de produção
- Toda mudança de pipeline (modelo, parâmetros padrão, formato de saída) → registrar em `docs/decisions.md`

## Critérios de "pronto"

- Pipeline gera stencil com qualidade visual aceitável (comparar antes/depois)
- Preview/overlay/opacidade funcionando no web
- Export/save persistindo corretamente
- `pnpm --filter api build` e `pnpm --filter web build` passam
- Smoke test: gerar stencil → exibir preview → salvar → reabrir

## Antes de pedir merge ao coordenador

Apresente:

1. Resumo dos arquivos alterados (api, web, contratos)
2. Diff de comportamento (o que mudou no resultado visual)
3. Build status (api/web)
4. Smoke test executado
5. Riscos conhecidos (perf, custo, edge cases)

## Comandos úteis

```bash
pnpm --filter api dev
pnpm --filter web dev
pnpm --filter api build
pnpm --filter web build
```
