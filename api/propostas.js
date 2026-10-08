import { db, query, sendJson, sendError, isAdmin } from "./_db.js";

// GET ?slug=xxx  -> PÚBLICO. É o link que o cliente abre; devolve uma proposta só.
// GET            -> admin. Lista tudo, pro Hilter ver o que já mandou.
// POST           -> admin. Cria e devolve o slug.
// PUT            -> admin. Muda status (aceita/recusada) ou corrige a proposta.
//
// Slug curto e sem ambiguidade visual: sem 0/O e 1/l, porque o link é lido
// e às vezes digitado no celular.
const ALFABETO = "23456789abcdefghijkmnpqrstuvwxyz";

function novoSlug() {
  let s = "";
  for (let i = 0; i < 7; i++) s += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
  return s;
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { slug } = req.query;
      if (slug) {
        const linhas = await query(`select * from public.propostas where slug = $1`, [slug]);
        if (!linhas.length) return sendError(res, 404, "Proposta não encontrada.");
        return sendJson(res, 200, linhas[0]);
      }
      if (!isAdmin(req)) return sendError(res, 401, "Não autorizado.");
      return sendJson(res, 200, await query(
        `select * from public.propostas order by criado_em desc`
      ));
    }

    if (req.method === "POST") {
      if (!isAdmin(req)) return sendError(res, 401, "Não autorizado.");
      const b = req.body ?? {};
      if (!b.cliente_nome) return sendError(res, 400, "Informe o nome do cliente.");
      if (!Array.isArray(b.itens) || !b.itens.length) return sendError(res, 400, "Selecione ao menos um espaço.");

      // tenta alguns slugs: colisão é improvável, mas a coluna é unique
      for (let tentativa = 0; tentativa < 5; tentativa++) {
        const slug = novoSlug();
        try {
          await db().query(
            `insert into public.propostas
               (slug, cliente_nome, cliente_empresa, cliente_whatsapp, itens,
                meses_gratis, desconto, inicio, observacoes, validade_dias, vendedor)
             values ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,$9,$10,$11)`,
            [slug, b.cliente_nome, b.cliente_empresa ?? null, b.cliente_whatsapp ?? null,
             JSON.stringify(b.itens), b.meses_gratis ?? 0, b.desconto ?? 0,
             b.inicio || null, b.observacoes ?? null, b.validade_dias ?? 7, b.vendedor ?? null]
          );
          return sendJson(res, 200, { ok: true, slug });
        } catch (e) {
          if (!String(e.message).includes("propostas_slug_key")) throw e;
        }
      }
      return sendError(res, 500, "Não consegui gerar um link único.");
    }

    if (req.method === "PUT") {
      if (!isAdmin(req)) return sendError(res, 401, "Não autorizado.");
      const { slug, status } = req.body ?? {};
      if (!slug || !status) return sendError(res, 400, "Informe 'slug' e 'status'.");
      await db().query(`update public.propostas set status = $1 where slug = $2`, [status, slug]);
      return sendJson(res, 200, { ok: true });
    }

    if (req.method === "DELETE") {
      if (!isAdmin(req)) return sendError(res, 401, "Não autorizado.");
      const { slug } = req.query;
      if (!slug) return sendError(res, 400, "Parâmetro 'slug' obrigatório.");
      await db().query(`delete from public.propostas where slug = $1`, [slug]);
      return sendJson(res, 200, { ok: true });
    }

    return sendError(res, 405, "Método não suportado.");
  } catch (err) {
    console.error("api/propostas:", err);
    return sendError(res, 500, err instanceof Error ? err.message : "Erro interno.");
  }
}
