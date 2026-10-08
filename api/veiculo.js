import { query, sendJson, sendError } from "./_db.js";

// GET /api/veiculo?id=123 — usado por veiculo.html (ficha técnica de um
// modelo só). Espelha o fetch direto ao PostgREST que o veiculo.html fazia
// (?id=eq.X&select=*), só que contra o Neon agora.
export default async function handler(req, res) {
  if (req.method !== "GET") return sendError(res, 405, "Método não suportado.");

  const id = req.query.id;
  if (!id) return sendError(res, 400, "Parâmetro 'id' obrigatório.");

  try {
    const rows = await query(`select * from public.pbe_veiculos_eletricos where id = $1`, [id]);
    if (rows.length === 0) return sendError(res, 404, "Veículo não encontrado.");
    return sendJson(res, 200, rows[0]);
  } catch (err) {
    console.error("api/veiculo:", err);
    return sendError(res, 500, err instanceof Error ? err.message : "Erro interno.");
  }
}
