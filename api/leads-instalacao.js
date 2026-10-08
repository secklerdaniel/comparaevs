import { db, query, sendJson, sendError, isAdmin } from "./_db.js";

// POST: formulário público de orçamento de wallbox (index.html, carregadores.html).
// GET:  listagem pro admin.
export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      if (!isAdmin(req)) return sendError(res, 401, "Não autorizado.");  // nome e telefone
      const rows = await query(
        `select id, criado_em, nome, telefone, cep, tipo_imovel, origem
           from public.leads_instalacao
          order by criado_em desc`
      );
      return sendJson(res, 200, rows);
    }

    if (req.method === "POST") {
      const { nome, telefone, cep, tipo_imovel, origem } = req.body ?? {};
      if (!nome || !telefone || !cep || !tipo_imovel) {
        return sendError(res, 400, "Campos 'nome', 'telefone', 'cep' e 'tipo_imovel' obrigatórios.");
      }
      await db().query(
        `insert into public.leads_instalacao (nome, telefone, cep, tipo_imovel, origem)
         values ($1, $2, $3, $4, $5)`,
        [nome, telefone, cep, tipo_imovel, origem ?? "guia-como-escolher"]
      );
      return sendJson(res, 200, { ok: true });
    }

    return sendError(res, 405, "Método não suportado.");
  } catch (err) {
    console.error("api/leads-instalacao:", err);
    return sendError(res, 500, err instanceof Error ? err.message : "Erro interno.");
  }
}
