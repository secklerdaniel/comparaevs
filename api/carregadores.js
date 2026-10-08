import { query, sendJson, sendError } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return sendError(res, 405, "Método não suportado.");
  try {
    const rows = await query(
      `select * from public.carregadores where em_estoque = true order by potencia_kw asc`
    );
    return sendJson(res, 200, rows);
  } catch (err) {
    console.error("api/carregadores:", err);
    return sendError(res, 500, err instanceof Error ? err.message : "Erro interno.");
  }
}
