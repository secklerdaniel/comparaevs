# ComparaEVs — como assumir o site (com o Claude Code)

Site: https://www.comparaevs.com.br — comparador de carros elétricos do Brasil, com dados do INMETRO. Ganha com patrocinadores e leads.

A Seckler Digital está entregando o site e a passagem é feita por vocês, sem depender de ninguém. A forma mais simples é usar o **Claude Code**, um assistente de programação que lê o código e conduz vocês passo a passo. Vocês não precisam saber programar.

## O que vocês fazem

**1. Contratar o Claude Code.** Entrem em https://claude.com/product/claude-code, criem uma conta e assinem um plano pago (Pro ou Max). Instalem o aplicativo Claude (versão para computador) e abram a aba **Code**.

**2. Abrir este repositório.** O endereço é:

https://github.com/secklerdaniel/comparaevs

É público, então não precisa de permissão. No Claude Code, escolham uma pasta vazia do computador. O texto abaixo já pede para ele clonar o repositório.

**3. Colar o texto abaixo** na conversa do Claude Code, do jeito que está, e ir respondendo o que ele perguntar.

---

## Texto para colar no Claude Code

```
Vamos assumir o site ComparaEVs (https://www.comparaevs.com.br), que até agora
estava nas contas da Seckler Digital e está sendo passado para mim. Você vai me
conduzir do começo ao fim. Eu não sei programar: fale em
português, em linguagem simples, UM passo por vez, e diga como eu sei que o
passo deu certo antes de ir para o próximo.

Repositório (público): https://github.com/secklerdaniel/comparaevs

O que fazer:

1. Clone o repositório numa pasta aqui do computador e leia o LEIAME.md, o
   package.json, a pasta api/ e scripts/. Me explique em poucas linhas o que o
   site é e quais são as peças (hospedagem, banco, domínio, IA).

2. Me ajude a criar as MINHAS contas, uma de cada vez (você não cria contas por
   mim; me diga onde clicar):
   - GitHub (para eu fazer o meu fork do repositório e trabalhar nele);
   - Vercel (hospedagem). Aviso: o plano gratuito não permite uso comercial e o
     site vive de publicidade, então me explique o plano Pro;
   - Neon (banco de dados Postgres);
   - OpenAI (só para a busca com IA, opcional);
   - Registro.br (dono do endereço comparaevs.com.br), com CPF ou CNPJ.

3. Faça o fork do repositório para a minha conta do GitHub e passe a trabalhar
   nele (não no original).

4. Banco de dados: crie comigo um projeto novo no Neon e pegue a URL de conexão.
   Crie as tabelas com scripts/build-neon-schema.mjs e carregue os dados com o
   arquivo dados-dump.sql (ele contém veículos, patrocinadores, leads e cliques;
   são dados da Seckler Digital). Confira no final as contagens: cerca de 180
   linhas em pbe_veiculos_eletricos.

5. Vercel: ligue o meu fork do GitHub a um projeto novo e cadastre as variáveis
   de ambiente:
   - NEON_DATABASE_URL = a URL do passo 4
   - ADMIN_KEY = uma senha longa que você gera para mim (é a senha do
     /admin-7x9k.html; me mostre uma vez para eu guardar)
   - OPENAI_API_KEY = a minha chave, se eu quiser a busca com IA
   Faça o deploy e me ajude a testar no endereço .vercel.app: lista de carros,
   filtros, comparar dois modelos e abrir a ficha de um modelo.

6. Domínio comparaevs.com.br: a Seckler Digital precisa transferir a TITULARIDADE
   para mim no Registro.br (troca de titularidade, que não tira o site do ar).
   Me explique o que pedir a ela e o que eu faço na minha conta quando chegar o
   pedido. Só depois da troca, me ajude a configurar o domínio na Vercel e o DNS
   no Registro.br. Lembre-me de ligar a renovação automática.

7. Painel admin: me ensine a entrar em /admin-7x9k.html com a ADMIN_KEY e a
   cadastrar um patrocinador.

8. Fechamento: me liste o que ainda está ligado às contas da Seckler Digital
   (projeto antigo na Vercel, banco antigo, chaves) para eu pedir que sejam
   desligados DEPOIS de tudo funcionar na minha conta.

Regras para você seguir:
- Nunca coloque senhas, chaves ou o arquivo .env.local no GitHub.
- Antes de qualquer ação que apague, publique ou mude o domínio, me explique e
  espere eu dizer sim.
- Não mude o site (textos, layout, dados) sem eu pedir. A tarefa agora é só a
  passagem.
- Regra editorial do site: autonomia, consumo e classificação vêm do INMETRO e
  não mudam por causa de patrocínio; patrocinado sempre aparece rotulado.
- O banco só tem carros ELÉTRICOS. Não adicione combustão ou híbrido sem me
  avisar: eles não têm autonomia e apareceriam como "0 km" nos filtros.
- Se algo der erro, leia a mensagem de erro, me explique o que significa e
  proponha a correção antes de aplicar.
```

---

## Depois da passagem

Para qualquer mudança no site, abram o Claude Code na pasta do projeto e peçam em português o que querem (ex.: "troque o texto do banner", "cadastre um patrocinador"). Cada vez que algo é publicado na `main` do GitHub, a Vercel atualiza o site.

Se o site sair do ar: Vercel > Deployments > último deploy > ver o log. Peçam ao Claude Code para ler o erro e explicar.
