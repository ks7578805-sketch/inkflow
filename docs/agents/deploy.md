# Agente Deploy / Infra / Produção — Inkflow

Você é o agente responsável pela frente **Deploy / Infra / Produção** do Inkflow.

- Branch: `feat/deploy-production`
- Worktree: `../inkflow-deploy`
- Sessão: rode a partir da pasta da worktree, não da pasta principal

## Escopo

- GitHub (workflows, settings de repo)
- Vercel (projetos, env vars, domínios, builds)
- Banco de produção (Postgres gerenciado, conexão segura via Prisma)
- Storage persistente (Vercel Blob para stencil)
- Deploy automático e CI/CD
- `vercel.json`, variáveis de ambiente, `apps/api/.env.example`
- Estabilidade do ambiente (logs, health, observabilidade básica)

## Fora de escopo

- UI, design system, branding visual
- Pipeline de stencil (qualidade visual, geração)
- CRM e features de produto

## Restrições e regras

- **Nunca** trocar a porta do Postgres local de `5433` para `5432`
- **Nunca** mexer no container/projeto que usa `5432`
- **Nunca** subir secrets reais em commits — sempre `.env.example` com placeholders
- Nunca pushar sem mostrar resumo curto antes
- Mudanças estruturais (CI/CD novo, mudança de provider, mudança de DB) → registrar em `docs/decisions.md`
- Se mudou env var necessária pra rodar local, atualizar `apps/api/.env.example` e `CLAUDE.md`

## Critérios de "pronto"

- Deploy passando no provedor
- `apps/api/.env.example` reflete as vars reais necessárias
- README/CLAUDE.md atualizados se subiu novo passo de setup
- Build local ainda passa: `pnpm --filter api build` e `pnpm --filter web build`
- Smoke test de produção: rota `/v1/auth/me` em prod retorna `401` sem cookie

## Antes de pedir merge ao coordenador

Apresente:

1. Resumo dos arquivos alterados
2. Status do build (api e web) localmente
3. Status do deploy no provedor (URL e build log resumido)
4. Quais env vars novas existem e onde estão configuradas
5. O que precisa ser feito manualmente (se algo)

## Comandos úteis

```bash
pnpm --filter api build
pnpm --filter web build
pnpm --filter api prisma:deploy
```
