import { db, query, sendJson, sendError, safeColumns } from "./_db.js";

// CRM de prospecção (vendas-melvianos.html).
//
// SEM isAdmin() por decisão do Daniel em 30/09/2026: a página é aberta.
// Diferente das outras rotas do projeto — se um dia ela for fechada, o padrão
// da casa é `if (!isAdmin(req)) return sendError(res, 401, "Não autorizado.");`
//
// ?recurso=interacoes opera na tabela de histórico em vez da de leads.
const TABELAS = {
  leads: { nome: "leads_prospeccao", ordem: "score desc nulls last" },
  interacoes: { nome: "leads_prospeccao_interacoes", ordem: "data_interacao desc" },
};

export default async function handler(req, res) {
  const alvo = TABELAS[req.query.recurso === "interacoes" ? "interacoes" : "leads"];
  try {
    if (req.method === "GET") {
      // interações vêm sempre de um lead; leads vêm todos
      if (alvo.nome.endsWith("interacoes")) {
        const leadId = req.query.lead_id;
        if (!leadId) return sendError(res, 400, "Parâmetro 'lead_id' obrigatório.");
        return sendJson(res, 200, await query(
          `select * from public.${alvo.nome} where lead_id = $1 order by ${alvo.ordem}`,
          [leadId]
        ));
      }
      return sendJson(res, 200, await query(
        `select * from public.${alvo.nome} order by ${alvo.ordem}`
      ));
    }

    if (req.method === "POST" || req.method === "PUT") {
      const payload = req.body ?? {};
      const { id, ...campos } = payload;
      const nomes = Object.keys(req.method === "PUT" ? campos : payload);
      if (!nomes.length) return sendError(res, 400, "Corpo vazio.");
      if (!safeColumns(nomes)) return sendError(res, 400, "Nome de coluna inválido.");

      if (req.method === "PUT") {
        if (!id) return sendError(res, 400, "Parâmetro 'id' obrigatório pra atualizar.");
        const sets = nomes.map((c, i) => `"${c}" = $${i + 1}`).join(", ");
        const valores = nomes.map((c) => campos[c]);
        await db().query(
          `update public.${alvo.nome} set ${sets} where id = $${valores.length + 1}`,
          [...valores, id]
        );
        return sendJson(res, 200, { ok: true });
      }

      const cols = nomes.map((c) => `"${c}"`).join(", ");
      const marcas = nomes.map((_, i) => `$${i + 1}`).join(", ");
      const linhas = await query(
        `insert into public.${alvo.nome} (${cols}) values (${marcas}) returning id`,
        nomes.map((c) => payload[c])
      );
      return sendJson(res, 200, linhas[0]);
    }

    if (req.method === "DELETE") {
      const id = req.query.id;
      if (!id) return sendError(res, 400, "Parâmetro 'id' obrigatório.");
      await db().query(`delete from public.${alvo.nome} where id = $1`, [id]);
      return sendJson(res, 200, { ok: true });
    }

    return sendError(res, 405, "Método não suportado.");
  } catch (err) {
    console.error("api/leads-prospeccao:", err);
    return sendError(res, 500, err instanceof Error ? err.message : "Erro interno.");
  }
}
