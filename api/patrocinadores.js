import { db, query, sendJson, sendError, isAdmin, safeColumns } from "./_db.js";

// GET sem parâmetro: só ativos, ordenado por ordem (uso público, index.html).
// GET ?all=1, POST/PUT/DELETE: só o admin, com x-admin-key (desde 29/09/2026).
export default async function handler(req, res) {
  try {
    if ((req.method !== "GET" || req.query.all) && !isAdmin(req)) return sendError(res, 401, "Não autorizado.");

    if (req.method === "GET") {
      const rows = req.query.all
        ? await query(`select * from public.patrocinadores_slots order by tipo asc, ordem asc`)
        : await query(
            `select * from public.patrocinadores_slots where ativo = true order by ordem asc`
          );
      return sendJson(res, 200, rows);
    }

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
          `update public.patrocinadores_slots set ${setClause} where id = $${values.length + 1}`,
          [...values, id]
        );
        return sendJson(res, 200, { ok: true });
      }

      const colList = columns.map((c) => `"${c}"`).join(", ");
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
      const values = columns.map((c) => payload[c]);
      const rows = await query(
        `insert into public.patrocinadores_slots (${colList}) values (${placeholders}) returning id`,
        values
      );
      return sendJson(res, 200, rows[0]);
    }

    if (req.method === "DELETE") {
      const id = req.query.id;
      if (!id) return sendError(res, 400, "Parâmetro 'id' obrigatório.");
      await db().query(`delete from public.patrocinadores_slots where id = $1`, [id]);
      return sendJson(res, 200, { ok: true });
    }

    return sendError(res, 405, "Método não suportado.");
  } catch (err) {
    console.error("api/patrocinadores:", err);
    return sendError(res, 500, err instanceof Error ? err.message : "Erro interno.");
  }
}
