import { db, query, sendJson, sendError, isAdmin } from "./_db.js";

// POST: rastreamento público de clique (index.html, carregadores.html,
// motos.html — best-effort, o chamador original já engolia erro aqui).
// GET ?desde=ISO: usado pelo admin, até 2000 eventos mais recentes.
export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { tipo_evento, veiculo_id, patrocinador_id, detalhe, pagina } = req.body ?? {};
      if (!tipo_evento) return sendError(res, 400, "Campo 'tipo_evento' obrigatório.");
      await db().query(
        `insert into public.eventos_cliques (tipo_evento, veiculo_id, patrocinador_id, detalhe, pagina)
         values ($1, $2, $3, $4, $5)`,
        [tipo_evento, veiculo_id ?? null, patrocinador_id ?? null, detalhe ?? null, pagina ?? null]
      );
      return sendJson(res, 200, { ok: true });
    }

    if (req.method === "GET") {
      if (!isAdmin(req)) return sendError(res, 401, "Não autorizado.");
      const desde = req.query.desde;
      const rows = desde
        ? await query(
            `select * from public.eventos_cliques where created_at >= $1 order by created_at desc limit 2000`,
            [desde]
          )
        : await query(`select * from public.eventos_cliques order by created_at desc limit 2000`);
      return sendJson(res, 200, rows);
    }

    return sendError(res, 405, "Método não suportado.");
  } catch (err) {
    console.error("api/eventos:", err);
    return sendError(res, 500, err instanceof Error ? err.message : "Erro interno.");
  }
}
