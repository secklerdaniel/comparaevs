import { db, query, sendJson, sendError, isAdmin, safeColumns } from "./_db.js";
import buscaIA from "./_busca-ia.js";

// GET: lista pública (usada pelo index.html) e também pelo admin (mesma
// tabela, outra ordenação). POST/PUT/DELETE: só o admin, com x-admin-key
// (desde 29/09/2026; antes a URL era pública e qualquer um apagava carros).
export default async function handler(req, res) {
  // Busca com IA mora aqui por causa do teto de 12 funções do plano Hobby da
  // Vercel (a lógica está em _busca-ia.js, que não conta como função).
  if (req.query.ia) return buscaIA(req, res);
  try {
    if (req.method === "GET") {
      const orderBy = req.query.order === "marca"
        ? `"Marca" asc, "Modelo_Versao" asc`
        : `"Autonomia_km" desc`;
      const rows = await query(`select * from public.pbe_veiculos_eletricos order by ${orderBy}`);
      return sendJson(res, 200, rows);
    }

    if (!isAdmin(req)) return sendError(res, 401, "Não autorizado.");

    if (req.method === "POST" || req.method === "PUT") {
      const payload = req.body ?? {};
      const columns = Object.keys(payload);
      if (columns.length === 0) return sendError(res, 400, "Corpo vazio.");
      if (!safeColumns(columns)) return sendError(res, 400, "Nome de campo inválido.");

      if (req.method === "PUT") {
        const { id, ...fields } = payload;
        if (!id) return sendError(res, 400, "Parâmetro 'id' obrigatório pra atualizar.");
        const fieldNames = Object.keys(fields);
        const setClause = fieldNames.map((c, i) => `"${c}" = $${i + 1}`).join(", ");
        const values = fieldNames.map((c) => fields[c]);
        await db().query(
          `update public.pbe_veiculos_eletricos set ${setClause} where id = $${values.length + 1}`,
          [...values, id]
        );
        return sendJson(res, 200, { ok: true });
      }

      const colList = columns.map((c) => `"${c}"`).join(", ");
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
      const values = columns.map((c) => payload[c]);
      const rows = await query(
        `insert into public.pbe_veiculos_eletricos (${colList}) values (${placeholders}) returning id`,
        values
      );
      return sendJson(res, 200, rows[0]);
    }

    if (req.method === "DELETE") {
      const id = req.query.id;
      if (!id) return sendError(res, 400, "Parâmetro 'id' obrigatório.");
      await db().query(`delete from public.pbe_veiculos_eletricos where id = $1`, [id]);
      return sendJson(res, 200, { ok: true });
    }

    return sendError(res, 405, "Método não suportado.");
  } catch (err) {
    console.error("api/veiculos:", err);
    return sendError(res, 500, err instanceof Error ? err.message : "Erro interno.");
  }
}
