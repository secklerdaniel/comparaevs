# ComparaEVs — como continuar o site

Site: https://www.comparaevs.com.br · Código: HTML estático + funções em `api/` (Node) + banco Postgres no Neon. Hospedagem na Vercel.

## 1. Só mexer em páginas e textos (não precisa de chave nenhuma)

1. Clonar: `git clone https://github.com/secklerdaniel/comparaevs`
2. Criar uma branch: `git checkout -b minha-mudanca`
3. Editar os `.html` (`index.html`, `sobre.html`, `veiculo.html`...) e dar push da branch.
4. A Vercel publica um endereço de **preview** para conferir sem afetar o site.
5. Estando bom, abrir um Pull Request para a `main`. **Juntar na `main` publica em produção** (`comparaevs.com.br`).

As chaves de produção ficam guardadas na Vercel; o deploy já as usa sozinho.

## 2. Rodar no computador com a API (só se for mexer em `api/`)

Use um banco **de vocês**, nunca o de produção.

1. Criar um banco gratuito em https://neon.tech.
2. Criar um arquivo `.env.local` (não vai para o git) com:

```
NEON_DATABASE_URL=<url de conexão do Neon de vocês>
ADMIN_KEY=<uma senha qualquer inventada por vocês>
OPENAI_API_KEY=<só se for testar a busca com IA>
```

3. Criar as tabelas: `node --env-file=.env.local scripts/build-neon-schema.mjs`
4. Instalar e rodar: `npm install` e depois `node --env-file=.env.local scripts/dev-server.mjs`

O banco novo nasce vazio. Os dados dos veículos vêm do PBEV/INMETRO (planilha `_pbev_novos.csv` e os SQL `_pbev_*.sql` mostram o formato de carga).

## 3. Variáveis de ambiente

| Variável | Para quê |
|---|---|
| `NEON_DATABASE_URL` | Conexão com o banco (veículos, patrocinadores, leads, cliques). |
| `ADMIN_KEY` | Senha do painel `admin-7x9k.html`. A API de escrita exige o header `x-admin-key`. |
| `OPENAI_API_KEY` | Busca com IA (`api/_busca-ia.js`). Sem ela, o resto do site funciona. |

Em produção elas ficam em Vercel > Settings > Environment Variables.

## 4. Passagem de acesso (quem está assumindo)

- [ ] Ter acesso de colaborador ao repositório no GitHub.
- [ ] Ser convidado no time da Vercel (deploys e variáveis).
- [ ] Ser convidado no projeto Neon (dados de produção).
- [ ] **Trocar a `ADMIN_KEY` e a `OPENAI_API_KEY` de produção por chaves novas**, na Vercel, e fazer um redeploy. As antigas pertencem a quem saiu e devem deixar de valer.
- [ ] Conferir o domínio `comparaevs.com.br` (DNS e titularidade).

## 5. Cuidados

- Nunca commitar `.env.local` (já está no `.gitignore`).
- Rótulo editorial: o dado técnico (autonomia, consumo, classificação) vem do PBEV e **não muda por causa de patrocínio**. Patrocinado é sempre rotulado. Ver `sobre.html`.
- Este banco guarda só veículos **elétricos**. Combustão ou híbrido na mesma tabela exige ajustar a API e os filtros (autonomia nula aparece como "0 km").
- Mais contexto do produto em `INSTRUCOES-AGENTE-IA.md` (assistente de IA) e `mapa.html` (pipeline interno de monetização).
