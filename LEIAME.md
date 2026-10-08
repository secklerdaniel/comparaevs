# ComparaEVs — guia de passagem (leia isto primeiro)

Este guia é para quem vai **assumir o site sozinho**, sem ajuda de quem montou. Cada passo diz o que fazer e como saber que deu certo. Faça na ordem.

## O que é o site

Comparador de carros elétricos do Brasil (https://www.comparaevs.com.br). Mostra autonomia, consumo e preço lado a lado, com dados oficiais do INMETRO. Ganha dinheiro com **patrocinadores** e **leads** (propostas de concessionárias e orçamentos de wallbox). Não vende carro.

## As peças (cada uma precisa de uma conta de vocês)

| Peça | Para que serve | Onde |
|---|---|---|
| **GitHub** | Guarda o código | github.com |
| **Vercel** | Coloca o site no ar | vercel.com |
| **Neon** | Banco de dados (carros, patrocinadores, leads) | neon.tech |
| **OpenAI** | Busca com inteligência artificial (opcional) | platform.openai.com |
| **Registro.br** | Dono do endereço comparaevs.com.br | registro.br |

Hoje tudo isso está na conta da **Seckler Digital**. O objetivo é **passar tudo para contas de vocês**.

---

## PASSO 1 — Criar as contas

Criem contas nas peças acima. Use um **e-mail da empresa**, e não pessoal, para o dono não mudar se alguém sair.

- GitHub, Vercel, Neon: gratuitos para começar.
- **Vercel:** o plano gratuito (Hobby) **não permite uso comercial**, e este site vive de publicidade. Prevejam o plano Pro.
- Registro.br: precisa de **CPF ou CNPJ brasileiro**. Se for empresa, use o CNPJ da empresa.

✅ Deu certo quando você consegue entrar em todas.

## PASSO 2 — Receber o código

Peça à Seckler Digital para **transferir o repositório** para o seu GitHub (Settings > Danger Zone > Transfer ownership). O repositório é `comparaevs`.

✅ Deu certo quando `https://github.com/SUA-CONTA/comparaevs` abre e tem o arquivo `index.html`.

## PASSO 3 — Receber o banco de dados

A cópia dos dados já está neste repositório: o arquivo **`dados-dump.sql`** (veículos, patrocinadores, leads, cliques etc.).

1. No Neon, crie um projeto novo.
2. Copie a **URL de conexão** (começa com `postgresql://`). Guarde, é uma senha.
3. Crie as tabelas vazias: `node --env-file=.env.local scripts/build-neon-schema.mjs` (com `NEON_DATABASE_URL` no `.env.local`).
4. No Neon, abra o **SQL Editor**, cole o conteúdo de `dados-dump.sql` e execute. Se o arquivo for grande demais para colar, use `psql "SUA_URL" -f dados-dump.sql`.

✅ Deu certo quando a tabela `pbe_veiculos_eletricos` aparece no Neon com cerca de 180 linhas.

> Leads e e-mails de pessoas são dados pessoais. Tratem com cuidado e só usem para o fim para o qual foram dados (LGPD).

## PASSO 4 — Colocar o site no ar na Vercel de vocês

1. Na Vercel: **Add New > Project** e escolha o repositório `comparaevs`.
2. Antes de publicar, abra **Environment Variables** e cadastre:

| Nome | Valor |
|---|---|
| `NEON_DATABASE_URL` | a URL do passo 3 |
| `ADMIN_KEY` | uma senha longa inventada por vocês (é a senha do painel admin) |
| `OPENAI_API_KEY` | chave da OpenAI de vocês (pode deixar de fora; só a busca com IA para de funcionar) |

3. Clique em **Deploy**.

✅ Deu certo quando o endereço `.vercel.app` mostra a lista de carros. Teste: filtrar, comparar 2 carros, abrir a ficha de um modelo.

**Importante:** a partir daqui, **cada vez que alguém publicar na branch `main` do GitHub, o site é atualizado** em produção.

## PASSO 5 — Trocar o dono do domínio (comparaevs.com.br)

Quem vende o endereço é o Registro.br, e o domínio está hoje na conta da Seckler Digital. A troca se chama **troca de titularidade** e **não tira o site do ar**.

1. A Seckler Digital abre a página do domínio `comparaevs.com.br` no Registro.br, procura a opção de alterar/transferir a titularidade e informa o **CPF/CNPJ ou o ID do Registro.br** do novo dono.
2. O novo dono entra na conta dele, acha a solicitação e **confirma**. Se pedirem documento, envie.
3. **Não mexam no DNS durante a troca.**
4. Quando a troca terminar, o novo dono entra no Registro.br e confere o **DNS** do domínio. Ele deve apontar para a Vercel de vocês:
   - Na Vercel: **Settings > Domains > Add** e digite `comparaevs.com.br` e `www.comparaevs.com.br`. A Vercel mostra exatamente quais registros colocar.
   - No Registro.br: coloque esses registros no DNS.
5. **Ligue a renovação automática** no Registro.br. Se o domínio vencer, o site sai do ar.

✅ Deu certo quando `https://www.comparaevs.com.br` abre pelo servidor da Vercel de vocês.

## PASSO 6 — Busca com IA (opcional)

Só precisa da `OPENAI_API_KEY` do passo 4. A OpenAI cobra por uso na conta de quem criou a chave (hoje, a Seckler Digital).

## PASSO 7 — Trocar as senhas e encerrar o acesso antigo

Quando tudo estiver funcionando na conta de vocês:
- A Seckler Digital **apaga o projeto antigo** da Vercel e do Neon e revoga as chaves (OpenAI e outras).
- Vocês confirmam que `ADMIN_KEY` e `OPENAI_API_KEY` são **novas** e só de vocês.

---

## Dia a dia

**Mudar um texto ou página** (`index.html`, `sobre.html`, `veiculo.html`...):
1. Editar o arquivo.
2. Criar uma branch e dar push (a Vercel gera um endereço de **teste**).
3. Se estiver bom, juntar na `main`. Isso publica no site de verdade.

**Painel de administração:** `/admin-7x9k.html`. Pede a `ADMIN_KEY`. Ali se cadastram patrocinadores e se vê cliques e atividade.

**Atualizar a tabela de carros (PBEV/INMETRO):** o INMETRO publica a tabela nova por ano. Os arquivos `_pbev_*.sql` e `_pbev_novos.csv` mostram o formato usado na última carga.

**Rodar no computador** (só para quem programa): crie um `.env.local` com as três variáveis do passo 4 (usando um banco **de teste**, nunca o de produção), depois `npm install` e `node --env-file=.env.local scripts/dev-server.mjs`.

## Regras do site (não quebrem)

- Autonomia, consumo e classificação vêm do INMETRO e **não mudam por causa de patrocínio**. Patrocinado sempre aparece rotulado (veja `sobre.html`).
- O banco hoje tem **só carros elétricos**. Colocar combustão ou híbrido na mesma tabela exige ajustar a API e os filtros, porque esses carros não têm autonomia e apareceriam como "0 km".
- Nunca coloquem `.env.local` ou senhas no GitHub. O `.gitignore` já protege, mas atenção.

## Se algo quebrar

1. **Site fora do ar:** olhem na Vercel a aba **Deployments** e abram o último. O erro aparece no log.
2. **Carros não aparecem:** confira a `NEON_DATABASE_URL` na Vercel e se o Neon não está pausado.
3. **Painel admin diz "Não autorizado":** a `ADMIN_KEY` digitada é diferente da cadastrada na Vercel.
4. **Domínio não abre:** confira o DNS no Registro.br e se a renovação está em dia.
